# AWS ECS 容器化服務實戰工作坊

ECV Solutions Architect Workshop - Published at 2026.04

---

## 本次實作目標

本次實作旨在從零開始建構一套完整的容器化應用架構，核心目標包含：

- 理解 Amazon ECS 核心元件（Cluster、Task Definition、Service）之間的關係與運作原理
- 使用 AWS Fargate（Serverless）模式建置 ECS 叢集，免除基礎設施管理負擔
- 透過 Amazon ECR 管理容器映像的建置、儲存與版本控制
- 將容器化應用部署至 ECS，並透過 ALB 實現負載平衡與健康檢查
- 整合 Amazon S3 實現雲端物件儲存（上傳/讀取）
- 整合 Amazon RDS（MySQL）實現關聯式資料庫存取

完成本工作坊後，你將具備獨立設計與部署 ECS Fargate 容器化應用的能力。

---

## Architecture

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

### 架構元件說明

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

---

## Workshop Structure

| Lab | Duration | What You'll Learn |
|-----|----------|-------------------|
| [Lab 0 - 行前準備](./labs/lab0-prerequisites.md) | 10 mins | 安裝 AWS CLI、Docker，確認環境就緒 |
| [Lab 1 - ECS 概念說明](./labs/lab1-ecs-concepts.md) | 15 mins | ECS 核心元件、Fargate vs EC2、與 EKS 的差異 |
| [Lab 2 - 部署基礎環境與 ECS 叢集建置](./labs/lab2-cluster-setup.md) | 15-20 mins | 使用 CloudFormation 部署 VPC、ECS Cluster、ALB、S3、RDS |
| [Lab 3 - ECR 容器映像儲存](./labs/lab3-ecr.md) | 15-20 mins | 建立 ECR Repository、建置 Docker 映像、推送至 ECR |
| [Lab 4 - 將應用部署至 ECS 環境](./labs/lab4-deploy-app.md) | 20-25 mins | 註冊 Task Definition、建立 Service、透過 ALB 驗證 |
| [Lab 5 - 雲端物件儲存整合（S3）](./labs/lab5-s3-integration.md) | 15-20 mins | 更新應用程式整合 S3 上傳/讀取功能 |
| [Lab 6 - 資料庫儲存整合（RDS）](./labs/lab6-rds-integration.md) | 15-20 mins | 更新應用程式整合 RDS MySQL 讀寫功能 |
| [Lab 7 - 資源清除](./labs/lab7-cleanup.md) | 10 mins | 刪除所有 AWS 資源避免產生費用 |

**總時長**：約 2-3 小時

---

## 前置條件

| 項目 | 說明 |
|------|------|
| AWS 帳號 | 具備 AdministratorAccess 或同等權限 |
| AWS CLI | v2 以上，已設定 credentials |
| Docker | Docker Desktop 或 Docker Engine |
| 區域 | `us-east-1` (N. Virginia) |
| 預估費用 | 約 $2-5 USD（完成後請立即清除資源） |

---

## 延伸學習

- [Amazon ECS 開發者指南](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/)
- [AWS Fargate 定價](https://aws.amazon.com/fargate/pricing/)
- [ECR 使用者指南](https://docs.aws.amazon.com/AmazonECR/latest/userguide/)
- [ECS Workshop 官方](https://ecsworkshop.com/)
- [ECS Task Definition 參數](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)
