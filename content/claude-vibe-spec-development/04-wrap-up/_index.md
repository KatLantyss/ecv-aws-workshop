---
title: 回顧與延伸
order: 5
---

# 回顧與延伸

::badge[5 分鐘]{type="default"}

---

## 你完成了什麼

:::steps
1. **Vibe Coding（Lab 1）**
   從零開始，純粹透過對話，建出一個完整的背英文單詞 App。
   體驗了「說出需求 → 觀察結果 → 迭代修改」的快速開發節奏。

2. **Spec Driven Development（Lab 2）**
   在既有 App 上，用 `claude-code-spec-workflow` 走完 **需求 → 設計 → 任務 → 實作** 的完整流程，為 Word Vault 加入「測驗模式」功能。
   體驗了「先想清楚再動手」的結構化 AI 開發方式。
:::

---

## 什麼時候用哪種方式？

| 情境 | 建議 |
|------|------|
| 探索、驗證想法、小功能 | Vibe Coding |
| 不確定技術方向，想快速試驗 | Vibe Coding |
| 功能複雜、影響範圍大 | Spec Driven Development |
| 需要跟團隊溝通或分工 | Spec Driven Development |
| 需要可驗收的交付標準 | Spec Driven Development |

**實務節奏：** 先用 Vibe Coding 把方向摸清楚，確認可行後再用 SDD 正式開發。

---

## 核心指令速查

**Claude Code 內建指令：**

| 指令 | 記憶口訣 |
|------|----------|
| `/init` | 初始化：新專案第一步 |
| `/plan` | 計畫：大改動前先確認方向 |
| `/compact` | 壓縮：context 快滿時用 |
| `/commit` | 提交：讓 AI 幫你寫 commit message |
| `/clear` | 清空：重新開始 |

**Spec Workflow 指令：**

| 指令 | 用途 |
|------|------|
| `/spec-steering-setup` | 建立專案規範文件（一次性） |
| `/spec-create <名稱> "<描述>"` | 啟動一個新功能的規格流程 |
| `/spec-execute <任務號> <規格名>` | 執行規格中的指定任務 |
| `/spec-list` | 查看所有規格狀態 |

---

## 課後延伸挑戰

:::tabs
::tab[延伸 Word Vault]
繼續在 Word Vault 上練習 SDD，選一個新功能：

```
/spec-create import-export "支援 CSV 格式匯入匯出單詞清單"
```

或：

```
/spec-create spaced-repetition "用間隔重複演算法排程複習提醒"
```

從需求 → 設計 → 任務，走一遍完整流程。

::tab[逆向工程 Spec]
找一段你工作中的既有程式碼，請 Claude Code 為它逆向生成規格文件：

```
請閱讀這段程式碼，為它生成一份 spec-workflow 格式的規格文件，
包含：功能描述、輸入輸出、業務規則、測試情境。

[貼上你的程式碼]
```

把 AI 生成的 spec 與你心目中的需求比對，找出差距。

::tab[導入真實專案]
在你的真實工作專案中試用：

```bash
cd /path/to/your/project
npx @pimzino/claude-code-spec-workflow
```

選一個中等複雜度的功能，先跑 `/spec-steering-setup` 建立專案規範，再試著走 SDD 流程，感受在真實 codebase 上的體驗。
:::

---

:::alert{type="success"}
感謝完成課程！Vibe Coding 讓你快速動起來，Spec Driven Development 讓你可以放心交給 AI 做。兩個工具在手，找到屬於你的節奏。
:::
