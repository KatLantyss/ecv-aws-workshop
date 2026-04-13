---
title: Task 1 - 基礎環境建置
order: 2
---

# Task 1 - 部署基礎環境與 ECS 叢集建置

::badge[實作]{type="info"} ::badge[約 15-20 分鐘]{type="default"}

使用 CloudFormation Console 一鍵部署本工作坊所需的所有基礎設施，包含 VPC、ECS Cluster、ALB、ECR、S3、RDS。

---

## 1.1 認識 CloudFormation 模板

本工作坊提供了一份 CloudFormation 模板 [::button[ecs-fargate-lab-infra.yaml]{variant="default" prefix="arrow-down-to-line"}](ecs-fargate-lab-infra.yaml)，它會建立以下資源：

| 資源類型 | 資源名稱 | 說明 |
|----------|----------|------|
| VPC | ecs-fargate-lab-vpc | CIDR: 10.0.0.0/16 |
| Public Subnet x2 | ecs-fargate-lab-public-1/2 | 跨 2 個 AZ，放置 ALB 與 Fargate Tasks |
| Private Subnet x2 | ecs-fargate-lab-private-1/2 | 跨 2 個 AZ，放置 RDS |
| Internet Gateway | ecs-fargate-lab-igw | 讓 Public Subnet 可存取 Internet |
| ALB | ecs-fargate-lab-alb | 負載平衡器，監聽 Port 80 |
| Target Group | ecs-fargate-lab-tg | 目標群組，Health Check Path: / |
| ECS Cluster | ecs-fargate-lab-cluster | Fargate Capacity Provider |
| ECR Repository | ecs-fargate-lab-app | 啟用 Image Scanning |
| S3 Bucket | (自動命名) | AES256 加密，封鎖公開存取 |
| RDS MySQL | ecs-fargate-lab-db | db.t3.micro，MySQL 8.0 |
| IAM Roles | execution-role / task-role / command-host-role | ECS 角色與 Command Host 角色 |
| Security Groups | ALB / ECS / RDS / Command Host | 分層安全群組 |
| Command Host | ecs-fargate-lab-command-host | t3.micro，預裝 Docker、Git，透過 Session Manager 連線 |

### 安全群組規則

```
Internet ──▶ ALB SG (Port 80) ──▶ ECS SG (Port 80) ──▶ RDS SG (Port 3306)
```

- **ALB Security Group**：允許來自 Internet 的 HTTP (80) 流量
- **ECS Security Group**：僅允許來自 ALB SG 的 Port 80 流量
- **RDS Security Group**：僅允許來自 ECS SG 的 Port 3306 流量

:::alert{type="info"}
這種分層安全群組設計確保每一層只接受來自上一層的流量，是 AWS 安全最佳實踐。
:::

### IAM Role 設計

模板建立了三組 IAM Role：

:::expand{title="Command Host Role"}
- 用途：Command Host EC2 使用，透過 Session Manager 連線並操作 AWS 服務
- 附加政策：`AmazonSSMManagedInstanceCore`、`AmazonEC2ContainerRegistryPowerUser`、`AmazonECS_FullAccess`、`AmazonS3FullAccess`
:::

:::expand{title="ECS Task Execution Role"}
- 用途：ECS Agent 使用，負責拉取 ECR 映像和寫入 CloudWatch Logs
- 附加政策：`AmazonECSTaskExecutionRolePolicy`（AWS 託管政策）
:::

:::expand{title="ECS Task Role"}
- 用途：容器內應用程式使用，存取 S3 等 AWS 服務
- 自訂政策：允許 `s3:GetObject`、`s3:PutObject`、`s3:ListBucket`
:::

---

## 1.2 透過 Console 部署 CloudFormation Stack

:::steps
1. 開啟 [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)，確認右上角區域為 `us-east-1`

2. 點擊 ::button[Create stack]{variant="default" postfix="aws-expand"} → 選擇 **With new resources (standard)**

3. 在 **Create stacks** 頁面：
   - 選擇 **Upload a template file**
   - 點擊 ::button[Choose file]{variant="default" prefix="arrow-up-to-line"} 上傳 `ecs-fargate-lab-infra.yaml`
   - 點擊 ::button[Next]{variant="action"}

4. 在 **Specify stack details** 頁面：
   - **Stack name**：輸入 ``ecs-fargate-lab``
   - **DBPassword**：輸入資料庫密碼（至少 8 個字元，例如 ``WorkshopPass123``）
   - 點擊 ::button[Next]{variant="action"}

5. 在 **Configure stack options** 頁面：
   - 捲到最下方，勾選 ::status[I acknowledge that AWS CloudFormation might create IAM resources with custom names.]{type="none" icon="square-check"}
   - 點擊 ::button[Next]{variant="action"}

6. 在 **Review** 頁面：
   - 點擊 ::button[Submit]{variant="action"}
