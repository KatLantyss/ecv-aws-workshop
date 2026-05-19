---
title: Lab 5 - 建立 RDS 資料庫
order: 6
---

# 建立 RDS 資料庫

:::banner{type="info"}
預計完成時間：**15 ~ 20 分鐘**
:::

---

## 建立 RDS 資料庫

:::steps
1. 搜尋 RDS，進入 RDS Console

   ![搜尋 RDS](./img/image-68.png)

2. 點擊 **Create database**

   ![Create database](./img/image-69.png)

3. 選擇資料庫引擎（PostgreSQL）

   ![選擇引擎](./img/image-70.png)

4. 選擇 Template（Dev/Test 或 Free tier）

   ![選擇 Template](./img/image-71.png)

5. 設定 DB Instance 名稱與認證資訊

   :::alert{type="info"}
   **DB cluster identifier 命名建議**：請將名稱設定為 ``my-pg-database-{{USERNAME}}``，方便講師與學員區分各自建立的資源。
   :::

   ![設定名稱與認證](./img/image-72.png)

   ![認證設定](./img/image-73.png)

6. 設定 Instance 規格

   ![Instance 規格](./img/image-74.png)

7. 設定網路 - 選擇 VPC 與 Private Subnet

   ![設定網路](./img/image-75.png)

   ![選擇 Subnet Group](./img/image-76.png)

8. 設定 Security Group

   ![設定 Security Group](./img/image-77.png)

9. 等待 RDS 建立完成，檢視配置並複製 Writer Endpoint

   ![檢視配置及 Writer Endpoint](./img/image-78.png "檢視配置，以及複製 Writer Endpoint")

   ![檢視配置](./img/image-79.png "檢視配置")
:::

---

## 從 EC2 測試 RDS 連線

透過 Session Manager 連線進入 EC2，測試 RDS 連線：

:::steps
1. 連線至 EC2

   ![連線至 EC2](./img/image-80.png)

2. 安裝 Telnet

   ```bash
   sudo dnf install telnet -y
   ```

   ![安裝 Telnet](./img/image-81.png "sudo dnf install telnet -y")

   ![Telnet 測試](./img/image-82.png)

3. 安裝 PostgreSQL Client

   ```bash
   sudo dnf install postgresql15 -y
   ```

   ![安裝 pgsql client](./img/image-83.png "sudo dnf install postgresql15 -y")

4. 連線至 RDS

   ```bash
   # 檢測版本
   psql --version

   # 嘗試連線 (endpoint 從 RDS 介面查找) (使用者名稱及密碼從 Secrets Manager 查找)
   psql -h <資料庫端點> -U <使用者名稱> -d <資料庫名稱>

   # Example
   psql -h my-pg-database-1.cluster-c1q4gqqw66zf.ap-northeast-1.rds.amazonaws.com -U postgres -d postgres
   ```

   ![連線 RDS](./img/image-84.png)

   ![輸入密碼](./img/image-85.png)

5. 確認連線成功

   ![連線成功](./img/image-86.png)

   ![查詢資料庫](./img/image-87.png)

   ![資料庫操作](./img/image-88.png)
:::

:::alert{type="success"}
RDS 資料庫建立完成，並已從 EC2 成功連線驗證。
:::
