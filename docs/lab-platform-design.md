# Lab Platform 設計

## 目標

將現有純靜態 Workshop 網站升級為具備 Lab 生命週期管理的平台：

1. 首頁改為講師後台 — 管理 workshop、查看所有學員狀態
2. 學員透過 Event Code 直接進入對應 workshop — 不經過首頁
3. 學員可在頁面上一鍵部署/銷毀個人 Lab 環境
4. 維持 S3 + CloudFront 靜態部署（帳號 A），後端只加一個 Lambda Function URL（帳號 B）

---

## 帳號架構

```
帳號 A（部門帳號）                帳號 B（Lab 帳號）
└── S3 + CloudFront               ├── Infra Stack（講師部署一次）
    └── Workshop 靜態網站          │   ├── VPC、ALB、ECS Cluster、ECR、RDS
        ├── HTML/CSS/JS            │   ├── IAM Roles（共用）
        ├── Markdown 內容          │   ├── Lambda Function URL
        ├── credentials.json       │   └── Security Groups
        └── yaml templates         ├── User Stacks × N（每個學員一份）
                                   │   ├── Command Host EC2
                                   │   ├── S3 Bucket
                                   │   └── ALB Target Group + Listener Rule
                                   └── IAM Users（學員登入 Console 用）
```

- 帳號 A：公司部門工具帳號，只負責託管靜態網站，長期存在
- 帳號 B：Lab 環境帳號，活動期間建立，活動結束後清除所有資源
- Lambda 部署在帳號 B，直接操作帳號 B 的 CloudFormation，不需要跨帳號 assume role
- 前端（帳號 A）呼叫帳號 B 的 Lambda Function URL — 跨 origin HTTPS，Lambda Function URL 原生支援 CORS

---

## 路由設計（Hash-based）

| Hash | View | 角色 | 說明 |
|------|------|------|------|
| (空) | dashboard | 講師 | 講師後台，需密碼進入 |
| #join | join | 學員 | 學員入口，輸入 Event Code |
| #join/{eventCode} | join | 學員 | 帶 Event Code 的直連（QR Code 用） |
| #login/{slug} | login | 學員 | Workshop 登入（輸入 username） |
| #{slug}/{chapterId} | reader | 學員 | 閱讀章節 |

---

## 學員流程

### 進入方式

```
方式 A：掃 QR Code
  https://workshop.example.com/#join/ECS-2026-TPE
  → 自動帶入 Event Code → 輸入 username → 進入 workshop

方式 B：手動輸入
  https://workshop.example.com/#join
  → 輸入 Event Code → 輸入 username → 進入 workshop
```

### Event Code 對應機制

Event Code 定義在每個 workshop 的 `credentials.json` 裡。前端收到 Event Code 後，遍歷所有 workshop 的 credentials.json 找到匹配的：

```
學員輸入 Event Code "ECS-2026-TPE"
    ↓
前端遍歷 config.json 裡的 workshops
    ↓
fetch 每個 workshop 的 credentials.json
    ↓
找到 eventCode === "ECS-2026-TPE" 的 workshop
    ↓
導向該 workshop 的登入頁（輸入 username）
```

學員不需要知道 workshop 的 slug，只需要一個 Event Code。

### 登入後完整流程

```
1. 輸入 Event Code → 找到對應 workshop
2. 輸入 Username → 驗證在 users 列表中
3. 進入 workshop reader
4. 點擊「部署 Lab」→ 前端自動計算 priority → POST Lambda
5. 等待部署完成 → 顯示 Outputs（可複製）
6. 依照章節操作（Task 2-5）
7. 點擊「銷毀 Lab」→ Lambda 刪除 User Stack
```

---

## 講師後台

### 進入方式

首頁（空 hash）顯示講師後台登入。管理密碼存在 Lambda 環境變數中（不在前端）。

