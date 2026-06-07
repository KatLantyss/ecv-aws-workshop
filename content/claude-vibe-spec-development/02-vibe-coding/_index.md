---
title: Lab 1 — Vibe Coding
order: 3
---

# Lab 1 — Vibe Coding

::badge[實作]{type="info"} ::badge[30 分鐘]{type="default"}

**Vibe Coding** 是與 AI 來回對話、即時協作的開發方式。你不需要一次寫出完美的 Prompt——你可以先問、觀察回應、再補充修正，像跟開發夥伴一起工作。

這個 Lab 你會拿到一段有問題的程式碼，透過與 Claude Code 對話，完成解釋 → 安全審查 → 重構 → 測試生成的完整流程。

---

## 1.1 確認起始環境

環境已由 CloudFormation 預置完成。在 VS Code Terminal 中確認：

:::steps
1. 切換到工作目錄

```bash
cd ~/vibe-coding-lab
```

2. 確認起始檔案已就緒

```bash
ls -la
```

   應看到以下檔案：
   - `user-auth.js` — Lab 1 的起始程式碼（含多個刻意設計的問題）
   - `user-auth-spec.md` — Lab 2 的 Spec 模板（待填寫）
   - `package.json` — npm 專案設定（Jest 已預裝）

3. 快速瀏覽起始程式碼

```bash
cat user-auth.js
```

4. 啟動 Claude Code，並用 `/init` 初始化專案記憶

:::tabs
::tab[VS Code Extension]
點左側 Activity Bar 的 Spark ⚡ 圖示，在側邊欄輸入：

```
/init
```

::tab[Terminal CLI]
```bash
claude
```

進入後輸入：

```
/init
```
:::
:::

:::alert{type="info"}
`/init` 會讓 Claude Code 掃描你的目錄並生成 `CLAUDE.md`，記錄這個專案是什麼、有什麼規範。往後每次 session 啟動，AI 都會自動讀取這份記憶。
:::

---

## 1.2 請 Claude Code 解釋程式碼

輸入第一個 Prompt，讓 AI 理解你的程式碼：

```
請解釋 user-auth.js 這個檔案的功能，
包含每個函數的用途、輸入輸出格式，
以及你觀察到的任何潛在問題。
```

:::alert{type="info"}
**觀察重點：** Claude Code 能否正確描述每個函數的意圖？它是否主動發現了問題？
:::

---

## 1.3 請求安全審查

繼續對話，深入分析問題：

```
請針對這段程式碼做完整的安全審查，
列出所有安全漏洞和 Bug，
每個問題標示危險程度（高 / 中 / 低）和原因。
```

:::expand{title="這段程式碼有哪些問題？（思考後展開）"}
| 問題 | 類型 | 危險程度 |
|------|------|----------|
| 密碼以明文儲存 | 安全漏洞 | 🔴 高 |
| Token 可被預測與偽造（username + timestamp） | 安全漏洞 | 🔴 高 |
| `getUserData` 回傳完整物件，含密碼 | 資料洩漏 | 🔴 高 |
| 使用 `==` 而非 `===` | Bug | 🟡 中 |
| 沒有密碼強度驗證 | 功能缺失 | 🟡 中 |
| 沒有輸入格式驗證 | 功能缺失 | 🟢 低 |
:::

---

## 1.4 描述修復需求，請 Claude Code 重構

根據審查結果，用自然語言描述你的需求：

```
請重構 user-auth.js，修復前面找到的安全問題：

1. 使用 bcrypt 加密儲存密碼（cost factor 10）
2. 使用 crypto.randomBytes(32).toString('hex') 產生不可預測的 token
3. 用一個 Map 記錄 token 與 username 的對應關係
4. getUserData 不應回傳密碼欄位
5. 新增 username 格式驗證（3-20 字元，英數字與底線）
6. 統一使用 === 比較

請保持原本的函數簽名（register, login, getUserData），
讓現有呼叫方不需要修改。
```

