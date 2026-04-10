---
title: 簡介
order: 0
---

# Workshop Markdown 撰寫指南

::badge[參考文件]{type="info"} ::badge[約 10 分鐘]{type="default"}

這份指南說明如何撰寫本框架的 Workshop 內容。所有語法都會在頁面上直接渲染，方便你對照效果。

## 目錄結構

```
content/
├── my-workshop/              # 正常 workshop
│   ├── _manifest.json
│   ├── _index.md
│   ├── 01-module-name/
│   │   ├── _index.md
│   │   └── diagram.png
│   └── cleanup.md
└── _my-draft/                # _開頭 → build 時忽略
    └── _index.md
```

:::alert{type="info"}
資料夾名稱加上 `_` 前綴（如 `_my-draft`）會被 `build.sh` 忽略，不會出現在首頁。拿掉 `_` 即可恢復。
:::

:::alert{type="info"}
新增 workshop 後執行 `./build.sh`，會自動掃描 `content/` 並更新 `config.json` 和 `_manifest.json`。
:::

## _manifest.json

卡片顯示資訊，`pages` 由 `build.sh` 自動產生：

```json
{
  "title": "Workshop 標題",
  "description": "卡片上顯示的描述文字",
  "badge": "HANDS-ON LAB",
  "level": "初級 ~ 中級",
  "duration": "約 2 小時",
  "icon": "activity",
  "pages": ["_index.md", "01-basics/_index.md"]
}
```

`icon` 可以填 Lucide 圖示名稱、`aws-` 前綴的自訂圖示、或 emoji。

## Front Matter

每個 `.md` 檔案開頭用 `---` 包裹 metadata：

```markdown
---
title: 頁面標題
order: 1
---
```

| 欄位    | 說明                              |
|---------|-----------------------------------|
| `title` | 側邊欄與麵包屑顯示的標題          |
| `order` | 排序數字，越小越前面              |
| `id`    | 自訂頁面 ID（選填，預設自動產生） |
