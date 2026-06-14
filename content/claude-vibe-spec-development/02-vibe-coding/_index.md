---
title: Lab 1 — Vibe Coding
order: 3
---

# Lab 1 — Vibe Coding

::badge[實作]{type="info"} ::badge[30 分鐘]{type="default"}

**Vibe Coding** 是用自然語言與 AI 來回對話、即時協作的開發方式。你不需要一次寫出完美的 Prompt——先描述大方向，觀察結果，再補充修正，像跟開發夥伴一起工作。

這個 Lab 你會**從零開始**，純粹透過對話，建出一個可運作的「背英文單詞」網頁 App。

---

## 1.1 確認環境，開啟 Claude Code

:::steps
1. 切換到工作目錄

```bash
cd ~/word-vault
```

2. 確認 `CLAUDE.md` 已就緒

```bash
cat CLAUDE.md
```

3. 開啟 Claude Code — 點左側 Activity Bar 的 **Spark ⚡ 圖示**（或在 Terminal 輸入 `claude`）

4. 執行 `/init`，讓 Claude Code 讀取專案記憶

```
/init
```
:::

---

## 1.2 一句話建出 App 骨架

輸入第一個 Prompt（直接複製貼上）：

:::alert{type="info"}
💡 **Vibe Coding 的起手式**：先給大方向，不要一開始就列清單。讓 AI 先給你一個可以跑的版本，再逐步迭代。
:::

```
請幫我建立一個背英文單詞的網頁應用，檔名為 index.html。

功能需求：
- 新增單詞：輸入英文單詞和中文解釋，點按鈕新增
- 單詞清單：以卡片方式顯示所有單詞
- 標記學會：每張卡片有「已學會」按鈕，標記後顯示不同樣式
- 資料存在 localStorage，重新整理不會消失

請用純 HTML + CSS + JavaScript 寫在一個 index.html 檔案裡，
不需要後端，不需要 npm 套件。
畫面要好看，有現代感。
```

:::alert{type="warning"}
**觀察 Claude Code 的行為：** 它會問你問題嗎？還是直接開始寫？它有沒有在動手前先說明計畫？
:::

---

## 1.3 在瀏覽器預覽成果

Claude Code 建立 `index.html` 後，啟動預覽 server 並在瀏覽器查看：

:::steps
1. 開啟新的 Terminal（點 Terminal 面板右上角的 **+**）

2. 啟動 http server

```bash
cd ~/word-vault
bash serve.sh
```

3. 在 Terminal 輸出裡，按住 `Ctrl` 點擊 `http://localhost:3000` 連結

   :::alert{type="info"}
   code-server 內建 reverse proxy，點擊後會自動開啟 `https://xxxx.cloudfront.net/proxy/3000/`——code-server 收到請求後在 EC2 本機轉發到 port 3000，不需要任何額外設定。
   :::

4. 試用 App：新增幾個單詞，點「已學會」，重新整理頁面確認資料有保存
:::

---

## 1.4 迭代改進：用對話描述你想要的改變

這是 Vibe Coding 的核心——**說出你不滿意的地方，讓 AI 修改**。

試試以下其中一個（或自己想要的改進）：

:::tabs
::tab[改進一：搜尋功能]
```
畫面上方加一個搜尋欄，
可以即時過濾單詞清單，
輸入時不需要按按鈕，直接過濾。
```

::tab[改進二：學習進度]
```
在頁面頂部加一個進度條，
顯示「已學會 X / 共 Y 個單詞」，
進度條顏色隨完成比例改變（紅→橘→綠）。
```

::tab[改進三：刪除與編輯]
```
每張單詞卡片加一個刪除按鈕（垃圾桶圖示），
點擊後跳出確認對話框再刪除。
```
:::

:::alert{type="info"}
**觀察重點：** Claude Code 修改時有沒有動到你不希望它改的部分？如果有，怎麼把這個反饋給它？
:::

---

## 1.5 體驗 `/plan` 模式

現在試試較大的改動——請 Claude Code 先規劃，再執行：

```
/plan

我想把單詞的難易度分為三個等級：
簡單（綠色標籤）、普通（黃色標籤）、困難（紅色標籤）。

新增單詞時可以選擇難易度，
單詞清單可以按難易度篩選。
資料結構需要同步更新。

請先描述你的修改計畫，再等我確認。
```

看完 AI 的計畫後：
- 如果計畫合理 → 輸入「好，請執行」
- 如果有疑慮 → 告訴它你想調整的部分

:::alert{type="info"}
**`/plan` 的價值**：在 AI 動手之前，讓你確認方向。這對「會影響資料結構」的改動特別重要。
:::

---

## 1.6 完成 Lab 1

:::steps
1. 確認 App 可以正常運作（新增、標記、搜尋/篩選、重整後資料保留）

2. 初始化 git 並提交

```bash
cd ~/word-vault
git init
git add index.html CLAUDE.md
```

3. 讓 Claude Code 自動生成 commit message

```
/commit
```
:::

---

## Lab 1 反思

完成後，思考以下問題（不需要作答，記在腦中）：

- Vibe Coding 中，你花最多時間的地方是什麼？是在**寫 Prompt**，還是在**修正 AI 的輸出**？
- 有沒有某個功能，你說了幾次 AI 才做對？原因是什麼？
- 如果今天不是你自己開發，而是把這個 App 交給另一個工程師繼續做，他能快速理解你的設計決策嗎？

:::alert{type="success"}
Lab 1 完成！你已經體驗了 Vibe Coding 的核心流程。接下來，你會接手這個 App，用 **Spec Driven Development** 的方式加入一個全新功能。
:::
