---
title: Vibe Coding 與 Spec Driven Development
order: 1
---

# Vibe Coding 與 Spec Driven Development

::badge[HANDS-ON LAB]{type="info"} ::badge[約 60 分鐘]{type="default"}

本 Workshop 分為兩個獨立的 Lab，分別對應課程的 Part 2 與 Part 3。你將透過實際操作，體驗 Vibe Coding 與 Spec Driven Development 的完整流程。

---

## 學習目標

- 使用 Claude Code 解釋、除錯與重構程式碼
- 掌握撰寫高品質 Prompt 的技巧
- 請 AI 生成對應的單元測試
- 撰寫一份結構化的 Spec 文件
- 比較「有 Spec」與「無 Spec」的 AI 輸出差異
- 使用 Spec 驅動 Claude Code 生成可驗收的程式碼

---

## 工具準備

| 工具 | 說明 |
|------|------|
| Claude Code | 主要 AI 開發工具（命令列） |
| Node.js 18+ | 執行範例程式碼 |
| 任意文字編輯器 | VS Code 或其他 |

---

## Lab 流程

| Lab | 內容 | 預估時間 |
|-----|------|----------|
| Lab 1 - Vibe Coding | 解釋 → 除錯 → 重構 → 測試 | 30 分鐘 |
| Lab 2 - Spec Driven Development | 撰寫 Spec → 驅動生成 → 比較差異 | 30 分鐘 |

---

:::alert{type="info"}
兩個 Lab 有連貫性：Lab 2 會延續 Lab 1 的成果，請按順序完成。
:::

---

# Lab 1 — Vibe Coding 實戰

::badge[實作]{type="info"} ::badge[約 30 分鐘]{type="default"}

你將拿到一段有問題的程式碼，透過與 Claude Code 的對話，完成解釋、除錯、重構與測試生成的完整流程。

---

## 1.0 安裝 Claude Code

:::steps
1. 確認 Node.js 版本

```bash
node --version
# 需要 18.0 以上
```

2. 安裝 Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

3. 啟動並完成登入

```bash
claude
```

4. 確認可正常使用

```bash
claude --version
```
:::

:::expand{title="安裝遇到問題？"}
| 問題 | 解法 |
|------|------|
| `permission denied` | 改用 `sudo npm install -g` 或使用 nvm |
| `node: command not found` | 請先安裝 Node.js：nodejs.org |
| 登入失敗 | 確認網路連線，或聯繫助教 |
:::

---

## 1.1 建立專案目錄

:::steps
1. 建立工作目錄

```bash
mkdir vibe-coding-lab && cd vibe-coding-lab
```

2. 建立範例檔案

```bash
cat > user-auth.js << 'EOF'
const users = [];

function register(username, password) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) {
      return false;
    }
  }
  users.push({ username: username, password: password });
  return true;
}

function login(username, password) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) {
      if (users[i].password == password) {
        return { success: true, token: username + "_token_" + Date.now() };
      }
    }
  }
  return { success: false };
}

function getUserData(token) {
  const username = token.split("_token_")[0];
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) {
      return users[i];
    }
  }
  return null;
}

module.exports = { register, login, getUserData };
EOF
```
:::

---

## 1.2 請 Claude Code 解釋程式碼

在專案目錄中啟動 Claude Code，並輸入以下 Prompt：

```
請解釋 user-auth.js 這個檔案的功能，
包含每個函數的用途、輸入與輸出，
以及你觀察到的潛在問題。
```

:::alert{type="info"}
觀察 Claude Code 的回應：它能否正確理解程式碼的意圖？它發現了哪些問題？
:::

---

## 1.3 找出 Bug 與安全問題

輸入以下 Prompt，請 Claude Code 進行深度分析：

```
請針對這段程式碼進行安全審查，
找出所有可能的安全漏洞和 Bug，
並說明每個問題的危險程度（高/中/低）和原因。
```

:::expand{title="這段程式碼有哪些問題？（思考看看再展開）"}
| 問題 | 類型 | 危險程度 |
|------|------|----------|
| 密碼以明文儲存 | 安全漏洞 | 高 |
| Token 可偽造（只是 username + timestamp） | 安全漏洞 | 高 |
| 使用 `==` 而非 `===` 比較 | Bug | 中 |
| 沒有密碼強度驗證 | 功能缺失 | 中 |
| `getUserData` 回傳完整物件含密碼 | 安全漏洞 | 高 |
| 沒有輸入格式驗證 | 功能缺失 | 低 |
:::

---

## 1.4 用自然語言描述修復需求

根據你與 Claude Code 的對話，撰寫一個修復 Prompt。

**參考方向（請用自己的方式描述）：**

```
請重構 user-auth.js，修復前面找到的安全問題：

1. 使用 bcrypt 加密儲存密碼
2. 使用 crypto.randomUUID() 產生不可預測的 token
3. 統一使用 === 進行比較
4. getUserData 不應回傳密碼欄位
5. 新增 email 格式的輸入驗證

請保持原本的函數簽名（register, login, getUserData），
讓現有的呼叫方不需要修改。
```

