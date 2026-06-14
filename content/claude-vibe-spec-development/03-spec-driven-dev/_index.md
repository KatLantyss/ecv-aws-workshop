---
title: Lab 2 — Spec Driven Development
order: 4
---

# Lab 2 — Spec Driven Development

::badge[實作]{type="info"} ::badge[30 分鐘]{type="default"}

你的 Word Vault 已經是一個可以用的 App 了。現在來加入一個較複雜的新功能：**測驗模式**。

這個功能用 Vibe Coding 也可以做到，但我們刻意改用 **Spec Driven Development（SDD）** 的方式——先把規格寫清楚、走過審核，再讓 AI 照規格實作。

完成後你會感受到：對於複雜功能，有規格和沒規格的差距在哪。

---

## 2.1 初始化 Spec Workflow

`claude-code-spec-workflow` 是一個 CLI 工具，執行後會在你的專案 `.claude/commands/` 目錄下安裝一組 `/spec-*` 系列的 **自訂 slash 指令**，讓你在 Claude Code 對話中直接走完 **需求 → 設計 → 任務 → 實作** 的完整 SDD 流程。

:::alert{type="info"}
環境已預先安裝好此工具（`@pimzino/claude-code-spec-workflow`），不需要手動 `npm install`。
:::

:::steps
1. 在工作目錄執行初始化指令

```bash
cd ~/word-vault
npx @pimzino/claude-code-spec-workflow
```

   過程中會詢問幾個確認問題，全部按 Enter 接受預設值即可。  
   完成後會在 `.claude/` 目錄下建立所有必要的指令檔案。

2. 重新啟動 Claude Code，然後輸入 `/help`，確認出現以下新指令：

   | 指令 | 用途 |
   |------|------|
   | `/spec-create` | 為一個功能建立完整規格（需求 → 設計 → 任務） |
   | `/spec-execute` | 執行規格中的指定任務 |
   | `/spec-list` | 列出所有規格的狀態 |
   | `/spec-steering-setup` | 建立專案 steering 文件 |
:::

---

## 2.2 建立 Steering 文件（專案規範）

Steering 文件是專案的「憲法」，告訴 AI 這個專案的技術規範和設計原則。所有 spec 都會參照這些規範，避免 AI 自作主張加入不符合的技術。

```
/spec-steering-setup
```

Claude Code 會詢問你幾個問題。根據 Word Vault 的情況回答：

- **產品目標**：一個幫助使用者記憶英文單詞的純前端學習工具
- **技術棧**：純 HTML/CSS/JS 單一 index.html，localStorage 存資料，無後端
- **設計原則**：簡潔易用，不破壞現有功能

:::alert{type="info"}
Steering 文件建立後存在 `.claude/steering/` 目錄，之後每次建立 spec，AI 都會遵循這些規範。
:::

---

## 2.3 用 `/spec-create` 建立「測驗模式」規格

現在進入 SDD 的核心。用一段描述啟動規格建立流程：

```
/spec-create quiz-mode "測驗模式：隨機抽出單詞，遮住中文，讓使用者輸入答案，最後顯示得分與錯誤清單"
```

Claude Code 會**自動走過三個階段**，每個階段結束都需要你審核。

---

### 階段一：需求文件（Requirements）

AI 會生成 `requirements.md`，內容包含：
- 使用者故事（User Stories）
- 功能需求清單
- 驗收標準

**你的任務：** 仔細閱讀，確認有沒有漏掉或不符合你期望的需求。

常見的需要補充的點：
- 「測驗題數」應該是固定還是讓使用者選擇？
- 答題時是否顯示英文提示（大小寫敏感嗎）？
- 測驗結束後，是否更新「已學會」狀態？

:::tabs
::tab[同意需求]
輸入：

```
需求看起來正確，請繼續生成設計文件
```

::tab[需要修改]
直接說出你的補充：

```
需求需要補充：
1. 題數由使用者選擇（5 / 10 / 全部）
2. 答案大小寫不敏感
3. 測驗結束後，答對的單詞自動標記為已學會
```
:::

---

### 階段二：設計文件（Design）