前端輸入密碼後存 `sessionStorage`，每次呼叫 Lambda 的管理 API 都帶上密碼，Lambda 比對環境變數驗證。前端後台頁面本身是空殼，沒有密碼就拿不到任何資料。

### 後台功能

| 功能 | 說明 | 技術實現 |
|------|------|----------|
| Workshop 列表 | 顯示所有 workshop 卡片 | 現有 renderLanding() |
| 學員狀態 | 每個 workshop 的學員 Lab 狀態 | Lambda `list` action |
| 批次部署 | 一鍵為所有學員建立 Lab | Lambda 迴圈 `create` |
| 批次銷毀 | 一鍵刪除所有學員 Lab | Lambda 迴圈 `delete` |
| Event Code 顯示 | 顯示 QR Code + 直連 URL | 前端產生 |

### 講師學員狀態面板

講師後台顯示每個 workshop 的所有學員 Lab 狀態表格：

- 每列顯示：學員名稱、Stack 狀態（badge）、操作按鈕（部署/銷毀/重試）
- 狀態 badge：`CREATE_COMPLETE`（綠）、`CREATE_IN_PROGRESS`（藍）、`CREATE_FAILED`（紅）、未部署（灰）
- 底部操作列：全部部署、全部銷毀、重新整理
- 頂部顯示 Workshop 名稱 + Event Code + QR Code 直連

### 學員 Lab 面板（reader view 內）

學員只看到自己的 Lab 狀態。嵌在 reader view 側邊欄底部（登出按鈕上方）。

**狀態流轉：**

```
未部署 → [部署 Lab] 按鈕
    ↓ 點擊
部署中 → spinner + "正在建立環境..." + 經過時間
    ↓ 每 5 秒輪詢
完成   → ✅ 環境就緒 + Outputs（可複製）+ [銷毀 Lab]
失敗   → ❌ 建立失敗 + 錯誤訊息 + [重試] + [銷毀]
```

**Outputs 顯示（完成後）：**

只顯示學員實際需要的值，每個值旁邊有複製按鈕：

| 項目 | 值 |
|------|-----|
| Command Host | Session Manager 連結（可點擊） |
| ECR Repository | URI（可複製） |
| ALB DNS | URL（可複製） |
| S3 Bucket | 名稱（可複製） |
| RDS Endpoint | 端點（可複製） |
| Security Group | ID（可複製） |
| Target Group ARN | ARN（可複製） |

---

## Lambda Function URL 設計

### 部署位置

Lambda 部署在帳號 B（Lab 帳號），包含在 `ecs-fargate-lab-infra.yaml` 裡，跟 Infra Stack 一起建立和刪除。

### 安全機制

- `AuthType: NONE`（公開 URL），但 Lambda 內部驗證 token
- 每次請求必須帶 `token` 欄位，Lambda 比對環境變數 `API_TOKEN`
- Token 存在 `credentials.json` 的 `labConfig.apiToken` 裡，前端讀取後帶入請求
- 管理操作（list、batch）額外驗證 `adminPassword`
- Workshop 是短期活動（1-2 天），活動結束後 Infra Stack 連同 Lambda 一起刪除

### API 定義

```
POST https://xxx.lambda-url.us-east-1.on.aws/

Request Body:
{
  "action": "create" | "status" | "delete" | "list",
  "token": "api-token-here",
  "username": "alice",
  "labName": "deploying-app-with-ecs-fargate",
  "templateUrl": "https://bucket.s3.amazonaws.com/content/.../ecs-fargate-lab-user.yaml",
  "priority": 3
}
```

`labName` 由前端從 `_manifest.json` 的 `labName` 欄位帶入（build.sh 自動產生）。

| Action | 用途 | 參數 | 回傳 | 權限 |
|--------|------|------|------|------|
| create | 建立學員 Stack | username, labName, templateUrl, priority | { status, stackName } | token |
| status | 查詢 Stack 狀態 | username, labName | { status, outputs, events } | token |
| delete | 刪除學員 Stack（含清空 S3） | username, labName | { status } | token |
| list | 列出所有學員 Stack | labName, adminPassword | { stacks: [...] } | token + admin |

