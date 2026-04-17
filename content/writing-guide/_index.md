---
title: 快速開始
order: 0
---

# Workshop 撰寫指南

::badge[INTERNAL]{type="info"} ::badge[約 10 分鐘]{type="default"}

這份指南說明如何用本框架從零建立一個 AWS Workshop。

## 建立新 Workshop

:::steps
1. 建立 workshop 資料夾

   資料夾名稱即為網址 slug（`#my-workshop`），以數字前綴控制首頁排序：
   ```
   content/
   └── 01-my-workshop/
       ├── _manifest.json
       └── _index.md
   ```

2. 填寫 `_manifest.json` — 首頁卡片資訊

   ```json
   {
     "order": 1,
     "title": "Workshop 標題",
     "description": "卡片描述文字",
     "badge": "HANDS-ON LAB",
     "level": "初級",
     "duration": "約 2 小時",
     "icon": "container",
     "pages": []
   }
   ```
   `pages` 欄位不需手動填寫，由 `build.sh` 自動產生。

3. 新增章節

   每個章節是一個子資料夾 + `_index.md`，圖片放同一個資料夾：
   ```
   01-my-workshop/
   ├── _manifest.json
   ├── _index.md
   ├── 01-intro/
   │   └── _index.md
   ├── 02-setup/
   │   ├── _index.md
   │   └── architecture.png
   └── 07-cleanup/
       └── _index.md
   ```
   每個 `.md` 檔案開頭必須有 front matter：
   ```markdown
   ---
   title: 環境設定
   order: 2
   ---
   ```

4. 執行 build，產生索引並預覽

   ```bash
   ./build.sh
   python3 -m http.server 8080
   ```
:::

## Front Matter 欄位

| 欄位 | 必填 | 說明 |
|------|------|------|
| `title` | ✓ | 側邊欄與麵包屑顯示的名稱 |
| `order` | ✓ | 排序，數字越小越前面 |
| `id` | — | 自訂頁面 URL ID，預設自動產生 |

## 草稿與隱藏

資料夾名稱加 `_` 前綴，`build.sh` 會自動跳過，不出現在首頁：

```
content/
├── 01-my-workshop/     ← 顯示
└── _wip-workshop/      ← 隱藏（草稿）
```

## 本指南導覽

| 章節 | 說明 | 常用程度 |
|------|------|---------|
| Markdown 速查 | 表格、程式碼、清單等 GFM 語法 | 必備 |
| 提示框與標籤 | Alert、Banner、Badge、Status | 高 |
| 互動元件 | **Steps、Tabs、Expand（Lab 核心）** | 最高 |
| AWS Console 按鈕 | 模擬 Console UI 操作截圖說明 | 視需求 |
| 圖片與影片 | 相對路徑圖片、YouTube 嵌入 | 高 |
