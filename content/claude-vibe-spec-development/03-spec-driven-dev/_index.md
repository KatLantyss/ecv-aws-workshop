---
title: Lab 2 — Spec Driven Development
order: 4
---

# Lab 2 — Spec Driven Development

::badge[實作]{type="info"} ::badge[30 分鐘]{type="default"}

**Spec Driven Development（SDD）** 是一種先寫規格、再讓 AI 依規格生成程式碼的工作模式。與 Vibe Coding 的即興來回對話不同，SDD 的重點是先把需求想清楚，讓 AI 成為一個可靠的「依規格生產程式碼」的工具。

你將為 Lab 1 的成果補寫一份正式 Spec，然後用這份 Spec 重新驅動 Claude Code，比較兩次輸出的差異。

---

## 2.1 理解 Spec 的結構

好的 Spec 不是「需求」清單，而是**可被 AI 精確執行**的規格文件。它需要明確到讓一個不了解背景的人（或 AI）也能正確實作。

標準 Spec 結構：

```markdown
## 功能名稱
一行描述這個功能是什麼

## 背景與目的
為什麼需要這個功能？解決什麼問題？

## 輸入規格
每個參數的：名稱、型別、是否必填、格式限制

## 輸出規格
成功 / 各種失敗情境的回傳格式

## 業務規則
特殊邏輯、限制條件、邊界行為

## 錯誤處理
各種錯誤情境的處理方式與 error code

## 不在範圍內
這個版本明確「不」實作的功能

## 測試情境
驗收時需要通過的具體測試案例
```

:::alert{type="info"}
**「不在範圍內」** 這個章節非常重要。它讓 AI 不會自作主張加入你不需要的功能，也讓需求邊界清晰。
:::

---

## 2.2 撰寫你的第一份 Spec

在 `claude-lab` 目錄建立 Spec 文件：

```bash
touch user-auth-spec.md
```

根據 Lab 1 的重構結果，撰寫以下 Spec（這是**範本**，你可以根據自己的重構結果調整細節）：

```markdown
## 功能名稱
使用者認證模組（User Authentication Module）

## 背景與目的
提供基本的使用者註冊與登入功能，供 Node.js 後端 API 呼叫使用。
需確保密碼安全存儲，並使用不可預測的 session token 進行身份驗證。

## 輸入規格

### register(username, password)
- username: string，必填，3–20 字元，僅允許英數字（a-z, A-Z, 0-9）與底線（_）
- password: string，必填，最少 8 字元

### login(username, password)
- username: string，必填
- password: string，必填

### getUserData(token)
- token: string，必填，由 login 成功時回傳

## 輸出規格

### register
- 成功：`{ success: true }`
- 帳號已存在：`{ success: false, error: "USERNAME_EXISTS" }`
- username 格式不符：`{ success: false, error: "INVALID_USERNAME" }`
- password 不符合長度：`{ success: false, error: "INVALID_PASSWORD" }`
- 任何輸入為 null / undefined：`{ success: false, error: "INVALID_INPUT" }`

### login
- 成功：`{ success: true, token: string }`
- 帳號不存在或密碼錯誤：`{ success: false, error: "INVALID_CREDENTIALS" }`（不區分是哪個錯）
- 任何輸入為 null / undefined：`{ success: false, error: "INVALID_INPUT" }`

### getUserData
- 成功：`{ username: string }`（不含密碼欄位）
- token 無效或不存在：`null`

## 業務規則
- 密碼以 bcrypt 加密後儲存，cost factor = 10
- token 使用 `crypto.randomBytes(32).toString('hex')` 產生，長度固定 64 字元
- token 與 username 的對應關係存於記憶體 Map（`tokenStore`）
- username 比對區分大小寫（Alice ≠ alice）
- register / login 為 async 函數（因為 bcrypt 是非同步的）

## 錯誤處理
- 所有輸入為 null 或 undefined 時，統一回傳 `INVALID_INPUT`，不拋出 exception
- 內部錯誤（如 bcrypt 失敗）以 `INTERNAL_ERROR` 回傳，不暴露詳細訊息

## 不在範圍內
- Token 過期機制
- 密碼重設功能
- 多因素驗證（MFA）
- 資料持久化（不連接資料庫）
- Rate limiting / 登入失敗鎖定

## 測試情境
1. 正常註冊新帳號 → `{ success: true }`
2. 用相同 username 重複註冊 → `{ success: false, error: "USERNAME_EXISTS" }`
3. 用非法 username（含空格）註冊 → `{ success: false, error: "INVALID_USERNAME" }`
4. 用正確密碼登入 → `{ success: true, token: <64 char hex> }`
5. 用錯誤密碼登入 → `{ success: false, error: "INVALID_CREDENTIALS" }`
6. 用有效 token 取得使用者資料 → `{ username: "..." }`，不含 password
7. 用無效 token 取得資料 → `null`
8. register / login 傳入 null → `{ success: false, error: "INVALID_INPUT" }`
```

