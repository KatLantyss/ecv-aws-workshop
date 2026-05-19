---
title: Lab 5 - 創建 TGW 連通兩個 VPC
order: 6
---

# 創建 TGW 連通兩個 VPC

:::banner{type="info"}
預計完成時間：**20 ~ 25 分鐘**
:::

---

## 檢視 Workload-VPC 當中 TGW 需要的 Subnets

:::alert{type="info"}
若 Subnet 不存在，才建立。若 Subnet 已存在，則直接進入 **「變更 Route Table 的名稱」**
:::


### 建立 TGW Subnet (1a)

:::steps
1. 檢視 VPC 的拓樸圖

   ![VPC 拓樸圖](./img/image.png "檢視 VPC 的拓樸圖")

2. 創建 Subnet

   ![創建 Subnet](./img/image-1.png "創建 Subnet")

   :::alert{type="info"}
   建議網段：`10.0.160.0/28` (``workload-tgw-subnet-private1-ap-northeast-1a-{{USERNAME}}``)
   :::

   ![填寫設定](./img/image-2.png)

   ![CIDR 設定](./img/image-3.png)

3. 確認建立完成

   ![建立完成](./img/image-4.png "建立出 1a 需要的 TGW subnet")
:::

### 變更 Route Table 的名稱

![變更名稱](./img/image-5.png)

![命名完成](./img/image-6.png)

### 創建另一個 TGW Subnet (1c)



:::steps
1. 建立 Subnet

   :::alert{type="info"}
   建議網段：`10.0.160.16/28` (``workload-tgw-subnet-private2-ap-northeast-1c-{{USERNAME}}``)
   :::

   ![建立 Subnet](./img/image-7.png)

2. 建立對應的 Route Table

   :::alert{type="info"}
   建議命名：`workload-rtb-tgw-private2-ap-northeast-1c-{{USERNAME}}`
   :::

   ![建立 Route Table](./img/image-8.png)

3. 編輯 Subnet 關聯性

   ![編輯關聯性](./img/image-9.png "編輯 subnet 關聯性")

   ![選擇 Subnet](./img/image-10.png)

   ![確認](./img/image-11.png)

4. 檢視 Workload-VPC 的 Resource Map

   ![Resource Map](./img/image-12.png)
:::

---

## 創建 Transit Gateway

:::steps
1. 前往 VPC → Transit Gateways，點擊 **Create transit gateway**

   ![Create TGW](./img/image-13.png)

2. 填寫 TGW 名稱與設定

   :::alert{type="info"}
   **Transit Gateway 命名建議**：請將名稱設定為 ``transit-gateway-{{USERNAME}}``，方便識別與管理。
   :::

   ![填寫名稱](./img/image-14.png)

   ![設定](./img/image-15.png)

3. 確認建立完成

   ![建立完成](./img/image-16.png)
:::

---

## 創建 Transit Gateway Attachments

### 先創建 ``tgw-{{USERNAME}}-attachment-001``（in Workload-VPC）

:::steps
1. 前往 Transit Gateway Attachments，點擊 **Create**

   ![Create Attachment](./img/image-17.png)

2. 填寫名稱：**``tgw-{{USERNAME}}-attachment-001``**，選擇 Workload-VPC

   ![填寫名稱](./img/image-18.png "建議命名: ``tgw-{{USERNAME}}-attachment-001``")

3. 選擇 TGW Subnets

   ![選擇 Subnets](./img/image-19.png)

4. 確認建立完成

   ![建立完成](./img/image-20.png)
:::

### 接著創建 ``tgw-{{USERNAME}}-attachment-002``（in Inspection-VPC）

:::steps
1. 再次點擊 **Create**，填寫名稱：**``tgw-{{USERNAME}}-attachment-002``**，選擇 Inspection-VPC

   ![填寫名稱](./img/image-21.png)

2. 選擇 TGW Subnets 並確認建立

   ![選擇 Subnets](./img/image-22.png)
:::

---

## 變更子網路的路由，連通兩個 VPC

### 變更 Workload-VPC 底下的路由

:::steps
1. 點選 Workload-VPC，準備變更 Private Subnets 的路由

   ![選擇 VPC](./img/image-23.png)

   ![Route Tables](./img/image-24.png)