AI 根據已批准的需求，生成 `design.md`，包含：
- 技術實作方案
- UI/UX 流程描述
- 需要修改的程式結構

**你的任務：** 確認技術方案合理，不會破壞既有功能。

:::alert{type="warning"}
特別注意：design 文件裡有沒有提到「不破壞 localStorage 現有資料結構」？如果沒有，記得補充。
:::

---

### 階段三：任務拆解（Tasks）

AI 將實作拆解為具體的小任務，例如：

```
1. 新增測驗入口按鈕
   1.1 在主畫面加入「開始測驗」按鈕
   1.2 點擊後顯示題數選擇介面

2. 測驗邏輯
   2.1 從 localStorage 隨機抽出 N 個單詞
   2.2 建立答題 UI（顯示英文、遮蔽中文、輸入框）
   2.3 實作答案比對邏輯（大小寫不敏感）

3. 測驗結果
   3.1 計算並顯示得分
   3.2 列出答錯的單詞
   3.3 更新已學會狀態
```

**你的任務：** 確認任務順序合理，每個任務都有清楚的驗收條件。

:::alert{type="info"}
**SDD 的核心體驗就在這裡**：你現在清楚知道 AI 接下來會做什麼，不會有意外。這和 Vibe Coding 的「我說我要什麼，AI 做出來再看」有根本差異。
:::

---

## 2.4 執行規格：`/spec-execute`

規格全部批准後，開始逐一執行任務：

```
/spec-execute 1 quiz-mode
```

這個指令告訴 Claude Code：執行 `quiz-mode` 規格的**第 1 個任務**。

:::steps
1. 執行任務 1，確認 UI 加入正確

2. 預覽結果：切換到 Terminal server 視窗，重新整理瀏覽器

3. 確認後繼續執行任務 2

```
/spec-execute 2 quiz-mode
```

4. 依序完成所有任務

5. 最終測試：
   - 新增幾個單詞
   - 點「開始測驗」
   - 完成測驗，確認得分顯示正確
   - 確認答對的單詞有被標記為「已學會」
:::

:::alert{type="warning"}
**如果某個任務的輸出不符合 design 文件的描述，** 把差異說出來，讓 Claude Code 根據規格修正，而不是根據你的直覺修正。這是 SDD 的精神。
:::

---

## 2.5 Vibe Coding vs Spec Driven：對比回顧

完成兩個 Lab 後，用下表對比兩種方式的體驗：

| 面向 | Lab 1 Vibe Coding | Lab 2 Spec Driven |
|------|-------------------|-------------------|
| 開始前需要多少準備？ | 幾乎不需要 | 需要寫規格、審核文件 |
| AI 的輸出可預測嗎？ | 較難預測 | 有規格作為基準 |
| 需求改變時怎麼辦？ | 直接說、直接改 | 先改規格，再改 code |
| 適合什麼情境？ | 探索、原型、小修改 | 複雜功能、多人協作 |

**沒有哪個更好——** 實務上兩者搭配使用：先 Vibe Coding 摸清楚方向，確認後用 SDD 正式實作。

---

## Lab 2 完成檢查

| 項目 | 確認 |
|------|------|
| spec-workflow-mcp 安裝成功 | `/help` 可見 `/spec-create` 等指令 |
| Steering 文件建立 | `.claude/steering/` 下有文件 |
| 需求、設計、任務都已審核 | `.claude/specs/quiz-mode/` 下有三份文件 |
| 測驗模式可正常運作 | 可以開始測驗、答題、看得分 |

:::expand{title="補充：查看 MCP Dashboard（選用）"}
`spec-workflow-mcp` 提供一個視覺化 Dashboard，可以看到所有 spec 的進度：

```bash
# 在新的 Terminal 視窗啟動
npx @pimzino/spec-workflow-mcp --dashboard --port 5001
```

然後點擊 `http://localhost:5001` 查看。

Dashboard 顯示：
- 所有 spec 的狀態（規劃中 / 進行中 / 完成）
- 每個任務的完成進度
- 實作 log

這對追蹤較大規模的開發特別有用。
:::

:::alert{type="success"}
Lab 2 完成！你已經走完完整的 Spec Driven Development 流程。繼續前往回顧章節。
:::