:::alert{type="warning"}
觀察重點：你的 Prompt 越具體，AI 的輸出越符合預期。試著改變描述方式，觀察輸出的差異。
:::

---

## 1.5 驗收重構結果

Claude Code 完成重構後，逐項確認：

- [ ] 密碼是否以 bcrypt hash 儲存？
- [ ] token 是否不再是可預測的格式？
- [ ] 是否使用 `===` 進行比較？
- [ ] `getUserData` 是否移除了密碼欄位？
- [ ] 是否有輸入驗證？

:::expand{title="如果輸出不符合預期？"}
這是正常的！試著用更精確的語言補充描述：

```
你產生的 token 還是可以從外部猜測，
請改用 Node.js 的 crypto.randomBytes(32).toString('hex')
產生一個完全隨機的 token，並另外用一個 Map 記錄 token 與 username 的對應關係。
```

**來回對話本身就是 Vibe Coding 的核心技能。**
:::

---

## 1.6 請 Claude Code 生成測試

```
請為重構後的 user-auth.js 撰寫完整的單元測試（使用 Jest），
需要涵蓋：

- register：正常註冊、重複帳號
- login：正確密碼、錯誤密碼、帳號不存在
- getUserData：有效 token、無效 token
- 邊界案例：空字串、null、特殊字元
```

:::steps
1. 安裝 Jest

```bash
npm init -y && npm install --save-dev jest
```

2. 執行 Claude Code 生成的測試

```bash
npx jest
```

3. 觀察測試結果，哪些通過？哪些失敗？
:::

:::alert{type="info"}
如果有測試失敗，把失敗訊息貼回給 Claude Code，請它分析原因並修正。
:::

---

## Lab 1 完成檢查

| 項目 | 預期結果 |
|------|----------|
| 程式碼解釋 | Claude Code 正確描述每個函數的功能 |
| 安全審查 | 找出至少 3 個問題 |
| 重構完成 | 密碼加密、token 安全、輸入驗證 |
| 測試生成 | 至少 8 個測試案例，主要案例通過 |

:::alert{type="success"}
Lab 1 完成！休息一下，準備進入 Lab 2。
:::

---

# Lab 2 — Spec Driven Development

::badge[實作]{type="info"} ::badge[約 30 分鐘]{type="default"}

你將為 Lab 1 的成果補寫一份正式的 Spec，然後用這份 Spec 重新驅動 Claude Code 生成程式碼，比較兩次輸出的差異。

---

## 2.1 理解 Spec 的結構

在開始撰寫之前，先認識一份標準 Spec 的格式：

```markdown
## 功能名稱
[簡短的功能名稱]

## 背景與目的
[為什麼需要這個功能？解決什麼問題？]

## 輸入規格
[每個參數的名稱、型別、是否必填、格式限制]

## 輸出規格
[成功/失敗的回傳格式與內容]

## 業務規則
[特殊邏輯、限制條件、邊界行為]

## 錯誤處理
[各種錯誤情境的處理方式與回傳格式]

## 不在範圍內
[明確列出這個版本不會實作的功能]

## 測試情境
[列出驗收時需要通過的測試案例]
```

---

## 2.2 撰寫你的第一份 Spec

在 `vibe-coding-lab` 目錄中建立 Spec 文件：

```bash
touch user-auth-spec.md
```

根據 Lab 1 的重構結果，填寫以下 Spec 模板：

```markdown
## 功能名稱
使用者認證模組（User Authentication）

## 背景與目的
提供基本的使用者註冊與登入功能，供後端 API 呼叫使用。
需確保密碼安全存儲，並使用不可預測的 token 進行身份驗證。

## 輸入規格

### register(username, password)
- username: string，必填，3–20 字元，僅允許英數字與底線
- password: string，必填，最少 8 字元

### login(username, password)
- username: string，必填
- password: string，必填

### getUserData(token)
- token: string，必填，由 login 回傳

## 輸出規格

### register
- 成功：{ success: true }
- 帳號已存在：{ success: false, error: "USERNAME_EXISTS" }
- 格式不符：{ success: false, error: "INVALID_INPUT" }

### login
- 成功：{ success: true, token: string }
- 帳號不存在或密碼錯誤：{ success: false, error: "INVALID_CREDENTIALS" }

### getUserData
- 成功：{ username: string }（不含密碼）
- token 無效：null

## 業務規則
- 密碼必須以 bcrypt（cost factor 10）加密後儲存
- token 使用 crypto.randomBytes(32) 產生，長度 64 字元（hex）
- token 與 username 的對應關係存於記憶體 Map
- username 比對區分大小寫

## 錯誤處理
- 所有輸入為 null 或 undefined 時，視為格式不符
- 不對外暴露系統內部錯誤訊息

## 不在範圍內
- Token 過期機制
- 密碼重設功能
- 多因素驗證
- 資料持久化（資料庫）

## 測試情境
1. 正常註冊新帳號 → success: true
2. 重複註冊相同帳號 → error: USERNAME_EXISTS
3. 使用正確密碼登入 → success: true，回傳有效 token
4. 使用錯誤密碼登入 → error: INVALID_CREDENTIALS
5. 使用有效 token 取得使用者資料 → 回傳 username，不含密碼
6. 使用無效 token → 回傳 null
7. 輸入空字串或 null → error: INVALID_INPUT
```

