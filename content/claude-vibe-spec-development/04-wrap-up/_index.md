---
title: 回顧與延伸
order: 5
---

# 回顧與延伸

::badge[5 分鐘]{type="default"}

---

## 你完成了什麼

:::steps
1. **安裝與設定** Claude Code CLI 與（選用）VS Code Extension

2. **掌握 Slash 指令** — `/init`、`/memory`、`/plan`、`/compact`、`/commit` 等核心操作

3. **Vibe Coding 實戰** — 用對話式 AI 協作完成程式碼解釋、安全審查、重構與測試生成

4. **Spec Driven Development 實戰** — 撰寫結構化規格文件，用 Spec 驅動 AI 生成可驗收的程式碼

5. **比較兩種模式** — 親身感受有 Spec 與無 Spec 的 AI 輸出差異
:::

---

## 什麼時候用 Vibe Coding？什麼時候用 SDD？

| 情境 | 建議模式 |
|------|----------|
| 探索性開發、原型驗證 | Vibe Coding |
| 不確定技術方向，想快速試驗 | Vibe Coding |
| 除錯、解釋現有程式碼 | Vibe Coding |
| 功能明確、需要可預測輸出 | Spec Driven Development |
| 多人協作、需要共同規格文件 | Spec Driven Development |
| 生成後要跑 CI/CD 驗收 | Spec Driven Development |
| 外包給 AI 大型功能 | Spec Driven Development |

**實務上，兩者通常搭配使用：** 先用 Vibe Coding 探索方向、理解問題，確認後再寫 Spec 讓 AI 正式實作。

---

## 反思問題

思考完成今天的實作後，你對以下問題的看法：

:::steps
1. **Vibe Coding 的限制** — 在哪些情況下，「來回對話」的方式讓你覺得失控或難以預測？

2. **Spec 的投入成本** — 撰寫 Spec 花了你多少時間？這個投入相對於「多次來回修改」值得嗎？

3. **AI 的邊界** — 有沒有哪些需求，你發現 Claude Code 無法正確理解，即使 Prompt 很詳細？

4. **團隊導入** — 如果你的團隊要導入 SDD 工作流程，最大的障礙會是什麼？
:::

---

## Slash 指令複習卡

帶走這張快速參考：

| 指令 | 記憶口訣 |
|------|----------|
| `/init` | **初始化**：新專案的第一步 |
| `/memory` | **記憶**：告訴 AI 關於你和你的專案 |
| `/plan` | **計畫**：大改動前先確認方向 |
| `/compact` | **壓縮**：context 快滿時用 |
| `/clear` | **清空**：重新開始一個全新對話 |
| `/commit` | **提交**：讓 AI 幫你寫 commit message |
| `/review` | **審查**：PR review 自動化 |
| `/help` | **求助**：忘記指令時查詢 |

---

## 延伸挑戰（課後自行完成）

:::tabs
::tab[進階 Prompt 技巧]
試試以下 Prompt 策略，觀察輸出的差異：

- **角色設定**：`你是一位資深 Node.js 工程師，請以 production-ready 的標準...`
- **限制條件**：`只使用 Node.js 內建模組，不引入任何第三方依賴...`
- **輸出格式**：`請以 TypeScript 撰寫，包含完整的型別定義...`
- **反向驗證**：`請告訴我這份 Spec 有哪些模糊之處，然後提出你的假設後再實作`

::tab[逆向工程 Spec]
找一段你工作中的既有程式碼，請 Claude Code 幫你：

```
請閱讀 [your-file.js]，
為它逆向生成一份符合 Spec 格式的規格文件，
包含：功能名稱、輸入規格、輸出規格、業務規則、已知邊界行為。
```

比較 AI 生成的 Spec 與你心目中的需求，找出差距。

::tab[自訂 Skill]
為你的專案建立一個自訂 Slash 指令：

1. 建立 `.claude/skills/check/SKILL.md`
2. 在裡面描述你的工作流程（例如：每次修改後執行 lint + test + 生成簡短 summary）
3. 在 Claude Code 中輸入 `/check` 執行

這讓重複性的工作流程變成可重用的指令。
:::

---

## 取得 Spec 模板

課程使用的空白 Spec 模板如下，可直接複製使用：

:::expand{title="展開 Spec 模板"}
```markdown
## 功能名稱
<!-- 一行描述 -->

## 背景與目的
<!-- 為什麼需要這個功能？解決什麼問題？ -->

## 輸入規格
<!-- 每個函數的參數：名稱、型別、是否必填、格式限制 -->

## 輸出規格
<!-- 成功 / 各種失敗情境的回傳格式與 error code -->

## 業務規則
<!-- 特殊邏輯、限制條件、邊界行為 -->

## 錯誤處理
<!-- 各種錯誤情境的處理方式，不暴露系統內部訊息 -->

## 不在範圍內
<!-- 明確列出這個版本不實作的功能 -->

## 測試情境
<!-- 驗收時需要通過的具體測試案例，編號列出 -->
1. 
2. 
3. 
```
:::

---

:::alert{type="success"}
感謝完成課程！Vibe Coding 與 Spec Driven Development 是互補的工具，而不是二選一。找到屬於你的節奏，讓 AI 成為真正意義上的開發夥伴。
:::
