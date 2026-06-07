---
title: 總覽
order: 0
---

# Claude Code — Vibe Coding & Spec Driven Development

::badge[AI 開發]{type="info"} ::badge[初級]{type="default"} ::badge[60 分鐘]{type="default"}

*eCloudvalley — Published at 2026.06*

---

## 這門課在學什麼？

現代開發者與 AI 協作的方式正在快速演進，從「問 AI 一個問題、複製貼上答案」，到「讓 AI 真正參與你的開發流程」，這中間有很大的落差。

本課程帶你走完兩種核心工作模式：

- **Vibe Coding** — 用自然語言與 Claude Code 來回對話，即時解釋、除錯、重構程式碼
- **Spec Driven Development（SDD）** — 先寫規格文件，讓 AI 依規格生成可驗收的程式碼

你將學到如何透過 Slash 指令高效操控 Claude Code session，以及兩種模式在實務上的差異與選擇時機。

---

## 學習目標

- 在 Terminal 與 VS Code 中啟動並操作 Claude Code
- 熟悉核心 Slash 指令：`/init`、`/memory`、`/plan`、`/compact`、`/review`、`/commit` 等
- 用 Vibe Coding 完成程式碼解釋 → 安全審查 → 重構 → 測試生成
- 撰寫結構化 Spec 文件，並用它驅動程式碼生成
- 比較「有 Spec」與「無 Spec」的 AI 輸出差異

---

## 課程大綱

| 章節 | 內容 | 時間 |
|------|------|------|
| 行前準備 | 安裝 Claude Code、VS Code Extension | 10 分鐘 |
| Slash 指令速覽 | 掌握 16 個核心 Slash 指令 | 5 分鐘 |
| Lab 1 — Vibe Coding | 解釋 → 審查 → 重構 → 測試 | 30 分鐘 |
| Lab 2 — Spec Driven Development | 撰寫 Spec → 驅動生成 → 比較差異 | 30 分鐘 |
| 回顧與延伸 | 反思與實務建議 | 5 分鐘 |

---

## 章節導覽

:::steps
1. [行前準備](./00-prerequisites/_index.md)

   ::badge[10 分鐘]{type="default"} 安裝 Claude Code 與 VS Code Extension，確認環境就緒

2. [Slash 指令速覽](./01-slash-commands/_index.md)

   ::badge[5 分鐘]{type="default"} 掌握提升 Claude Code 使用效率的核心指令

3. [Lab 1 — Vibe Coding](./02-vibe-coding/_index.md)

   ::badge[30 分鐘]{type="info"} 用對話式 AI 協作完成一個真實的程式碼改善任務

4. [Lab 2 — Spec Driven Development](./03-spec-driven-dev/_index.md)

   ::badge[30 分鐘]{type="info"} 撰寫規格文件，讓 AI 依規格產出可驗收的程式碼

5. [回顧與延伸](./04-wrap-up/_index.md)

   ::badge[5 分鐘]{type="default"} 反思學習成果，取得延伸資源
:::

---

:::alert{type="warning"}
**兩個 Lab 有連貫性**：Lab 2 會延續 Lab 1 的成果，請依序完成。
:::

---

## 你需要準備

| 項目 | 說明 |
|------|------|
| 瀏覽器 | Chrome 或 Edge（連線 EC2 上的 VS Code） |
| Anthropic API Key | 提供給講師，部署環境時填入 |
| 連線資訊 | 講師會在課前提供 URL 與密碼 |

:::alert{type="info"}
**不需要在自己電腦安裝任何軟體。** Node.js、Claude Code CLI、VS Code Extension 全部已在 EC2 上預裝完成。
:::
