---
title: Lab 3 - 建立 AMI → Launch Template → ASG → ALB
order: 4
---

# 建立 AMI → Launch Template → ASG → ALB

:::banner{type="info"}
預計完成時間：**15 ~ 20 分鐘**
:::

:::alert{type="info"}
為了實現 ALB 的 Target Group 能夠指向 Auto Scaling Group，實現自動擴展的機制，我們需要從 AMI 開始設定，接著設定 Launch Template，最終設定 ASG 與 ALB 之間的關聯性。
:::

![ASG 與 ALB 架構概覽](./img/asg-alb-overview.png)

---

## 創建 AMI

:::steps
1. 選擇 EC2 實例，點擊 **Actions → Image and templates → Create image**

   ![建立 AMI](./img/image-23.png)

2. 填寫 AMI 名稱與描述

   :::alert{type="info"}
   **AMI 命名建議**：請將 AMI Name 設定為 ``my-web-{{USERNAME}}-v1.0``，方便識別與版本管理。
   :::

   ![填寫 AMI 資訊](./img/image-24.png)

   ![AMI 設定](./img/image-25.png)

3. 確認 AMI 創建完成

   ![完成 AMI 創建](./img/image-26.png "完成 AMI 的創建")

   ![AMI 列表](./img/image-27.png)
:::

---

## 建立 Launch Template

:::steps
1. 前往 Launch Templates，點擊 **Create launch template**

   ![建立 Launch Template](./img/image-28.png)

2. 填寫 Launch Template 名稱

   :::alert{type="info"}
   **Launch Template 命名建議**：請將名稱設定為 ``my-web-{{USERNAME}}-tpl``，方便識別與管理。
   :::

   ![填寫名稱](./img/image-29.png)

3. 選擇剛才建立的 AMI

   ![選擇 AMI](./img/image-30.png)

4. 設定 Instance Type

   ![設定 Instance Type](./img/image-31.png)

5. 設定 Key Pair

   ![設定 Key Pair](./img/image-32.png)

6. 設定網路與 Security Group

   ![設定網路](./img/image-33.png)

7. 確認 Launch Template 創建完成

   ![完成 Launch Template 創建](./img/image-34.png "完成 Launch Template 的創建")
:::

---

## 建立 Auto Scaling Group

:::steps
1. 前往 Auto Scaling Groups，點擊 **Create Auto Scaling group**

   ![建立 ASG](./img/image-35.png)

2. 填寫 ASG 名稱，選擇 Launch Template

   :::alert{type="info"}
   **ASG 命名建議**：請將名稱設定為 ``my-web-{{USERNAME}}-asg``，方便識別與管理。
   :::

   ![填寫 ASG 名稱](./img/image-36.png)

3. 設定網路 - 選擇 VPC 與 Subnet

   ![設定網路](./img/image-37.png)

   ![選擇 Subnet](./img/image-38.png)

4. 設定負載平衡 - 建立新的 ALB

   ![設定負載平衡](./img/image-39.png)

   :::alert{type="info"}
   **ALB 命名建議**：請將 ALB Name 設定為 ``my-web-{{USERNAME}}-alb``，方便識別與管理。
   :::

   ![建立 ALB](./img/image-40.png)

   ![ALB 設定](./img/image-41.png)

   :::alert{type="info"}
   **Target Group 命名建議**：請將 Target Group Name 設定為 ``my-web-{{USERNAME}}-alb-tg``，方便識別與管理。
   :::

5. 設定 Auto Scaling Group

   ![設定 ASG](./img/image-42.png)

   ![ASG 設定](./img/image-43.png)

6. 設定 Group Size（Desired / Min / Max）

   ![設定 Group Size](./img/image-44.png)

7. 設定 Scaling Policy

   ![設定 Scaling Policy](./img/image-45.png)

8. 確認設定並建立

   ![確認設定](./img/image-46.png)

9. 確認 ASG 創建完成

   ![完成 ASG 創建](./img/image-47.png "完成 ASG 的創建")

   ![ASG 實例狀態](./img/image-48.png)
:::

---

## 綁定 Target Group

:::alert{type="warning"}
如果檢視 Target Group 會發現它尚未綁定 ASG，需要手動更新。
:::

![Target Group 尚未綁定](./img/image-49.png "⚠️ 如果檢視 my-web-alb-tg 會發現它尚未綁定 my-web-asg")

:::steps
1. 進入 ASG 設定，點擊 **Edit**

   ![編輯 ASG](./img/image-50.png)

2. 在 Load balancing 區塊，選擇 Target Group

   ![選擇 Target Group](./img/image-51.png)

3. 儲存設定

   ![儲存設定](./img/image-52.png)
:::

---

## 更新 ALB 的 Security Group

:::steps
1. 前往 Load Balancers，選擇 ALB

   ![選擇 ALB](./img/image-53.png)

2. 進入 Security Group 設定

   ![Security Group 設定](./img/image-54.png)

3. 編輯 Inbound Rules，新增 HTTP (Port 80)

   ![編輯 Inbound Rules](./img/image-55.png)

   ![新增 HTTP 規則](./img/image-56.png)

   ![設定來源](./img/image-57.png)

4. 儲存規則

   ![儲存規則](./img/image-58.png)
:::

---

## 驗證結果

透過 ALB DNS URL 測試連線 Web Server：

![從 ALB DNS URL 測試連線 Web Server](./img/image-59.png "從 ALB DNS URL 測試連線 Web Server")

:::alert{type="success"}
ALB + ASG 架構建立完成，可透過 ALB DNS Name 正常訪問 Web Server。
:::
