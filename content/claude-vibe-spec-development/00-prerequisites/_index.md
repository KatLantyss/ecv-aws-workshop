---
title: 行前準備
order: 1
---

# 行前準備

::badge[講師操作]{type="warning"} ::badge[學員操作]{type="info"} ::badge[約 10 分鐘]{type="default"}

本課程使用 AWS EC2 作為統一的操作環境，學員透過瀏覽器連線進入預裝好 Claude Code 與 VS Code 的機器，**不需要在自己的電腦安裝任何軟體**。

---

## 整體架構

```
講師 → 部署 infra stack（VPC，一次）
講師 → 為每位學員部署 user stack（EC2 + code-server）
       ↓
學員 → 用瀏覽器開啟 http://<EC2 IP>:8080
學員 → 輸入密碼登入 VS Code（密碼 = 講師指定的 UserPrefix）
學員 → 在 VS Code 的 Terminal 或側邊欄開始 Lab
```

---

## 【講師】Step 1 — 部署共用基礎設施（只需一次）

:::alert{type="warning"}
此步驟由**講師**執行一次，所有學員共用同一個 VPC。
:::

下載共用基礎設施模板：

[::button[vibe-coding-lab-infra.yaml]{variant="default" prefix="arrow-down-to-line"}](vibe-coding-lab-infra.yaml)

:::steps
1. 登入 AWS Console，前往 **CloudFormation → Stacks → Create stack**

2. 選擇 **Upload a template file**，上傳 `vibe-coding-lab-infra.yaml`

3. Stack name 輸入：``vibe-coding-lab-infra``

4. 不需要修改任何參數，直接 **Next → Next → Submit**

5. 等待 Status 變為 `CREATE_COMPLETE`（約 1–2 分鐘）

6. 在 **Outputs** 頁籤確認以下三個值已輸出：

   | Output Key | 說明 |
   |------------|------|
   | `VPCId` | 共用 VPC ID |
   | `PublicSubnet1` | 公開子網路 ID |
   | `Region` | 部署區域 |
:::

---

## 【講師】Step 2 — 為每位學員部署 EC2 環境

:::alert{type="warning"}
每位學員需要部署一個獨立的 stack。建議用編號命名，例如 `ws-01`、`ws-02`…
:::

下載學員 Lab 模板：

[::button[vibe-coding-lab-user.yaml]{variant="default" prefix="arrow-down-to-line"}](vibe-coding-lab-user.yaml)

:::steps
1. 前往 **CloudFormation → Create stack**，上傳 `vibe-coding-lab-user.yaml`

2. 填寫以下參數：

   | 參數 | 說明 | 範例 |
   |------|------|------|
   | **Stack name** | 建議與 UserPrefix 一致 | `vibe-coding-lab-ws-01` |
   | **UserPrefix** | 學員專屬前綴，小寫英數字與連字號 | `ws-01` |
   | **AnthropicApiKey** | 學員的 Anthropic API Key | `sk-ant-...` |
   | **LabName** | 保持預設值 | `vibe-coding-lab` |

3. Submit 後等待 `CREATE_COMPLETE`（約 3–5 分鐘，EC2 UserData 初始化需要時間）

4. 在 **Outputs** 頁籤取得學員的連線資訊：

   | Output | 說明 |
   |--------|------|
   | `VSCodeUrl` | 學員瀏覽器連線 URL（例如 `http://54.x.x.x:8080`） |
   | `LoginPassword` | VS Code 登入密碼（= UserPrefix，例如 `ws-01`） |
   | `SSMSessionUrl` | 講師排查用的 SSM 連線連結 |
:::

:::expand{title="批次部署多位學員的技巧"}
如果學員人數較多，可以用 AWS CLI 批次執行：

```bash
for i in $(seq -w 1 20); do
  aws cloudformation create-stack \
    --stack-name "vibe-coding-lab-ws-${i}" \
    --template-body file://vibe-coding-lab-user.yaml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameters \
      ParameterKey=UserPrefix,ParameterValue="ws-${i}" \
      ParameterKey=AnthropicApiKey,ParameterValue="sk-ant-YOUR_KEY_HERE" \
      ParameterKey=LabName,ParameterValue="vibe-coding-lab"
done
```