:::alert{type="warning"}
花 8–10 分鐘認真填寫這份 Spec。Spec 的品質直接決定生成程式碼的品質——這不是在「給 AI 作業」，而是在幫自己想清楚需求。
:::

---

## 2.3 用 `/plan` 先規劃，再用 Spec 驅動生成

在 Claude Code 中，先用 `/plan` 讓 AI 說明它的執行計畫：

```
/plan

請閱讀 user-auth-spec.md，
說明你打算如何從頭實作一個符合規格的 user-auth-v2.js，
包含你會用到哪些 Node.js 內建模組、第三方套件，
以及每個函數的實作思路。
```

確認計畫合理後，繼續執行：

```
請按照剛才的計畫，完整實作 user-auth-v2.js。
不要保留任何 user-auth.js 的舊程式碼，完全以 Spec 為依據。
```

:::alert{type="info"}
`/plan` 讓你在 AI 執行前先確認方向。如果計畫有問題，你可以在這個階段糾正，而不是事後修改生成的程式碼。
:::

---

## 2.4 比較兩次輸出的差異

同時對照 `user-auth.js`（Lab 1 重構版）與 `user-auth-v2.js`（Spec 驅動版）：

| 比較項目 | Lab 1 重構版（Vibe Coding） | Lab 2 Spec 驅動版（SDD） |
|---------|---------------------------|------------------------|
| 錯誤回傳格式 | | |
| Error code 命名 | | |
| token 格式與長度 | | |
| 輸入驗證細節 | | |
| null 輸入的處理方式 | | |
| 函數是否為 async | | |

**思考：**

- 哪個版本更符合你心目中的「正確實作」？
- 哪些差異是因為 Spec 寫得更明確？
- Vibe Coding 版本有沒有做出 Spec 裡沒有要求的東西？

---

## 2.5 用 Spec 的「測試情境」生成測試

```
請根據 user-auth-spec.md 的「測試情境」章節，
為 user-auth-v2.js 生成完整的 Jest 測試。

測試檔命名為 user-auth-v2.test.js，
必須完整涵蓋 Spec 中列出的 8 個測試情境，
每個情境對應一個或多個 test case。
```

:::steps
1. 執行 Spec 驅動的測試

```bash
npx jest user-auth-v2.test.js
```

2. 確認 8 個測試情境全部通過

3. 比較 `user-auth.test.js`（Lab 1）與 `user-auth-v2.test.js`（Lab 2）：
   - 哪個測試更完整？
   - 哪個更準確反映你的需求？
:::

---

## 2.6 挑戰：修改 Spec，觀察影響

試著修改 Spec 中的一個規則，然後請 Claude Code 更新程式碼：

:::tabs
::tab[挑戰 A — Token 過期]
從「不在範圍內」移除 Token 過期，並加入業務規則：

```markdown
## 業務規則（新增）
- token 有效期為 1 小時，超過後 getUserData 回傳 null
- tokenStore 中的每筆記錄需同時儲存 token 建立時間
```

請 Claude Code 更新 `user-auth-v2.js` 並同步更新測試。

::tab[挑戰 B — 登入失敗鎖定]
加入以下業務規則：

```markdown
## 業務規則（新增）
- 同一帳號連續登入失敗 5 次，鎖定 15 分鐘
- 鎖定期間登入回傳 `{ success: false, error: "ACCOUNT_LOCKED", unlocksAt: ISO8601 }`
```

觀察 Claude Code 如何新增 lockStore 並處理時間計算。

::tab[挑戰 C — 改變輸出格式]
修改 Spec 中 login 成功的輸出格式：

```markdown
## 輸出規格（修改 login 成功）
- 成功：`{ success: true, token: string, expiresAt: ISO8601 timestamp }`
```

觀察 Claude Code 如何同步更新程式碼、測試，以及 `getUserData` 的行為。
:::

---

## Lab 2 完成檢查

| 項目 | 預期結果 |
|------|----------|
| Spec 文件 | `user-auth-spec.md` 包含所有 8 個章節 |
| Spec 驅動生成 | `user-auth-v2.js` 與 Spec 完全對應 |
| Plan Mode 使用 | 生成前有確認 `/plan` 的計畫 |
| 測試通過 | 8 個測試情境全部通過 |
| 差異比較 | 能說出兩個版本至少 3 個主要差異 |

:::alert{type="success"}
恭喜完成 Lab 2！你已經親身體驗了從 Vibe Coding 到 Spec Driven Development 的落差。
:::
