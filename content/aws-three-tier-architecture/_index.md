---
title: 總覽
order: 0
---

# 建立 AWS 企業級三層式架構

::badge[AWS]{type="info"} ::badge[中級]{type="default"} ::badge[2~3 小時]{type="default"}

---

## 實作目標

本次實作旨在帶領學員於 AWS 雲端環境中，從零開始構建一個具備**高可用性 (High Availability)** 與**安全性**的標準化三層式架構。

我們將在單一 VPC 內橫跨兩個**可用區域 (Availability Zones)** 進行部署，以確保服務不因單點故障而中斷。實作重點包含：

- **Web/存取層**：配置 **WAF (網頁應用程式防火牆)** 與 **Application Load Balancer (ALB)**，實現流量過濾與負載平衡；並透過 **Bastion Host (堡壘機)** 建立安全的運維通道。
- **應用層 (App Tier)**：利用 **Auto Scaling Group** 動態調節 EC2 執行個體數量，確保系統彈性。
- **資料層 (Data Tier)**：部署 **Amazon RDS** 託管資料庫，並將其置於私有子網內以強化資安。

此外，本課程將結合 **IAM** 權限管理、**Systems Manager (SSM)** 免密鑰遠端維護，以及 **Secrets Manager** 安全儲存敏感資訊。透過本次實作，您將掌握企業級雲端架構的部署邏輯與資安最佳實務。

---

## Architecture

![建立企業級三層式架構](./00-prerequisites/img/architecture.jpg)

---

## 課程大綱

| Lab | 預估時間 | 學習內容 |
|-----|---------|---------|
| 行前準備 - 安裝工具 | 15 mins | 安裝 aws-cli、session-manager-plugin、pgAdmin |
| 建立 AWS 雲端網路環境 | 15 mins | 創建 VPC、Subnet、Route Tables、IGW、NAT Gateway |
| 建立 EC2 (Web Server) 樣板 | 10-15 mins | 建立 EC2、測試 Public IP 訪問網頁 |
| 建立 AMI → Launch Template → ASG → ALB | 15-20 mins | 設定 AMI、Launch Template、ASG、ALB 與 Target Group 的關聯性 |
| 啟用 AWS Systems Manager | 15-20 mins | 使用 Session Manager 連線 EC2 實例 |
| 建立 RDS 資料庫 | 15-20 mins | 建立 RDS 資料庫並測試連線 |
| 從本地 pgAdmin 連線 private RDS | 15-20 mins | 透過本地資料庫 GUI 連線 RDS |
| 為 ALB 設定 WAF 防火牆規則 | 10 mins | 為 ALB 增強網路安全性 |

---

## 章節導覽

:::steps
1. [行前準備 - 安裝工具](./00-prerequisites/_index.md)

   ::badge[15 分鐘]{type="default"}

2. [建立 AWS 雲端網路環境](./01-vpc-networking/_index.md)

   ::badge[15 分鐘]{type="default"}

3. [建立 EC2 (Web Server) 樣板](./02-ec2-web-server/_index.md)

   ::badge[10~15 分鐘]{type="default"}

4. [建立 AMI → Launch Template → ASG → ALB](./03-ami-asg-alb/_index.md)

   ::badge[15~20 分鐘]{type="default"}

5. [啟用 AWS Systems Manager](./04-systems-manager/_index.md)

   ::badge[15~20 分鐘]{type="default"}

6. [建立 RDS 資料庫](./05-rds-database/_index.md)

   ::badge[15~20 分鐘]{type="default"}

7. [從本地 pgAdmin 連線 private RDS](./06-connect-rds-locally/_index.md)

   ::badge[15~20 分鐘]{type="default"}

8. [為 ALB 設定 WAF 防火牆規則](./07-waf/_index.md)

   ::badge[10 分鐘]{type="default"}
:::
