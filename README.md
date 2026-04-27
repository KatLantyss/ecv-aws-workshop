# ECV AWS Workshop

輕量級靜態 Workshop 網站框架，無需 build tool，純 HTML/CSS/JS + Markdown。

## 架構概覽

```
├── index.html          # 單頁應用入口
├── app.js              # 核心邏輯（Router、Markdown 渲染、自訂語法、Auth）
├── style.css           # 樣式（dark/light theme）
├── config.json         # 網站設定（title、workshops 列表）
├── build.sh            # 自動掃描 content/ 產生索引
├── deploy.sh           # S3 + CloudFront 部署腳本
├── assets/             # 全站靜態資源（logo 等）
├── infra/              # 講師用 CloudFormation（不部署到 S3）
│   └── ecs-fargate-lab-infra.yaml
├── docs/               # 設計文件
│   └── lab-platform-design.md
└── content/            # Workshop 內容
    └── my-workshop/
        ├── _manifest.json   # Workshop metadata（卡片資訊）
        ├── credentials.json # 選填，有此檔案的 workshop 需要登入
        ├── _index.md        # Workshop 首頁
        ├── 01-chapter/
        │   ├── _index.md    # 章節頁面
        │   ├── diagram.png  # 圖片放頁面資料夾
        │   └── ecs-fargate-lab-user.yaml  # 學員下載的 template
        └── cleanup.md
```

## 核心機制

- **Router**：集中式 state machine，三個 view（home/login/reader）互斥切換
  - Hash patterns：`(空)` → 首頁、`#login/{slug}` → 登入、`#{slug}/{chapterId}` → 閱讀
  - 所有導航經過 `router.go(action, params)`，統一管理 hash 和 history
  - `hashchange` 只觸發 `router.resolve()`，避免散落的 hash 操作互相衝突
- **認證**：per-workshop 的 event code 機制
  - Workshop 目錄下放 `credentials.json` → 進入時需要登入
  - 沒有 `credentials.json` → 公開 workshop，不需要登入
  - 登入狀態存 `localStorage`（per-workshop），event code 變更時自動失效
  - `{{USERNAME}}` 變數在 markdown 渲染時自動替換為登入的 username
- **Markdown**：使用 marked.js v15 渲染，支援 GFM
- **自訂語法**：`preprocessCustomSyntax()` 在 marked 之前處理 `::` / `:::` 語法
- **Mermaid**：支援 `mermaid` code block，自動偵測 dark/light 主題
- **Icon**：自訂 `aws-*` icon（16x16 SVG）+ Lucide icon fallback
- **索引**：`config.json` 列出 workshops，每個 workshop 的 `_manifest.json` 列出 pages
- **build.sh**：掃描 `content/` 自動更新 `config.json` 和 `_manifest.json`，`_` 開頭的資料夾會被忽略
- **主題**：支援 dark/light 切換，`localStorage` 持久化，`<meta name="theme-color">` 同步更新
- **圖片**：預設 85% 寬度置中，支援自訂寬度 `{width="60%"}`、Caption（`"說明文字"`）、點擊放大（Lightbox）
- **無障礙**：符合 [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)，包含：
  - Skip link、`aria-label`、`aria-expanded`、`aria-live`、`aria-modal`
  - WAI-ARIA Tabs Pattern（`role="tablist/tab/tabpanel"`、鍵盤方向鍵導航）
  - Expand 使用語義化 `<button>` + `aria-expanded`
  - 圖片放大使用語義化 `<button>` + Lightbox `inert` 背景隔離
  - `prefers-reduced-motion` 全域支援
  - `:focus-visible` 焦點樣式、`scroll-margin-top` heading 錨點
  - `touch-action: manipulation`、`overscroll-behavior: contain`
  - `env(safe-area-inset-*)` notch 安全區域
  - `text-wrap:balance` heading 防孤字
- **SEO**：`<meta name="description">`、Open Graph tags（`og:title`、`og:description`、`og:type`、`og:locale`）
- **效能**：font preconnect/preload、`loading="lazy"` 圖片、明確列出 transition 屬性（無 `transition: all`）

## 自訂 Markdown 語法

### 行內元件（`::` 前綴）

| 語法 | 說明 |
|------|------|
| `::badge[文字]{type="info"}` | 標籤，type: info/success/warning/danger/default |
| `::status[文字]{type="success" icon="circle-check"}` | 狀態文字，帶 icon + 顏色 |
| `::button[文字]{variant="action"}` | 按鈕，variant: action/default/disabled |
| `::button[文字]{variant="default" prefix="aws-new-tab"}` | 按鈕帶前方 icon |
| `::button[文字]{variant="default" postfix="aws-new-tab"}` | 按鈕帶後方 icon |
| `::button[文字]{variant="action" split="aws-expand"}` | Split 按鈕 |
| `::button[]{variant="default" prefix="aws-refresh"}` | 純 icon 按鈕 |
| `::video{src="https://youtube.com/watch?v=ID"}` | YouTube 嵌入 |
| ` ``可複製文字`` ` | 可複製行內 code（雙 backtick） |

### 區塊元件（`:::` 前綴）