### Priority 自動計算

前端根據 `credentials.json` 的 users 陣列 index 自動計算 priority：

```json
{ "users": ["alice", "bob", "charlie"] }
```

- `alice` → priority 1
- `bob` → priority 2  
- `charlie` → priority 3

**重要約束：users 陣列只能 append，不能插入或重排。** 臨時加人時 append 到最後，既有學員的 priority 不受影響。

### Delete 行為

Lambda `delete` action 只做兩件事：
1. 清空學員的 S3 Bucket（CloudFormation 無法刪除非空 Bucket）
2. 刪除 User Stack（Command Host、S3 Bucket、Target Group、Listener Rule）

學員手動建立的資源（ECS Service、Task Definition、CloudWatch Logs）不在 User Stack 裡，由：
- 學員依照 Task 6 說明手動清除
- 或講師活動結束後用 CLI 批次清理

### Lambda IAM 權限

```yaml
- Effect: Allow
  Action:
    - cloudformation:CreateStack
    - cloudformation:DeleteStack
    - cloudformation:DescribeStacks
    - cloudformation:ListStacks
  Resource: '*'
- Effect: Allow
  Action:
    - iam:CreateRole
    - iam:DeleteRole
    - iam:AttachRolePolicy
    - iam:DetachRolePolicy
    - iam:PutRolePolicy
    - iam:DeleteRolePolicy
    - iam:CreateInstanceProfile
    - iam:DeleteInstanceProfile
    - iam:AddRoleToInstanceProfile
    - iam:RemoveRoleFromInstanceProfile
    - iam:PassRole
    - iam:GetRole
    - iam:GetRolePolicy
  Resource: '*'
- Effect: Allow
  Action:
    - ec2:*
    - s3:*
    - elasticloadbalancing:*
  Resource: '*'
```

---

## credentials.json 與 _manifest.json

兩個檔案職責分離，互不干擾：

| 檔案 | 誰管 | 內容 |
|------|------|------|
| `_manifest.json` | build.sh 自動產生 | 章節列表、title、icon、labTemplate 路徑 |
| `credentials.json` | 講師手動維護 | eventCode、users、labConfig |

### credentials.json（講師手動）

```json
{
  "eventCode": "ECS-2026-TPE",
  "users": ["alice", "bob", "charlie"],
  "labConfig": {
    "lambdaUrl": "https://xxx.lambda-url.us-east-1.on.aws/",
    "apiToken": "workshop-token-2026"
  }
}
```

- `lambdaUrl`：帳號 B 的 Lambda Function URL
- `apiToken`：API 驗證 token，與 Lambda 環境變數一致
- 沒有 `labConfig` → 純內容 workshop，無 Lab 功能（向下相容）
- **users 陣列只能 append，不能插入或重排**（priority 由 array index 決定）

### _manifest.json（build.sh 自動）

```json
{
  "title": "ECS 容器化服務實戰",
  "description": "...",
  "pages": ["_index.md", "01-concepts/_index.md", ...],
  "labTemplate": "02-cluster-setup/ecs-fargate-lab-user.yaml",
  "labName": "ecs-fargate-lab"
}
```

- `labTemplate`：build.sh 自動掃描 `*-user.yaml`，找到就寫入
- `labName`：build.sh 自動從 infra template 的檔名推導（例如 `ecs-fargate-lab-infra.yaml` → `ecs-fargate-lab`），寫入 _manifest.json。前端從 _manifest.json 讀取，不需要講師手動設定

---

## 前端改動清單

### app.js

| 區塊 | 改動 | 工作量 |
|------|------|--------|
| Router | 新增 `join` view + `dashboard` view | 中 |
| Join 頁面 | Event Code 輸入 → 查找對應 workshop → 導向登入 | 小 |
| Dashboard | 密碼驗證（via Lambda）+ workshop 列表 + 學員狀態面板 | 大 |
| Lab 面板 | reader view 加入部署/銷毀按鈕 + 狀態輪詢 + Outputs 顯示 | 中 |
| Login 流程 | 登入後自動檢查 Lab 狀態 | 小 |

