# ECV AWS Workshop

輕量級靜態 Workshop 網站框架，無需 build tool，純 HTML/CSS/JS + Markdown。

## 架構概覽

```
├── index.html          # 單頁應用入口
├── app.js              # 核心邏輯（路由、Markdown 渲染、自訂語法）
├── style.css           # 樣式（dark/light theme）
├── config.json         # 網站設定（title、workshops 列表）
├── build.sh            # 自動掃描 content/ 產生索引
├── deploy.sh           # S3 + CloudFront 部署腳本
├── assets/             # 全站靜態資源（logo 等）
└── content/            # Workshop 內容
    └── my-workshop/
        ├── _manifest.json   # Workshop metadata（卡片資訊）
        ├── _index.md        # Workshop 首頁
        ├── 01-chapter/
        │   ├── _index.md    # 章節頁面
        │   └── diagram.png  # 圖片放頁面資料夾
        └── cleanup.md
```

## 核心機制

- **路由**：hash-based SPA，格式 `#workshop-slug/chapter-id`
- **Markdown**：使用 marked.js v15 渲染，支援 GFM
- **自訂語法**：`preprocessCustomSyntax()` 在 marked 之前處理 `::` / `:::` 語法
- **Icon**：自訂 `aws-*` icon（16x16 SVG）+ Lucide icon fallback
- **索引**：`config.json` 列出 workshops，每個 workshop 的 `_manifest.json` 列出 pages
- **build.sh**：掃描 `content/` 自動更新 `config.json` 和 `_manifest.json`，`_` 開頭的資料夾會被忽略

## 自訂 Markdown 語法

### 行內元件（`::` 前綴）

| 語法 | 說明 |
|------|------|
| `::badge[文字]{type="info"}` | 標籤，type: info/success/warning/danger/default |
| `::status[文字]{type="success" icon="circle-check"}` | 狀態文字，帶 icon + 顏色 |
| `::button[文字]{variant="primary"}` | 按鈕，variant: primary/link/normal |
| `::button[文字]{variant="link" prefix="aws-new-tab"}` | 按鈕帶前方 icon |
| `::button[文字]{variant="link" postfix="aws-new-tab"}` | 按鈕帶後方 icon |
| `::button[文字]{variant="link" dropdown}` | 下拉按鈕 |
| `::button[文字]{variant="primary" split="aws-expand"}` | Split 按鈕 |
| `::button[]{variant="link" prefix="aws-refresh"}` | 純 icon 按鈕 |
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

### 可用 AWS Icon

`aws-sign-out`、`aws-new-tab`、`aws-refresh`、`aws-expand`、`aws-info`、`aws-success`、`aws-warning`、`aws-error`、`aws-copy`、`aws-arrow-right`

所有 [Lucide](https://lucide.dev/icons) icon 也可直接使用。

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
```

## 新增 Workshop

1. 建立 `content/my-workshop/_index.md`（含 front matter）
2. 建立 `content/my-workshop/_manifest.json`（填 title、description 等）
3. 新增章節 `.md` 檔或子資料夾
4. 執行 `./build.sh`

資料夾名稱加 `_` 前綴（如 `_my-draft`）會被 build 忽略。


## TODO

- RWD
- 調整圖片大小,對其 圖片說明欄位
- Mermaid Support, Drawio support
- 使用 CodeCommit, CodePipeline, CodeBuild 同步所有內容（S3為主要版本）
- Lab Account 後台變更 / Cognito 身份驗證
- Call Lambda/Eventbridge/API Gateway... 直接部署 CloudFormation 以及回傳回去 UI 特定資源