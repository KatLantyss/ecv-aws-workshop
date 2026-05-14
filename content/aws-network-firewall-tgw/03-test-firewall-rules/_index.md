---
title: Lab 3 - 變更路由並測試防火牆規則
order: 4
---

# 變更 Inspection VPC 的子網路路由，測試防火牆規則是否生效

:::banner{type="info"}
預計完成時間：**15 ~ 20 分鐘**
:::

---

## 將 TGW Subnet 路由指向 Firewall Endpoint

:::steps
1. 前往 Route Tables，找到 Inspection-VPC 的 TGW Subnet Route Table

   ![找到 Route Table](./img/image.png)

2. 編輯路由，新增指向 Firewall Endpoint 的路由

   ![編輯路由](./img/image-1.png)

   ![新增路由](./img/image-2.png)

   ![選擇 Firewall Endpoint](./img/image-3.png)

3. 儲存路由

   ![儲存](./img/image-4.png)
:::

---

## 確認 Firewall 的子網路指向 NAT Gateway

:::steps
1. 檢視 Firewall Subnet 的 Route Table

   ![Firewall Subnet Route Table](./img/image-5.png)

2. 確認已有 `0.0.0.0/0` 指向 NAT Gateway 的路由

   ![確認 NAT Gateway 路由](./img/image-6.png)
:::

---

## 將 NAT Gateway 的子網路路由指向 Firewall Endpoint（回程路由）

:::steps
1. 找到 Public Subnet（NAT Gateway 所在）的 Route Table

   ![找到 Route Table](./img/image-7.png)

2. 新增回程路由，目的地為 TGW Subnet CIDR，指向 Firewall Endpoint

   ![新增回程路由](./img/image-8.png)

3. 查詢 TGW 的子網路 CIDR

   ![查詢 TGW Subnet CIDR](./img/image-9.png "查詢 TGW 的子網路 CIDR")

4. 填寫路由並儲存

   ![填寫路由](./img/image-10.png)

   ![儲存](./img/image-11.png)
:::

---

## 啟用 AWS Systems Manager → Session Manager

:::steps
1. 前往 Systems Manager，點擊 **Enable the new experience**

   ![Enable SSM](./img/image-12.png "點擊 Enable the new experience，等待約 10-15 分鐘")

   :::alert{type="warning"}
   啟用後需等待約 10-15 分鐘。
   :::

2. 確認 Systems Manager 已啟用

   ![SSM 已啟用](./img/image-13.png)

   ![Session Manager](./img/image-14.png)

   ![Managed Instances](./img/image-15.png)

   ![確認實例](./img/image-16.png)
:::

---

## 於 Inspection VPC 建立測試 EC2

:::steps
1. 前往 EC2，點擊 **Launch instance**

   ![Launch instance](./img/image-17.png)

2. 填寫 EC2 名稱與 AMI

   ![填寫名稱](./img/image-18.png)

3. 設定網路 — 選擇 Inspection-VPC 的 TGW Subnet

   ![設定網路](./img/image-19.png)

   ![選擇 Subnet](./img/image-20.png)

4. 設定 IAM Instance Profile（需具備 SSM 權限）

   ![IAM Profile](./img/image-21.png)

   ![設定 Security Group](./img/image-22.png)

5. 確認建立完成

   ![建立完成](./img/image-23.png)
:::

---

## 使用 Session Manager 連線 EC2 進行測試

:::steps
1. 透過 Session Manager 連線至測試 EC2

   ![連線 EC2](./img/image-24.png)

   ![Session Manager](./img/image-25.png)

2. 測試 curl（驗證 allow-specific-domain-list 規則）

   ```bash
   curl -I https://www.google.com
   ```

   ![測試 curl](./img/image-26.png "測試 curl (allow-specific-domain-list)")

3. 測試 ping（驗證 allow-ping-rg 規則）

   ```bash
   ping 8.8.8.8
   ```

   ![測試 ping](./img/image-27.png "測試 ping (allow-ping-rg)")
:::

:::alert{type="success"}
防火牆規則驗證成功！允許的 Domain 可正常存取，ICMP ping 也正常運作。
:::