### index.html

| 區塊 | 改動 |
|------|------|
| 新增 Join 頁面 | Event Code 輸入表單 |
| 新增 Dashboard | 講師後台容器 |
| 新增 Lab 面板 | 部署按鈕 + 狀態顯示 + Outputs 表格 |
| Landing 頁面 | 改為 Dashboard 入口 |

### style.css

| 區塊 | 改動 |
|------|------|
| Join 頁面 | 類似現有 login 頁面 |
| Dashboard | 表格 + 狀態 badge |
| Lab 面板 | 按鈕 + 進度條 + Outputs 卡片 |

### CloudFormation

| 檔案 | 改動 |
|------|------|
| ecs-fargate-lab-infra.yaml | 新增 Lambda + Function URL + IAM Role（約 80 行） |

---

## 實作順序

```
Phase 1 — Lambda 後端
  ├── infra.yaml 加入 Lambda + Function URL + IAM Role
  ├── 新增 Parameters：ApiToken、AdminPassword
  ├── 部署 Infra Stack 至帳號 B
  └── 用 curl 測試 create / status / delete / list

Phase 2 — 學員入口
  ├── build.sh 更新：自動掃描 *-user.yaml 寫入 _manifest.json 的 labTemplate
  ├── index.html 加入 join 頁面 + lab 面板
  ├── app.js 加入 join view + Event Code 查找邏輯
  ├── app.js 加入 lab 面板（部署/狀態/銷毀 + 輪詢）
  └── 02-cluster-setup 章節內容簡化（手動步驟改為 expand fallback）

Phase 3 — 講師後台
  ├── index.html 加入 dashboard 頁面
  ├── app.js 加入 dashboard view + 密碼驗證
  ├── app.js 加入學員狀態面板 + 批次操作
  └── Event Code QR Code 產生
```

---

## 向下相容

| 情境 | 行為 |
|------|------|
| 沒有 credentials.json | 公開 workshop，不需登入，無 Lab 功能 |
| 有 credentials.json 但沒有 labConfig | 需登入，Lab 手動部署（現有行為） |
| 有 credentials.json + labConfig | 需登入，Lab 一鍵部署 |
| 講師直接開首頁 | 顯示 Dashboard 登入 |
| 學員開 #join | 顯示 Event Code 輸入頁 |
| 學員用舊的 #{slug} 直連 | 仍然可用 |

---

## 成本影響

| 新增資源 | 成本 |
|----------|------|
| Lambda Function（帳號 B） | 免費（100 萬次/月以內） |
| Lambda Function URL | 免費 |
| CloudWatch Logs | 極低 |

不需要 API Gateway、Cognito、DynamoDB。新增成本趨近於零。

---

## 可選升級路徑

以下為未來可考慮的增強，現階段不實作：

| 升級項目 | 說明 | 觸發條件 |
|----------|------|----------|
| DynamoDB 認證 | 將 credentials 從靜態檔搬到 DynamoDB，前端不再直接 fetch credentials.json | 需要更強的安全性時 |
| Lambda 驗證登入 | 新增 `verify` action，前端透過 Lambda 驗證 username + eventCode | 搭配 DynamoDB 認證 |
| Lab 自動過期 | CloudWatch Events 定時觸發 Lambda 清理超時的 Stack | 擔心學員忘記清除時 |
| Cognito 整合 | 取代 credentials.json，統一認證 + 支援 CloudFront signed cookies | 需要保護 workshop 內容本身時 |
| 深度清除 | Lambda delete 額外清理 ECS Service、Task Def、CloudWatch Logs | 講師不想用 CLI 清理時 |

---

## 狀態

🟡 設計完成 — 待確認後開始 Phase 1 實作
