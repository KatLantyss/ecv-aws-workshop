---
title: 互動元件
order: 3
---

# 互動元件

Lab 教學內容的核心語法。絕大多數的實作步驟都應該用 **Steps** 撰寫，多平台操作用 **Tabs** 區分，選讀補充資料用 **Expand** 收合。

## Steps 步驟列表

Lab 的主要結構。自動編號、每個步驟支援完整 Markdown：

:::steps
1. 開啟 AWS Console，前往 **ECS > Clusters**

   確認目前的 Region 是 `ap-northeast-1`（東京）。

2. 點選 **Create cluster**，填入以下設定

   | 欄位 | 值 |
   |------|----|
   | Cluster name | ``workshop-cluster`` |
   | Infrastructure | AWS Fargate (serverless) |

3. 點選 **Create**，等待狀態變為 ::status[Active]{type="success" icon="aws-success"}

   :::alert{type="info"}
   建立通常需要 30–60 秒，可以重新整理頁面確認狀態。
   :::
:::

```markdown
:::steps
1. 第一步標題
   說明文字，支援 **Markdown**、``可複製指令``、表格等。
   ```bash
   指令
   ```
2. 第二步
3. 第三步
:::
```

:::alert{type="info"}
步驟內的續行會自動歸入上一個步驟，空行不影響 Markdown 渲染。
:::

---

## Tabs 分頁

適合同一個操作有多個平台或語言版本時使用：

:::tabs
::tab[macOS / Linux]
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install
aws --version
```

::tab[Windows]
```powershell
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
aws --version
```

::tab[AWS CloudShell]
CloudShell 已內建 AWS CLI，不需安裝，直接使用：
```bash
aws --version
```
:::

````markdown
:::tabs
::tab[分頁一]
內容...

::tab[分頁二]
內容...
:::
````

---

## Expand 可展開區塊

適合放補充說明、進階設定、或選讀資料，預設收合不干擾主要流程：

:::expand{title="什麼是 Fargate？"}
AWS Fargate 是 ECS 的 Serverless 運算引擎，不需要管理 EC2 Instance，直接指定 CPU / Memory 即可執行容器。

- 不需預先佈建伺服器
- 依實際使用量計費
- 適合低流量或不穩定的工作負載
:::

:::expand{title="進階設定：自訂 VPC"}
如果你需要將 ECS Cluster 部署到特定 VPC，在 **Networking** 區段：

1. 選擇你的 VPC
2. 選擇至少兩個 Subnet（建議選 Private Subnet）
3. 確認 Security Group 允許所需的 Inbound/Outbound 規則
:::

```markdown
:::expand{title="標題文字"}
選讀內容，支援完整 Markdown。
:::
```