:::alert{type="warning"}
**觀察重點：** 你的 Prompt 越具體，輸出越符合預期。試著故意省略某個需求，看看 AI 的輸出有什麼差異。
:::

---

## 1.5 驗收重構結果

Claude Code 完成重構後，逐項確認（Terminal 使用者可以讀取輸出，VS Code 使用者可以直接看 diff 並接受/拒絕修改）：

- [ ] 密碼是否以 bcrypt hash 儲存？
- [ ] token 是否為 64 字元 hex 字串（不含 username）？
- [ ] 是否有 Map 記錄 token → username 對應？
- [ ] `getUserData` 是否移除了密碼欄位？
- [ ] 是否有 username 格式驗證？
- [ ] 是否統一使用 `===`？

:::expand{title="如果輸出不符合預期，怎麼辦？"}
這是 Vibe Coding 的正常流程——**來回對話本身就是技能**。

試著補充更精確的描述：

```
你產生的 token 還是使用了 username，
這讓 token 可以被猜測。
請改用 crypto.randomBytes(32).toString('hex') 產生完全隨機的 64 字元 token，
token 本身不包含任何使用者資訊。
```

或是用 `/plan` 讓 AI 先描述它打算怎麼改，你確認後再執行：

```
/plan
```
:::

---

## 1.6 安裝依賴並測試

:::steps
1. 安裝 bcrypt（Claude Code 生成的程式碼應該需要它；`npm init` 與 `jest` 已預裝）

```bash
npm install bcrypt
```

2. 在 Node.js REPL 快速驗證

```bash
node -e "
const auth = require('./user-auth');
async function test() {
  console.log('register:', await auth.register('alice', 'password123'));
  const loginResult = await auth.login('alice', 'password123');
  console.log('login:', loginResult);
  if (loginResult.success) {
    const data = await auth.getUserData(loginResult.token);
    console.log('getUserData:', data);
    console.log('密碼是否外洩:', 'password' in data);
  }
}
test();
"
```

3. 確認輸出符合預期：
   - `register` 回傳 `true`
   - `login` 回傳 `{ success: true, token: '...' }`，token 是一串隨機 hex
   - `getUserData` 回傳 `{ username: 'alice' }`，**沒有 password 欄位**
:::

---

## 1.7 請 Claude Code 生成測試

```
請為重構後的 user-auth.js 撰寫完整的 Jest 單元測試，
涵蓋：

- register：正常註冊、重複帳號、非法 username 格式
- login：正確密碼、錯誤密碼、帳號不存在
- getUserData：有效 token、無效 token
- 邊界案例：空字串、null

測試檔命名為 user-auth.test.js。
```

:::steps
1. Jest 已預裝，直接執行測試

```bash
npx jest
```

2. 確認 `package.json` 有 test script（應該已有，若無請補上）

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

3. 如果有測試失敗，把錯誤訊息貼回給 Claude Code：

```
以下測試失敗了，請分析原因並修正程式碼或測試：

[貼上錯誤訊息]
```
:::

---

## 1.8 用 `/commit` 提交成果

完成 Lab 1 後，用 Slash 指令提交：

:::steps
1. 初始化 git（如果還沒有）

```bash
git init && git add .
```

2. 讓 Claude Code 自動生成 commit message

```
/commit
```

   Claude Code 會分析 staged changes，建議一個 Conventional Commits 格式的 message，確認後提交。
:::

---

## Lab 1 完成檢查

| 項目 | 預期結果 |
|------|----------|
| 程式碼解釋 | 正確描述三個函數的功能 |
| 安全審查 | 找出至少 4 個問題 |
| 重構完成 | 密碼加密、token 隨機、輸入驗證 |
| 測試通過 | 至少 8 個測試案例，主要案例通過 |

:::alert{type="success"}
Lab 1 完成！你已經走完 Vibe Coding 的基本流程。接下來，你會把這個成果轉化成一份正式的 Spec 文件。
:::
