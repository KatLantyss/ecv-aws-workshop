---
title: Lab 1 - ECS 概念說明
order: 2
---

# Lab 1 - ECS 概念說明

::badge[概念]{type="info"} ::badge[約 15 分鐘]{type="default"}

在動手實作之前，先建立對 Amazon ECS 核心概念的理解，包含架構元件、運作模式，以及與其他容器服務的差異。

---

## 1.1 什麼是 Amazon ECS？

Amazon Elastic Container Service（ECS）是 AWS 提供的全託管容器編排服務，讓你可以輕鬆地在 AWS 上執行、停止和管理 Docker 容器。

你可以把 ECS 想像成一個「容器的調度中心」：
- 你告訴它「我要跑什麼容器、需要多少資源」
- ECS 負責「在哪裡跑、怎麼跑、掛了怎麼辦」

---

## 1.2 ECS 核心元件

ECS 的架構由四個核心元件組成，理解它們之間的關係是掌握 ECS 的關鍵：

```
┌─────────────────────────────────────────────────┐
│                  ECS Cluster                     │
│                                                  │
│   ┌──────────────────────────────────────────┐   │
│   │              Service                      │   │
│   │  desired_count = 2                        │   │
│   │                                           │   │
│   │   ┌─────────────┐   ┌─────────────┐      │   │
│   │   │   Task       │   │   Task       │      │   │
│   │   │ ┌─────────┐ │   │ ┌─────────┐ │      │   │
│   │   │ │Container│ │   │ │Container│ │      │   │
│   │   │ └─────────┘ │   │ └─────────┘ │      │   │
│   │   └─────────────┘   └─────────────┘      │   │
│   └──────────────────────────────────────────┘   │
│                                                  │
│   Task Definition (藍圖)                          │
│   - image: my-app:latest                         │
│   - cpu: 256, memory: 512                        │
│   - port: 3000                                   │
└─────────────────────────────────────────────────┘
```

### Cluster（叢集）

- ECS 資源的邏輯分組
- 一個 Cluster 可以包含多個 Service
- 可設定 Capacity Provider（Fargate 或 EC2）

### Task Definition（任務定義）

- 容器的藍圖 / 設計圖，類似 `docker-compose.yml`
- 定義內容包含：使用哪個 Docker Image、CPU / Memory 配置、Port Mapping、環境變數、IAM Role、Log 設定

### Task（任務）

- Task Definition 的執行實例
- 一個 Task 可包含一個或多個 Container
- 每個 Task 在 Fargate 模式下會取得獨立的 ENI（網路介面）

### Service（服務）

- 負責維持指定數量的 Task 持續運行
- 若 Task 異常終止，Service 會自動啟動新的 Task 替補
- 可整合 Load Balancer 進行流量分配
- 支援 Rolling Update 部署策略

---

## 1.3 Fargate vs EC2 啟動模式

ECS 提供兩種運算模式，本工作坊使用 **Fargate** 模式：

| 比較項目 | Fargate（Serverless） | EC2 |
|----------|----------------------|-----|
| 基礎設施管理 | 不需要 | 需自行管理 EC2 |
| 擴展方式 | 自動依 Task 數量擴展 | 需管理 Auto Scaling Group |
| 定價模式 | 按 Task 的 vCPU + Memory 計費 | 按 EC2 實例計費 |
| 適用場景 | 微服務、批次任務、快速原型 | 需要 GPU、特殊實例類型 |
| 啟動速度 | 較慢（需配置 ENI） | 較快（實例已就緒） |
| 安全性 | 每個 Task 獨立隔離 | 同一實例上的 Task 共享 OS |

:::alert{type="info"}
**為什麼選擇 Fargate？** 零基礎設施管理、精確計費（只為實際使用的 vCPU 和 Memory 付費）、安全隔離（每個 Task 運行在獨立的 micro-VM 中）。
:::

---

## 1.4 ECS vs EKS

| 比較項目 | ECS | EKS |
|----------|-----|-----|
| 編排引擎 | AWS 自有 | Kubernetes |
| 學習曲線 | 較低 | 較高 |
| 生態系統 | AWS 原生整合 | K8s 開源生態 |
| 可攜性 | AWS 專屬 | 跨雲可攜 |
| 適用場景 | AWS 原生應用、快速上手 | 已有 K8s 經驗、多雲策略 |
| 控制平面費用 | 免費 | ~$73 USD/月 |

:::alert{type="info"}
如果你的團隊沒有 Kubernetes 經驗，且應用主要在 AWS 上運行，ECS 是更簡單高效的選擇。
:::

---

## 1.5 本工作坊的部署流程

```
  ① 建立基礎環境          ② 建置容器映像          ③ 部署至 ECS
 ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 │ VPC / Subnet  │     │ Dockerfile   │     │ Task Def     │
 │ ALB           │ ──▶ │ docker build │ ──▶ │ Service      │
 │ ECS Cluster   │     │ ECR push     │     │ ALB 驗證     │
 │ S3 / RDS      │     │              │     │              │
 └──────────────┘     └──────────────┘     └──────────────┘
      Lab 2                Lab 3               Lab 4

  ④ 整合 S3              ⑤ 整合 RDS
 ┌──────────────┐     ┌──────────────┐
 │ 上傳/讀取檔案 │     │ MySQL 讀寫   │
 │ 更新 Task Def │ ──▶ │ 更新 Task Def │
 │ 重新部署      │     │ 重新部署      │
 └──────────────┘     └──────────────┘
      Lab 5                Lab 6
```

---

## 概念檢查

在繼續之前，確認你能回答以下問題：

:::expand{title="1. Task Definition 和 Task 的關係是什麼？"}
Task Definition 是藍圖，Task 是根據藍圖啟動的執行實例。
:::

:::expand{title="2. Service 的主要職責是什麼？"}
維持指定數量的 Task 持續運行，異常時自動替補。
:::

:::expand{title="3. Fargate 模式下，誰負責管理底層的伺服器？"}
AWS 負責，使用者不需要管理任何 EC2 實例。
:::

:::expand{title="4. ECS Cluster 是什麼？"}
ECS 資源的邏輯分組，用來組織和管理 Service 與 Task。
:::

:::alert{type="success"}
概念都清楚了，前往下一節開始建置基礎環境。
:::
