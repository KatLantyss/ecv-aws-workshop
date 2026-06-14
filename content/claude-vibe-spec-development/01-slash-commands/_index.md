---
title: Slash 指令速覽
order: 2
---

# Slash 指令速覽

::badge[5 分鐘]{type="default"}

Slash 指令是在 Claude Code 對話中輸入的控制指令，以 `/` 開頭。它們讓你不用離開對話視窗，就能切換模式、管理記憶、查看差異、提交程式碼。

---

## 核心指令快速參考

| 指令 | 用途 |
|------|------|
| `/help` | 顯示所有可用指令 |
| `/init` | 分析專案，生成 `CLAUDE.md` 記憶檔案 |
| `/memory` | 編輯記憶檔案（全域、專案、本地） |
| `/plan` | 切換計畫模式，讓 AI 先規劃再執行 |
| `/compact` | 壓縮對話歷史，釋放 context 空間 |
| `/clear` | 清空對話歷史，重新開始 |
| `/commit` | 用 AI 自動生成 commit message 並提交 |
| `/model` | 切換本次 session 使用的 AI 模型 |
| `/mcp` | 管理 MCP Servers |

---

## 課程中最重要的幾個指令

:::steps
1. **`/init`** — 進入新專案的第一件事

   Claude Code 會掃描你的目錄與設定檔，生成 `CLAUDE.md`。這份檔案告訴 AI 這個專案是什麼、技術規範是什麼。往後每次 session 都會自動讀取。

2. **`/plan`** — 大型任務先規劃，再執行

   進入 Plan Mode 後，AI 會先描述它打算做什麼、會動到哪些檔案，你確認後才執行。適合功能開發、重構。

3. **`/compact`** — 對話太長時釋放 context

   長時間對話會消耗 context window。`/compact` 讓 AI 將舊對話壓縮成摘要，保留重點、釋放空間。

4. **`/commit`** — 自動生成 commit message

   分析目前的 staged changes，生成符合 Conventional Commits 格式的 commit message。
:::

---

## 小練習：認識工作環境

在 VS Code Terminal 執行以下步驟，確認 Lab 環境就緒：

:::steps
1. 切換到 Lab 工作目錄

```bash
cd ~/word-vault
ls -la
```

   應看到 `CLAUDE.md`、`serve.sh`

2. 在 Claude Code Extension 側邊欄（或 Terminal 輸入 `claude`）執行：

```
/init
```

   觀察 Claude Code 如何讀取 `CLAUDE.md`，並補充它對專案的理解

3. 輸入 `/help`，快速瀏覽有哪些可用指令

4. 輸入 `/clear`，清空對話，準備進入 Lab 1
:::

:::alert{type="info"}
`CLAUDE.md` 已由環境預先建立，描述了這個 App 的背景與技術限制。`/init` 之後，Claude Code 每次啟動都會自動讀取這份記憶。
:::
