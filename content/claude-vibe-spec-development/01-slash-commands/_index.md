---
title: Slash 指令速覽
order: 2
---

# Slash 指令速覽

::badge[5 分鐘]{type="default"}

Slash 指令是在 Claude Code 互動 session 中輸入的控制指令，以 `/` 開頭。它們讓你不用離開對話視窗，就能切換模式、管理記憶、查看差異、提交程式碼。

---

## 快速參考表

| 指令 | 用途 |
|------|------|
| `/help` | 顯示所有可用指令（含自訂 Skills） |
| `/init` | 分析專案，生成 `CLAUDE.md` 與選用的 Skills/Hooks |
| `/memory` | 編輯記憶檔案（全域、專案、本地） |
| `/plan` | 切換到計畫模式，讓 AI 先規劃再執行 |
| `/compact` | 壓縮對話歷史，釋放 context 空間 |
| `/clear` | 清空對話歷史，重新開始 |
| `/commit` | 用 AI 自動生成 commit message 並提交 |
| `/review` | 審查 Pull Request |
| `/config` | 開啟設定面板 |
| `/hooks` | 查看目前 Tool Hook 設定 |
| `/mcp` | 管理 MCP Servers（啟用、停用、重連） |
| `/permissions` | 管理工具的允許/拒絕規則 |
| `/model` | 切換本次 session 使用的 AI 模型 |
| `/skills` | 列出可用的 Skills |
| `/login` | 登入或切換 Anthropic 帳號 |
| `/logout` | 登出帳號 |

---

## 哪些指令在課程中最常用？

:::steps
1. **`/init`** — 進入新專案的第一件事

   Claude Code 會掃描你的 `package.json`、`README`、CI 設定等，訪談你填補空白後，生成一份 `CLAUDE.md`。這份檔案告訴 AI 這個專案是什麼、有什麼規範。

   ```
   /init
   ```

2. **`/memory`** — 讓 AI 記住你的偏好

   Claude Code 有三層記憶：
   - **全域** (`~/.claude/CLAUDE.md`) — 跨所有專案都有效
   - **專案** (`./CLAUDE.md`) — 只在這個 repo 有效
   - **本地** (`./CLAUDE.local.md`) — 不進 git 的個人設定

   ```
   /memory
   ```

3. **`/plan`** — 大型任務先規劃，再執行

   進入 Plan Mode 後，AI 會先描述它打算做什麼、會動到哪些檔案，你確認後才執行。適合重構、大型功能開發。

   ```
   /plan
   ```

4. **`/compact`** — 對話太長時釋放 context

   長時間的對話會消耗 context window。`/compact` 會讓 AI 將舊對話壓縮成摘要，保留重點、釋放空間。

   ```
   /compact
   ```

5. **`/commit`** — 自動生成 commit message

   Claude Code 分析目前的 staged changes，生成符合 Conventional Commits 格式的 commit message，確認後提交。

   ```
   /commit
   ```
:::

---

## 自訂 Slash 指令（Skills）

除了內建指令，你可以建立自己的 Slash 指令（稱為 **Skill**）：

在 `.claude/skills/<skill-name>/SKILL.md` 建立 Markdown 描述，就會自動變成 `/<skill-name>` 指令。

```
/verify          # 執行你定義的驗證流程
/deploy staging  # 執行部署腳本
/fix-issue 123   # 依 issue 號碼修復
```

用 `/skills` 可查看目前載入的所有 Skills。

---

:::alert{type="info"}
**在 Lab 中你會用到：** `/init`（初始化專案記憶）、`/plan`（規劃重構步驟）、`/compact`（session 過長時）、`/commit`（完成後提交）。其他指令隨情況使用即可。
:::

---

## 小練習

在你的 `claude-lab` 目錄中啟動 Claude Code，試試以下指令：

:::steps
1. 啟動 Claude Code

```bash
cd claude-lab && claude
```

2. 輸入 `/help`，瀏覽所有可用指令

3. 輸入 `/init`，觀察 Claude Code 如何詢問你專案資訊並生成 `CLAUDE.md`

4. 輸入 `/memory`，看看記憶檔案的結構

5. 輸入 `/clear`，清空對話，準備進入 Lab 1
:::
