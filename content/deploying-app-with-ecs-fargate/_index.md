---
title: 總覽
order: 0
---

# AWS ECS 容器化服務實戰工作坊

::badge[AWS]{type="info"} ::badge[約 2-3 小時]{type="default"} 

情境設定：一款線上遊戲 — **Web 2048** 即將上線，預期會有大量玩家透過網路存取。開發團隊希望專注在遊戲開發上，不想花時間管理基礎設施，也不想預先投入大量資金，但需要確保應用在部署後能夠彈性擴展。

雲端架構師建議使用 **Amazon ECS on AWS Fargate** 來部署這款遊戲。

本工作坊將 Web 2048 遊戲打包成 Docker 容器映像，推送至 Amazon ECR，建立 ECS 叢集，並將容器部署到 AWS Fargate 上運行。接著逐步整合 S3 物件儲存與 RDS 資料庫，打造一套完整的容器化應用架構。

---

## 學習目標

- 將網頁應用打包成 Docker 容器映像
- 上傳容器映像至 Amazon ECR
- 建立 Amazon ECS Cluster 並使用 Fargate 部署容器
- 建立 ECS Task Definition 與 Service
- 透過 Application Load Balancer 存取應用
- 整合 Amazon S3 實現雲端物件儲存
- 整合 Amazon RDS（MySQL）實現資料庫存取

---

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
                    │   │  │  Port 80       │ │ Port 80      │ │      │
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

                               ┌───────────────────────┐
                               │    Amazon S3 Bucket    │
                               └───────────────────────┘

                               ┌───────────────────────┐
                               │    Amazon ECR          │
                               │   (容器映像儲存庫)      │
                               └───────────────────────┘
```

---

## Workshop 流程

| Lab | 時間 | 內容 |
|-----|------|------|
| 概念說明 | 15 mins | 容器、Docker、ECR、ECS、Fargate、EKS 概念 |
| Task 1 - 基礎環境建置 | 15-20 mins | 透過 CloudFormation Console 部署 VPC、ALB、ECS Cluster 等 |
| Task 2 - 容器化應用 | 15-20 mins | Clone 2048 遊戲、建立 Dockerfile、建置映像 |
| Task 3 - ECR 映像推送 | 10-15 mins | 推送映像至 Amazon ECR |
| Task 4 - 部署至 ECS | 20-25 mins | 建立 Task Definition、Service，透過 ALB 玩遊戲 |
| Task 5 - 應用升級 | 25-30 mins | 升級為 Node.js，S3 載入靜態檔 + RDS 排行榜 |
| Task 6 - 資源清除 | 10 mins | 刪除所有 AWS 資源避免產生費用 |

---

## 前置條件

| 項目 | 說明 |
|------|------|
| AWS 帳號 | 具備 AdministratorAccess 或同等權限 |
| 區域 | ``us-east-1`` (N. Virginia) |
| 預估費用 | 約 $2-5 USD（完成後請立即清除資源） |

:::alert{type="info"}
本工作坊會部署一台 Command Host EC2（已預裝 Docker、Git、AWS CLI），所有操作皆透過 Session Manager 在該主機上執行，無需在本機安裝任何工具。
:::

:::alert{type="warning"}
本工作坊會建立 RDS、ALB 等計費資源，完成後請務必執行 Task 6 清除所有資源，避免產生額外費用。
:::
