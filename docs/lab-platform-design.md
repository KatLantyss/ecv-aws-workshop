# Lab Platform 設計構想

## 背景

目前 workshop 是純靜態網站（S3 + CloudFront），多個學員在同一 AWS 帳號下使用同一份 CloudFormation template 會造成 resource name 衝突。需要一套系統讓每個學員有獨立的 lab 環境。

## 目標體驗

1. 學員用講師提供的 username/password 登入 workshop 頁面
2. 頁面上有「Start Lab」按鈕，點擊後自動在 AWS 建立該學員專屬的 lab 環境
3. 建立完成後，頁面顯示所有需要的資訊（Stack Output），可快速複製
4. Workshop 內容中的資源名稱自動帶上學員的 prefix
5. 結束後可「End Lab」自動清除資源

## 約束條件

- 單一 AWS 帳號，20 人以內同時使用
- 盡量維持低成本（serverless 優先）
- 不使用 AWS Organizations（門檻太高、成本不合理）
- 現有 S3 + CloudFront 靜態部署盡量保留

## 架構概覽

```
CloudFront + S3（workshop 靜態內容）
       │
Cognito User Pool（學員認證）
       │
API Gateway + Lambda（Start/End Lab、查詢 Stack Output）
       │
CloudFormation（建/刪學員的 lab 環境）
       │
DynamoDB（記錄每個學員的 stack 狀態和 output）
```

## 子系統拆解

### 1. 認證系統
- Cognito User Pool + 講師管理學員帳號
- 學員用帳密登入 workshop 頁面
- 登入後取得 username 作為 resource prefix
- 可搭配 CloudFront signed cookies 保護 workshop 內容

### 2. Lab 生命週期 API
- API Gateway + Lambda
- `POST /lab/start` — 用學員 username 當 prefix，建立 CloudFormation stack
- `GET /lab/status` — 查詢 stack 建立狀態和 output
- `POST /lab/stop` — 刪除 CloudFormation stack
- Lambda 需要 CloudFormation + 相關服務的 IAM 權限

### 3. 資料層
- DynamoDB table 記錄每個學員的 lab 狀態
- Schema: `userId` (PK), `workshopId` (SK), `stackName`, `status`, `outputs`, `createdAt`, `ttl`
- TTL 可用於自動過期提醒或清理

### 4. 前端整合
- Workshop 頁面新增登入 UI（Cognito Hosted UI 或自建表單）
- 登入後顯示「Start Lab」按鈕
- Lab 啟動後顯示 Stack Output（可複製）
- Workshop 內容中的資源名稱用變數語法，自動替換為學員的 prefix
- 下載 CloudFormation template 時自動帶入 prefix

### 5. CloudFormation 參數化
- 現有 template 加上 `UserPrefix` 參數
- 所有 resource name 改為 `!Sub "${UserPrefix}-original-name"`
- Output 也帶 prefix

### 6. 講師管理工具
- 批次建立/刪除 Cognito 學員帳號（CLI 腳本）
- 監控所有學員的 lab 狀態（Dashboard 或 CLI）
- 批次清理所有 lab 環境（End Lab for all）
- 匯出學員帳密卡片（PDF 或 CSV）

## 建議實作順序

1. CloudFormation 參數化（5）— 最小改動，立即解決 resource 衝突
2. 認證系統（1）+ 資料層（3）— 後端基礎設施
3. Lab 生命週期 API（2）— 核心功能
4. 前端整合（4）— 串接 UI
5. 講師管理工具（6）— 運維輔助

## 成本估算（閒置時）

| 服務 | 閒置成本 |
|------|----------|
| Cognito | 免費（50,000 MAU 以內） |
| API Gateway | 免費（100 萬次/月以內） |
| Lambda | 免費（100 萬次/月以內） |
| DynamoDB | 免費（25 GB + 25 WCU/RCU 以內） |
| S3 + CloudFront | 現有成本不變 |

學員實際操作時的費用主要來自 lab 環境本身（ECS、RDS、ALB 等），與平台無關。

## 替代方案（已排除）

- **AWS Organizations + Innovation Sandbox**：需要 management account、Control Tower、帳號池，每月 ~$65 基礎成本，20 人規模不划算
- **純前端 prefix 輸入（無後端）**：無法自動建立 lab 環境，學員需手動操作 CloudFormation，體驗差
- **IAM User 直接當 prefix（無 Cognito）**：可行但無法保護 workshop 內容，也無法自動化 lab 生命週期

## 狀態

🟡 構想階段 — 待後續逐一設計各子系統
