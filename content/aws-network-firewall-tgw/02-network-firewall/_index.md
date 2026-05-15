---
title: Lab 2 - 建立 AWS Network Firewall
order: 3
---

# 建立 AWS Network Firewall 防火牆於 Inspection VPC

:::banner{type="info"}
預計完成時間：**15 ~ 20 分鐘**
:::

---

## 建立 Network Firewall

:::steps
1. 搜尋 Network Firewall，進入 Console

   ![搜尋 Network Firewall](./img/image.png)

2. 點擊 **Create firewall**

   ![Create firewall](./img/image-1.png)

3. 填寫 Firewall 名稱，選擇 Inspection-VPC

   ![填寫名稱](./img/image-2.png)

   ![選擇 VPC](./img/image-3.png)

4. 選擇 Firewall Subnet（Inspection-VPC 的 Firewall Subnet）

   ![選擇 Subnet](./img/image-4.png)

   ![Subnet 設定](./img/image-5.png)
:::

---

## 建立 CloudWatch Log Group

:::alert{type="info"}
建立 Log Group 用於記錄 Firewall 的 Alert 與 Flow Logs。
:::

:::steps
1. 開啟新分頁，前往 CloudWatch → Log groups

   ![CloudWatch Log groups](./img/image-6.png)

2. 點擊 **Create log group**

   ![Create log group](./img/image-7.png)

3. 填寫 Log Group 名稱

   ![填寫名稱](./img/image-8.png)

4. 確認建立完成

   ![建立完成](./img/image-9.png)
:::

---

## 回到 Create Firewall 介面

:::steps
1. 設定 Logging 指向剛才建立的 Log Group

   ![設定 Logging](./img/image-10.png)

   ![Logging 設定](./img/image-11.png)

2. 設定 Firewall Policy

   ![Firewall Policy](./img/image-12.png)

   ![Policy 設定](./img/image-13.png)

3. 等待 Firewall 佈建完成（約 10-15 分鐘）

   ![等待佈建完成](./img/image-14.png "等待 Firewall 佈建完成，約 10-15 分鐘")

   ![佈建完成](./img/image-15.png)
:::

---

## 建立 Stateful Rule Group — Allow Domain List

:::steps
1. 前往 Network Firewall → Rule groups

   ![Rule groups](./img/image-16.png)

2. 點擊 **Create rule group**，選擇 Stateful

   ![Create rule group](./img/image-17.png)

3. 選擇 Domain list 類型

   ![Domain list](./img/image-18.png)

4. 填寫允許的 Domain 清單

   ![填寫 Domain](./img/image-19.png)

5. 確認建立完成

   ![建立完成](./img/image-20.png)
:::

---

## 將 Rule Group (allow-specific-domain-list) 新增到 Policy

:::steps
1. 回到 Firewall Policy，點擊 **Add rule group**

   ![Add rule group](./img/image-21.png)

   ![選擇 Rule group](./img/image-22.png)

2. 選擇 allow-specific-domain-list

   ![選擇 domain list](./img/image-23.png)

   ![確認](./img/image-24.png)

3. 儲存 Policy

   ![儲存](./img/image-25.png)

   ![儲存完成](./img/image-26.png)

   ![確認結果](./img/image-27.png)
:::

---

## 建立 Stateful Rule Group — Allow ICMP (Ping)

:::steps
1. 再次點擊 **Create rule group**

   ![Create rule group](./img/image-28.png)

2. 選擇 Standard stateful rule 類型

   ![Standard stateful rule](./img/image-29.png)

3. 設定 ICMP 規則

   ![ICMP 規則](./img/image-30.png)

   ![規則設定](./img/image-31.png)

   ![Source/Destination](./img/image-32.png)

4. 確認建立完成

   ![建立完成](./img/image-33.png)

   ![Rule group 列表](./img/image-34.png)

   ![詳細資訊](./img/image-35.png)

   ![規則內容](./img/image-36.png)
:::

---

## 將 Rule Group (allow-ping-rg) 新增到 Policy

:::steps
1. 回到 Firewall Policy，新增 allow-ping-rg

   ![Add rule group](./img/image-37.png)

   ![選擇 allow-ping-rg](./img/image-38.png)

   ![確認](./img/image-39.png)

2. 儲存 Policy

   ![儲存](./img/image-40.png)

3. 回到 Firewall 確認 Sync State 狀態轉為 **In sync**

   ![確認 In sync](./img/image-41.png "到 Firewall 觀察 Sync State 狀態，直到轉為 In sync")
:::

:::alert{type="success"}
AWS Network Firewall 建立完成，已設定 Domain 白名單與 ICMP 允許規則。
:::
