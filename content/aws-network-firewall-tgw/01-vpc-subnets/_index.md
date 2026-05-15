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

:::steps
1. 前往 Subnets，點擊 **Create subnet**

   ![Create subnet](./img/image-6.png)

2. 選擇 Workload-VPC，填寫 TGW Subnet 資訊

   ![選擇 VPC](./img/image-7.png)

   ![填寫 Subnet 資訊](./img/image-8.png)

   ![AZ 設定](./img/image-9.png)

3. 建立第二個 AZ 的 TGW Subnet

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

   ![Create subnet](./img/image-17.png)

   ![選擇 Inspection-VPC](./img/image-18.png)

   ![填寫 Subnet 資訊](./img/image-19.png)

2. 建立第二個 AZ 的 TGW Subnet

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