部署完成後，用以下指令批次取得所有學員的 URL：

```bash
for i in $(seq -w 1 20); do
  URL=$(aws cloudformation describe-stacks \
    --stack-name "vibe-coding-lab-ws-${i}" \
    --query "Stacks[0].Outputs[?OutputKey=='VSCodeUrl'].OutputValue" \
    --output text)
  echo "ws-${i}: ${URL}  (密碼: ws-${i})"
done
```
:::

---

## 【講師】確認學員環境就緒

等待所有 stack `CREATE_COMPLETE` 後，用 SSM 快速確認初始化完成：

```bash
# 用 SSM 連進去確認服務狀態
aws ssm start-session --target <InstanceId>

# 進去後執行：
sudo systemctl status code-server
claude --version
ls /home/ec2-user/vibe-coding-lab/
```

:::alert{type="info"}
初始化 log 在 `/var/log/workshop-init.log`，如果 code-server 沒啟動可以先看這個檔案。
:::

---

## 【學員】連線進入 VS Code

講師會提供你一組連線資訊，格式如下：

```
URL：http://54.x.x.x:8080
密碼：ws-01
```

:::steps
1. 用瀏覽器（建議 Chrome 或 Edge）開啟講師提供的 URL

   ![code-server 登入畫面](./img/code-server-login.png "輸入講師提供的密碼登入")

2. 在 Password 欄位輸入講師提供的密碼（例如 `ws-01`），點 **Submit**

3. 進入 VS Code 後，點選上方選單 **Terminal → New Terminal**，開啟終端機

4. 在終端機確認環境：

```bash
node --version    # 應顯示 v22.x.x
claude --version  # 應顯示 Claude Code 版本
ls ~/vibe-coding-lab/   # 應看到 user-auth.js、user-auth-spec.md
```

5. 切換到 Lab 工作目錄：

```bash
cd ~/vibe-coding-lab
```
:::

---

## 【學員】啟動 Claude Code

環境中已預裝兩種使用方式，你可以選擇：

:::tabs
::tab[VS Code Extension（推薦）]
1. 點左側 Activity Bar 的 **Spark ⚡ 圖示**
2. 在側邊欄面板輸入你的第一個 Prompt
3. Claude Code 會直接存取當前開啟的工作目錄

**優點：** 不用切換視窗，可以在旁邊看 code 的同時對話，接受/拒絕每一行 diff 修改

::tab[Terminal CLI]
1. 在 VS Code 的 Terminal 中輸入：

```bash
cd ~/vibe-coding-lab
claude
```

2. 看到 `>` 提示符表示進入互動模式
3. 輸入 `/help` 確認 Slash 指令可用

**優點：** 完整的 CLI 控制，適合習慣命令列的開發者
:::

---

## 環境確認清單

完成以下確認後，才進入 Lab 1：

| 項目 | 確認指令 / 方式 |
|------|----------------|
| 瀏覽器已連線 VS Code | 看到 VS Code 介面 |
| Node.js 22 已安裝 | `node --version` → `v22.x.x` |
| Claude Code 已安裝 | `claude --version` |
| API Key 已設定 | `echo $ANTHROPIC_API_KEY` → 顯示 `sk-ant-...` |
| 工作目錄有起始檔案 | `ls ~/vibe-coding-lab/` → 看到 `user-auth.js` |

:::alert{type="success"}
環境就緒！繼續進入 Slash 指令速覽。
:::

---

:::expand{title="常見問題"}
| 問題 | 解法 |
|------|------|
| 瀏覽器無法開啟 URL | 確認使用 `http://`（非 https），確認 IP 正確 |
| 密碼錯誤 | 密碼為講師指定的 UserPrefix，例如 `ws-01` |
| VS Code 載入很慢 | 等候約 10–20 秒，第一次載入會初始化 Extension |
| `claude` 指令找不到 | 執行 `source ~/.bashrc` 後再試 |
| API Key 是空的 | 通知講師確認 CloudFormation 部署參數 |
| code-server 沒有回應 | 請講師查看 `/var/log/workshop-init.log` |
:::
