---
title: Task 0 - GitHub 準備
order: 2
---

# Task 0 - GitHub 帳號準備

::badge[準備]{type="default"} ::badge[約 15 分鐘]{type="default"}

本工作坊使用 GitHub 作為程式碼來源。如果你已經有 GitHub 帳號，可以跳過註冊步驟。

---

## 0.1 註冊 GitHub 帳號

:::expand{title="已有 GitHub 帳號？跳過此步驟"}
如果你已經有 GitHub 帳號，直接前往 [0.2 Fork 應用 Repository](#02-fork-應用-repository)。
:::

:::steps
1. 開啟 [github.com](https://github.com) → 點擊 **Sign up**

2. 依照指示填入：
   - Email 地址
   - 密碼
   - Username（建議使用容易辨識的名稱）

3. 完成 Email 驗證

4. 登入 GitHub
:::

---

## 0.2 Fork 應用 Repository

我們將使用一個開源的 2048 遊戲作為部署對象。

:::steps
1. 開啟 [2048 遊戲 Repository](https://github.com/gabrielecirulli/2048)

2. 點擊右上角的 ::button[Fork]{variant="default"} 按鈕

3. 在 **Create a new fork** 頁面：
   - **Repository name**：保持 `2048` 或改為 ``cicd-lab-2048``
   - 取消勾選 **Copy the `master` branch only**（保持勾選也可以）
   - 點擊 ::button[Create fork]{variant="action"}

4. 等待 Fork 完成，確認你的 GitHub 帳號下有了這個 Repository
:::

:::alert{type="info"}
Fork 會在你的 GitHub 帳號下建立一份獨立的副本。你對這個副本的任何修改不會影響原始 Repository。
:::

---

## 0.3 記錄 Repository 資訊

記下你的 Repository URL，後續步驟會用到：

```
https://github.com/<你的 GitHub Username>/2048
```

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| GitHub 帳號 | 能登入 github.com | ✅ |
| Fork Repository | 你的帳號下有 2048 repo | ✅ |

:::alert{type="success"}
GitHub 準備完成，前往下一節建置 Lab 環境。
:::