:::

:::alert{type="warning"}
資料庫密碼請記住，後續 Task 5 整合 RDS 時會用到。正式環境應使用 AWS Secrets Manager 管理密碼。
:::

---

## 1.3 等待部署完成

部署約需 **5-10 分鐘**，主要等待 RDS 建立。

:::steps
1. 在 CloudFormation Console 中，點擊剛建立的 `ecs-fargate-lab` Stack
2. 切換到 **Events** 分頁，可以即時查看建立進度
3. 等待 Stack 狀態變為 ::status[CREATE_COMPLETE]{type="success" icon="aws-success"}
:::

:::alert{type="danger"}
如果狀態變為 ::status[CREATE_FAILED]{type="danger" icon="aws-error"} 或 ::status[ROLLBACK_COMPLETE]{type="danger" icon="aws-error"}，請切換到 **Events** 分頁查看失敗原因。
:::

:::expand{title="常見失敗原因"}
- 密碼不符合要求（至少 8 字元）
- 區域中已存在同名資源（如 ecs-fargate-lab-cluster）
- IAM 權限不足
- 如需重試，請先刪除失敗的 Stack 再重新建立
:::

---

## 1.4 記錄 Stack 輸出值

部署完成後，需要記錄後續 Lab 會用到的資源資訊。

:::steps
1. 在 CloudFormation Console 中，點擊 `ecs-fargate-lab` Stack
2. 切換到 **Outputs** 分頁
3. 記錄以下關鍵輸出值：
:::

| Output Key | 說明 | 用途 |
|------------|------|------|
| CommandHostSessionUrl | Session Manager 連線 URL | 連線至 Command Host |
| ECRRepositoryUri | ECR 映像儲存庫 URI | Task 3 推送映像 |
| ALBDnsName | ALB DNS 名稱 | Task 4 驗證應用 |
| S3BucketName | S3 Bucket 名稱 | Task 5 應用升級 |
| RDSEndpoint | RDS 連線端點 | Task 5 應用升級 |

:::alert{type="info"}
建議將這些值複製到一個文字檔中備用，後續 Lab 會頻繁使用。
:::

同時在 Command Host 終端機設定環境變數，方便後續操作：

:::steps
1. 在 CloudFormation Outputs 中，點擊 **CommandHostSessionUrl** 的連結，開啟 Session Manager 終端機
2. 在終端機中執行以下指令設定環境變數：
:::

```bash
export ECR_REPO=<貼上 ECRRepositoryUri>
export ALB_DNS=<貼上 ALBDnsName>
export S3_BUCKET=<貼上 S3BucketName>
export RDS_ENDPOINT=<貼上 RDSEndpoint>
export DB_PASSWORD=<先前設定的資料庫密碼>
```

---

## 1.5 驗證資源建立

### 確認 Command Host

:::steps
1. 在 CloudFormation Outputs 中，點擊 **CommandHostSessionUrl** 的連結
2. 預期開啟 Session Manager 終端機畫面
3. 執行以下指令確認工具已安裝：

```bash
docker --version && git --version && aws --version
```
:::

### 確認 ECS Cluster

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/)
2. 左側選單點擊 **Clusters**
3. 確認 `ecs-fargate-lab-cluster` 存在且狀態為 ::status[Active]{type="success" icon="aws-success"}
:::

### 確認 ALB

:::steps
1. 開啟 [EC2 Console](https://console.aws.amazon.com/ec2/) → 左側選單 **Load Balancers**
2. 確認 `ecs-fargate-lab-alb` 存在且狀態為 ::status[Active]{type="success" icon="aws-success"}
3. 複製 ALB 的 **DNS name**，在瀏覽器開啟 `http://<ALB_DNS>`
4. 預期看到 **503** 回應（因為尚未部署任何 Service）
:::

### 確認 RDS

:::steps
1. 開啟 [RDS Console](https://console.aws.amazon.com/rds/) → 左側選單 **Databases**
2. 確認 `ecs-fargate-lab-db` 存在且狀態為 ::status[Available]{type="success" icon="aws-success"}
3. 記下 **Endpoint** 值，後續 Task 5 會用到
:::

### 確認 S3

:::steps
1. 開啟 [S3 Console](https://console.aws.amazon.com/s3/)
2. 找到 workshop 建立的 Bucket（名稱由 CloudFormation 自動產生）
3. 確認 **Block all public access** 為 On
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Stack 狀態 | CloudFormation Console | ::status[CREATE_COMPLETE]{type="success" icon="aws-success"} |
| ECS Cluster | ECS Console | ::status[Active]{type="success" icon="aws-success"} |
| ALB | 瀏覽器開啟 ALB DNS | HTTP 503 |
| Outputs | CloudFormation Outputs 分頁 | 所有值已記錄 |

:::alert{type="success"}
基礎環境就緒，前往下一節建置容器映像。
:::
