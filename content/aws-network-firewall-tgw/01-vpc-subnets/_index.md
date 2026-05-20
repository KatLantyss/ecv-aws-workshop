---
title: Lab 1 - 建立虛擬網路 VPC、Subnets
order: 2
---

# 建立虛擬網路 VPC、Subnets

:::banner{type="info"}
預計完成時間：**15 分鐘**
:::

---

## 建立 Workload-VPC 與 Subnets

:::steps
1. 前往 VPC Console，點擊 **Create VPC**

   ![Create VPC](./img/image.png)

2. 選擇 **VPC and more**，填寫 Workload-VPC 相關設定

   :::alert{type="info"}
   **VPC 命名建議**：請將 VPC Name 設定為 ``workload-vpc-{{USERNAME}}`` (`10.0.0.0/16`)，方便講師與學員區分各自建立的資源。
   :::

   ![VPC 設定](./img/image-1.png)

   ![CIDR 設定](./img/image-2.png)

   ![Subnet 設定](./img/image-3.png)

   ![NAT Gateway 設定](./img/image-4.png)

3. 確認建立完成

   ![建立完成](./img/image-5.png)
:::

---

## 於 Workload-VPC 建立 Transit Gateway 使用的 Subnet

:::alert{type="info"}
TGW Attachment 需要專用的 Subnet，建議使用 /28 的小網段。
:::

### 建立 TGW Subnet (1c)

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

### 創建另一個 TGW Subnet (1a)

:::steps
1. 前往 Subnets，點擊 **Create subnet**

   ![Create subnet](./img/image-6.png)

2. 選擇 Workload-VPC，填寫 TGW Subnet 資訊

   :::alert{type="info"}
   建議網段：`10.0.160.0/28` (``workload-tgw-subnet-private3-ap-northeast-1c-{{USERNAME}}``)
   :::

   ![選擇 VPC](./img/image-7.png)

   ![填寫 Subnet 資訊](./img/image-8.png)

3. 設定 Route Table 命名 ``workload-rtb-tgw-private3-ap-northeast-1c-{{USERNAME}}``

   ![AZ 設定](./img/image-9.png)

   ![第二個 TGW Subnet](./img/image-10.png)

   ![設定](./img/image-11.png)

4. 確認 TGW Subnets 建立完成

   ![確認完成](./img/image-12.png)
:::


---

## 建立 Inspection-VPC 與 Subnets

:::steps
1. 再次點擊 **Create VPC**，建立 Inspection-VPC

   ![Create VPC](./img/image.png)

2. 填寫 Inspection-VPC 相關設定

   :::alert{type="info"}
   **VPC 命名建議**：請將 VPC Name 設定為 ``inspection-vpc-{{USERNAME}}`` (`192.168.0.0/20`)，方便講師與學員區分各自建立的資源。
   :::

   ![VPC 設定](./img/image-13.png)

   ![CIDR 設定](./img/image-14.png)

   ![Subnet 設定](./img/image-15.png)

3. 確認建立完成

   ![建立完成](./img/image-16.png)
:::

---

## 於 Inspection-VPC 建立 Transit Gateway 使用的 Subnet

:::steps
1. 前往 Subnets，建立 Inspection-VPC 的 TGW Subnet

   :::alert{type="info"}
   **Subnet 命名建議**：請將 Subnet Name 設定為 ``inspection-tgw-subnet-private2-ap-northeast-1a-{{USERNAME}}`` (`192.168.15.0/28`)，方便講師與學員區分各自建立的資源。
   :::

   ![Create subnet](./img/image-17.png)

   ![選擇 Inspection-VPC](./img/image-18.png)

   ![填寫 Subnet 資訊](./img/image-19.png)

2. 設定 Route Table 命名 ``inspection-tgw-rtb-private2-ap-northeast-1a-{{USERNAME}}``

   ![第二個 TGW Subnet](./img/image-20.png)

   ![設定](./img/image-21.png)

   ![確認](./img/image-22.png)

3. 確認所有 TGW Subnets 建立完成

   ![確認完成](./img/image-23.png)

   ![最終結果](./img/image-24.png)
:::

:::alert{type="success"}
兩個 VPC（Workload-VPC 與 Inspection-VPC）及其所需的 Subnets 已全部建立完成。
:::