2. 共 4 個 Private Subnets，全部新增路由：

   - `0.0.0.0/0` → Transit Gateway
   - `192.168.0.0/20` → Transit Gateway

   ![新增路由](./img/image-25.png)

   ![設定 TGW](./img/image-26.png)

   ![確認](./img/image-27.png)

   ![儲存](./img/image-28.png)
:::

### 變更 TGW 的路由表

:::steps
1. 前往 Transit Gateway Route Tables

   ![TGW Route Tables](./img/image-29.png)

2. 新增靜態路由

   ![新增路由](./img/image-30.png)

   ![設定路由](./img/image-31.png)

   ![確認](./img/image-32.png)
:::

### 變更 Inspection-VPC 底下的路由（回程路由）

:::steps
1. 點選 Inspection-VPC，準備變更 Private Subnets 的路由

   ![選擇 VPC](./img/image-33.png)

2. 共 2 個 Private Subnets + 1 個 Public Subnet，全部新增回程路由：

   - `10.0.0.0/16` → Transit Gateway

   ![新增回程路由](./img/image-34.png)
:::

---

## 變更 Regional NAT Gateway 相關的路由表

添加回程路由：

![NAT Gateway Route Table](./img/image-35.png)

![新增回程路由](./img/image-36.png)

---

## 變更 Firewall 的 Rule Group（Source IPs & Default Actions）

### 變更 Source IPs

:::steps
1. 前往 Network Firewall Rule Groups，編輯 allow-specific-domain-list

   ![編輯 Rule Group](./img/image-37.png)

2. 更新 Source IPs，加入 Workload-VPC 的 CIDR

   ![更新 Source IPs](./img/image-38.png)

   ![儲存](./img/image-39.png)
:::

### 變更 Stateful Rule Evaluation Order and Default Actions

:::steps
1. 前往 Firewall Policy，編輯 Stateful rule evaluation

   ![編輯 Policy](./img/image-40.png)

2. 設定 Drop action 為 **None**，Alert action 為 **Alert established**

   ![設定 Drop](./img/image-41.png)

   ![確認](./img/image-42.png)
:::

---

## 為 Workload-VPC 建立 SSM VPC Endpoints

:::alert{type="info"}
由於 Workload-VPC 的 EC2 沒有對外網路（流量走 TGW），需要建立 VPC Endpoints 才能使用 Session Manager。
:::

### 1. 建立 com.amazonaws.ap-northeast-1.ssm (endpoint)

![建立 ssm endpoint](./img/image-43.png)

![設定](./img/image-44.png)

![選擇 Subnets](./img/image-45.png)

![確認](./img/image-46.png)

### 2. 建立 com.amazonaws.ap-northeast-1.ssmmessages (endpoint)

![建立 ssmmessages endpoint](./img/image-47.png)

![設定](./img/image-48.png)

![選擇 Subnets](./img/image-49.png)

![確認](./img/image-50.png)

### 3. 建立 com.amazonaws.ap-northeast-1.ec2messages (endpoint)

![建立 ec2messages endpoint](./img/image-51.png)

![設定](./img/image-52.png)

![確認](./img/image-53.png)

### 變更 (default) Security Group - Inbound Rule

:::alert{type="warning"}
VPC Endpoints 使用的 Security Group 需要允許來自 VPC CIDR 的 HTTPS (443) 流量。
:::

![變更 SG Inbound Rule](./img/image-54.png)

---

## Troubleshooting 檢查清單

:::expand{title="常見問題排查"}
如果測試不通，請依序檢查：

- **TGW Routes**：確認 TGW Route Table 有正確的靜態路由
- **Inspection-VPC Public Subnet**：需要新增回程路由走 Firewall Endpoint
- **Regional NAT Gateway Route Table**：新增回程路由走 Firewall Endpoint
- **VPC Endpoints & Security Groups**：確認 HTTPS 443 已開放
- **Firewall Stateful Default Actions**：確認設定為 Drop established
- **EC2 Reboot**：變更 IAM Role 後可能需要重啟
- **IAM Role**：確認 EC2 有 SSM 所需的 IAM Role

![Troubleshooting 1](./img/image-55.png)

![Troubleshooting 2](./img/image-56.png)

![Troubleshooting 3](./img/image-57.png)
:::

:::alert{type="success"}
Transit Gateway 設定完成，兩個 VPC 已成功連通，所有流量經由 Network Firewall 過濾。
:::