| 語法 | 說明 |
|------|------|
| `:::alert{type="info"} ... :::` | 提示框，type: info/warning/success/danger |
| `:::expand{title="標題"} ... :::` | 可展開區塊 |
| `:::steps ... :::` | 自動編號步驟 |
| `:::tabs ... :::` + `::tab[標題]` | 分頁 |
| `:::button-row ... :::` | 按鈕列 |

### 圖片

| 語法 | 說明 |
|------|------|
| `![alt](img.png)` | 基本圖片，預設 85% 寬度置中 |
| `![alt](img.png "說明文字")` | 圖片 + Caption |
| `![alt](img.png){width="60%"}` | 自訂寬度 |
| `![alt](img.png "說明文字"){width="60%"}` | Caption + 自訂寬度 |

所有圖片點擊可放大（Lightbox），按 Escape 或點擊背景關閉。

### Mermaid 圖表

使用 `mermaid` code block，支援所有 Mermaid 圖表類型。切換主題時自動重新渲染。

### 可用 AWS Icon

`aws-sign-out`、`aws-new-tab`、`aws-refresh`、`aws-expand`、`aws-info`、`aws-success`、`aws-warning`、`aws-error`、`aws-copy`、`aws-arrow-right`

所有 [Lucide](https://lucide.dev/icons) icon 也可直接使用。

## 認證機制

在 workshop 目錄下放置 `credentials.json` 即可啟用登入保護：

```json
{
  "eventCode": "ECS-2026-TPE",
  "users": ["ws-01", "ws-02", "ws-03"]
}
```

- `eventCode`：活動代碼，講師提供給學員。變更後所有 session 自動失效。
- `users`：允許登入的 username 列表。
- 登入後 `{{USERNAME}}` 變數會替換為 username，用於顯示個人化的資源名稱。
- 沒有 `credentials.json` 的 workshop 為公開，不需要登入。

## CloudFormation 拆分

多人共用同一 AWS 帳號時，IaC 拆分為兩份避免資源衝突：

- `infra/ecs-fargate-lab-infra.yaml`：講師部署一次的共用基礎設施（VPC、ALB、ECS Cluster、ECR、RDS）
- `content/.../ecs-fargate-lab-user.yaml`：每個學員各自部署（Command Host、S3 Bucket、ALB Target Group），帶 `UserPrefix` 參數

詳見 `docs/lab-platform-design.md`。

## Front Matter

```yaml
---
title: 頁面標題
order: 1
id: custom-id    # 選填
---
```

## _manifest.json

```json
{
  "title": "Workshop 標題",
  "description": "卡片描述",
  "badge": "HANDS-ON LAB",
  "level": "初級",
  "duration": "約 2 小時",
  "icon": "activity",
  "pages": []
}
```

`icon` 可填 Lucide icon 名稱、`aws-*` 自訂 icon、或 emoji。`pages` 由 `build.sh` 自動產生。

## 常用指令

```bash
# 掃描 content 更新索引
./build.sh

# 本地預覽
python3 -m http.server 8080
npx serve .
```

## 部署到 S3

靜態檔案部署至 S3 Bucket（`audy-workshop-website-test`），搭配 CloudFront 對外服務。

### 前置條件

- 已設定 AWS CLI 並具備 S3 寫入與 CloudFront 失效權限
- S3 Bucket 已啟用靜態網站託管，或透過 CloudFront 存取

### 部署指令

```bash
# 同步靜態檔案至 S3（排除 infra/ 和 docs/）
aws s3 sync . s3://audy-workshop-website-test \
  --exclude ".git/*" \
  --exclude "infra/*" \
  --exclude "docs/*" \
  --exclude "*.sh" \
  --delete

# 建立 CloudFront 快取失效（若有設定 CloudFront）
aws cloudfront create-invalidation \
  --distribution-id <YOUR_DISTRIBUTION_ID> \
  --paths "/*"
```

### 完整部署流程

```bash
# 1. 更新索引
./build.sh

# 2. 同步至 S3
aws s3 sync . s3://audy-workshop-website-test \
  --exclude ".git/*" \
  --exclude "infra/*" \
  --exclude "docs/*" \
  --exclude "*.sh" \
  --delete

# 3. 清除 CloudFront 快取（若有設定）
aws cloudfront create-invalidation \
  --distribution-id <YOUR_DISTRIBUTION_ID> \
  --paths "/*"
```

> 若尚未設定 CloudFront，可直接透過 S3 靜態網站端點存取：`http://audy-workshop-website-test.s3-website-<region>.amazonaws.com`

## 新增 Workshop

1. 建立 `content/my-workshop/_index.md`（含 front matter）
2. 建立 `content/my-workshop/_manifest.json`（填 title、description 等）
3. 新增章節 `.md` 檔或子資料夾
4. 執行 `./build.sh`
5. （選填）新增 `content/my-workshop/credentials.json` 啟用登入保護

資料夾名稱加 `_` 前綴（如 `_my-draft`）會被 build 忽略。

## TODO

- Drawio support
- Lab Platform 後端（Cognito + API Gateway + Lambda），詳見 `docs/lab-platform-design.md`
- 使用 CodePipeline 同步所有內容（S3 為主要版本）