:::alert{type="info"}
花 10 分鐘認真填寫這份 Spec，越具體越好。這份文件的品質，決定了後面生成程式碼的品質。
:::

---

## 2.3 用 Spec 驅動 Claude Code

在 Claude Code 中輸入以下 Prompt：

```
請閱讀 user-auth-spec.md，
完全依照 Spec 的規格，
從頭實作一個全新的 user-auth-v2.js。

不要保留任何 user-auth.js 的舊程式碼，
完全以 Spec 為依據。
```

:::alert{type="warning"}
注意：這次我們請 Claude Code 從頭生成，而不是修改舊的程式碼。稍後會比較兩個版本。
:::

---

## 2.4 比較兩次的輸出差異

同時打開 `user-auth.js`（Lab 1 重構版）與 `user-auth-v2.js`（Spec 驅動版），比較：

| 比較項目 | Lab 1 重構版 | Lab 2 Spec 驅動版 |
|---------|------------|-----------------|
| 錯誤回傳格式 | | |
| token 長度/格式 | | |
| 輸入驗證細節 | | |
| 函數簽名 | | |
| 邊界行為 | | |

**思考：哪個版本更符合你原本的期待？為什麼？**

---

## 2.5 用 Spec 生成測試

```
請根據 user-auth-spec.md 的「測試情境」章節，
為 user-auth-v2.js 生成完整的 Jest 測試。

測試檔命名為 user-auth-v2.test.js，
必須涵蓋 Spec 中列出的所有 7 個測試情境。
```

:::steps
1. 執行測試

```bash
npx jest user-auth-v2.test.js
```

2. 確認 7 個測試情境全部通過

3. 比較這份測試與 Lab 1 自動生成的測試，哪個更準確？
:::

---

## 2.6 挑戰：修改 Spec，觀察影響

試著修改 Spec 中的一個規則，然後重新請 Claude Code 生成：

**挑戰選項（選一個）：**

:::tabs
::tab[挑戰 A — 加入 token 過期]
將以下內容加入 Spec 的「業務規則」：
```
- token 有效期為 1 小時，超過後 getUserData 回傳 null
```
然後請 Claude Code 更新 `user-auth-v2.js`

::tab[挑戰 B — 登入失敗鎖定]
將以下內容加入 Spec 的「業務規則」：
```
- 同一帳號連續登入失敗 5 次，鎖定 15 分鐘
- 鎖定期間回傳 error: "ACCOUNT_LOCKED"
```
然後請 Claude Code 更新 `user-auth-v2.js`

::tab[挑戰 C — 修改輸出格式]
將 Spec 中 `login` 的成功輸出改為：
```
{ success: true, token: string, expiresAt: ISO8601 timestamp }
```
觀察 Claude Code 如何同步更新程式碼與測試
:::

---

## Lab 2 完成檢查

| 項目 | 預期結果 |
|------|----------|
| Spec 文件 | user-auth-spec.md 包含所有必要章節 |
| Spec 驅動生成 | user-auth-v2.js 與 Spec 完全對應 |
| 測試通過 | 7 個測試情境全部通過 |
| 差異比較 | 能描述兩個版本的主要差異 |

:::alert{type="success"}
恭喜完成兩個 Lab！你已經體驗了從 Vibe Coding 到 Spec Driven Development 的完整流程。
:::

---

## 回顧與反思

完成兩個 Lab 後，思考以下問題：

:::steps
1. **Vibe Coding** — 在什麼情況下你覺得「來回對話」比一次性 Prompt 更有效？

2. **Spec 的價值** — 撰寫 Spec 花了你多少時間？這個投入值得嗎？

3. **AI 的邊界** — 有沒有哪些需求，你發現 Claude Code 無法正確理解？

4. **團隊應用** — 如果你的團隊要導入 SDD，最大的阻力會是什麼？
:::

---

## 延伸挑戰（選做）

完成基本 Lab 後，可以嘗試：

- 為你目前工作中的一個真實功能撰寫 Spec
- 試試 Claude Code 的 `--continue` 模式進行多輪對話
- 請 Claude Code 為你現有的程式碼自動生成 Spec（逆向工程）

---

:::alert{type="info"}
**Spec 模板下載**

課後可在課程頁面下載空白 Spec 模板（Markdown 格式），直接套用在你的下一個功能開發。
:::
