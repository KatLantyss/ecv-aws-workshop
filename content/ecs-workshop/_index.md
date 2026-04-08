---
title: 總覽
order: 0
---

# AWS ECS 容器化服務實戰工作坊

::badge[HANDS-ON LAB]{type="info"} ::badge[約 2-3 小時]{type="default"} ::badge[初級 ~ 中級]{type="success"}

本工作坊將從零開始建構一套完整的容器化應用架構，所有 AWS 操作皆透過 **Management Console** 完成。

## 你將學到

- Amazon ECS 核心元件（Cluster、Task Definition、Service）的關係與運作原理
- 使用 AWS Fargate（Serverless）模式建置 ECS 叢集
- 透過 Amazon ECR 管理容器映像的建置與版本控制
- 將容器化應用部署至 ECS，並透過 ALB 實現負載平衡
- 整合 Amazon S3 實現雲端物件儲存
- 整合 Amazon RDS（MySQL）實現關聯式資料庫存取

## 架構圖

```
                    ┌──────────────────────────────────────────────────┐
                    │                  VPC (10.0.0.0/16)               │
                    │                                                  │
                    │   ┌──────────────────────────────────────────┐   │
  Internet ────────▶│   │          Application Load Balancer        │   │
                    │   │              (Port 80 HTTP)               │   │
                    │   └─────────────────┬────────────────────────┘   │
                    │                     │                            │
                    │   ┌─────────────────┼────────────────────┐      │
                    │   │  Public Subnets  │                    │      │
                    │   │                 ▼                     │      │
                    │   │  ┌────────────────┐ ┌──────────────┐ │      │
                    │   │  │  Fargate Task  │ │ Fargate Task │ │      │
                    │   │  │  (Container)   │ │ (Container)  │ │      │
                    │   │  │  Port 3000     │ │ Port 3000    │ │      │
                    │   │  └───────┬────────┘ └──────┬───────┘ │      │
                    │   │          │ AZ-a             │ AZ-b    │      │
                    │   └──────────┼─────────────────┼─────────┘      │
                    │              │                  │                │
                    │   ┌──────────┼─────────────────┼─────────┐      │
                    │   │  Private Subnets            │         │      │
                    │   │          │                  │         │      │
                    │   │          ▼                  ▼         │      │
                    │   │     ┌──────────────────────────┐     │      │
                    │   │     │    RDS MySQL (db.t3.micro)│     │      │
                    │   │     │    Port 3306              │     │      │
                    │   │     └──────────────────────────┘     │      │
                    │   └──────────────────────────────────────┘      │
                    └──────────────────────────────────────────────────┘
                                          │
                               ┌──────────┴──────────┐
                               │    Amazon S3 Bucket   │
                               │   (物件儲存/上傳)      │
                               └───────────────────────┘

                               ┌───────────────────────┐
                               │    Amazon ECR          │
                               │   (容器映像儲存庫)      │
                               └───────────────────────┘
```

## 架構元件

| 元件 | 用途 | 備註 |
|------|------|------|
| VPC | 隔離的虛擬網路環境 | CIDR: 10.0.0.0/16，跨 2 個 AZ |
| Public Subnets | 放置 ALB 與 Fargate Tasks | 可直接存取 Internet |
| Private Subnets | 放置 RDS 資料庫 | 僅允許來自 ECS Security Group 的流量 |
| ALB | 負載平衡器 | 將 HTTP:80 流量分配至 Fargate Tasks |
| ECS Cluster | 容器編排叢集 | 使用 Fargate Capacity Provider |
| ECR | 容器映像儲存庫 | 啟用 Image Scanning + Lifecycle Policy |
| S3 | 物件儲存 | 加密 + 封鎖公開存取 |
| RDS | 關聯式資料庫 | MySQL 8.0，部署於 Private Subnet |

## Workshop 流程

| Lab | 時間 | 內容 |
|-----|------|------|
| Lab 0 - 行前準備 | 10 mins | 確認 AWS 帳號、安裝 Docker、設定環境 |
| Lab 1 - ECS 概念 | 15 mins | ECS 核心元件、Fargate vs EC2、與 EKS 的差異 |
| Lab 2 - 基礎環境建置 | 15-20 mins | 透過 CloudFormation Console 部署 VPC、ECS Cluster、ALB、S3、RDS |
| Lab 3 - ECR 映像管理 | 15-20 mins | 建立 ECR Repository、建置 Docker 映像、推送至 ECR |
| Lab 4 - 部署應用至 ECS | 20-25 mins | 建立 Task Definition、Service，透過 ALB 驗證 |
| Lab 5 - S3 整合 | 15-20 mins | 更新應用程式整合 S3 上傳/讀取功能 |
| Lab 6 - RDS 整合 | 15-20 mins | 更新應用程式整合 RDS MySQL 讀寫功能 |
| Lab 7 - 資源清除 | 10 mins | 刪除所有 AWS 資源避免產生費用 |

## 前置條件

| 項目 | 說明 |
|------|------|
| AWS 帳號 | 具備 AdministratorAccess 或同等權限 |
| Docker | Docker Desktop 或 Docker Engine |
| 區域 | ``us-east-1`` (N. Virginia) |
| 預估費用 | 約 $2-5 USD（完成後請立即清除資源） |

:::alert{type="warning"}
本工作坊會建立 RDS、ALB 等計費資源，完成後請務必執行 Lab 7 清除所有資源，避免產生額外費用。
:::
