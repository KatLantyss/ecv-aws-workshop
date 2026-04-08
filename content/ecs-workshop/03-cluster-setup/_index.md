---
title: Lab 2 - 基礎環境建置
order: 3
---

# Lab 2 - 部署基礎環境與 ECS 叢集建置

::badge[實作]{type="info"} ::badge[約 15-20 分鐘]{type="default"}

使用 CloudFormation Console 一鍵部署本工作坊所需的所有基礎設施，包含 VPC、ECS Cluster、ALB、ECR、S3、RDS。

---

## 2.1 認識 CloudFormation 模板

本工作坊提供了一份 CloudFormation 模板 ``ecs-workshop-infra.yaml``，它會建立以下資源：

| 資源類型 | 資源名稱 | 說明 |
|----------|----------|------|
| VPC | ecs-workshop-vpc | CIDR: 10.0.0.0/16 |
| Public Subnet x2 | ecs-workshop-public-1/2 | 跨 2 個 AZ，放置 ALB 與 Fargate Tasks |
| Private Subnet x2 | ecs-workshop-private-1/2 | 跨 2 個 AZ，放置 RDS |
| Internet Gateway | - | 讓 Public Subnet 可存取 Internet |
| ALB | ecs-workshop-alb | 負載平衡器，監聽 Port 80 |
| Target Group | ecs-workshop-tg | 目標群組，Health Check Path: /health |
| ECS Cluster | ecs-workshop-cluster | Fargate Capacity Provider |
| ECR Repository | ecs-workshop-app | 啟用 Image Scanning |
| S3 Bucket | (自動命名) | AES256 加密，封鎖公開存取 |
| RDS MySQL | ecs-workshop-db | db.t3.micro，MySQL 8.0 |
| IAM Roles | execution-role / task-role | ECS 執行角色與任務角色 |
| Security Groups | ALB / ECS / RDS | 分層安全群組 |
| CloudWatch Log Group | /ecs/ecs-workshop | 保留 7 天 |

### 安全群組規則

```
Internet ──▶ ALB SG (Port 80) ──▶ ECS SG (Port 3000) ──▶ RDS SG (Port 3306)
```

- **ALB Security Group**：允許來自 Internet 的 HTTP (80) 流量
- **ECS Security Group**：僅允許來自 ALB SG 的 Port 3000 流量
- **RDS Security Group**：僅允許來自 ECS SG 的 Port 3306 流量

:::alert{type="info"}
這種分層安全群組設計確保每一層只接受來自上一層的流量，是 AWS 安全最佳實踐。
:::

---

## 2.2 透過 Console 部署 CloudFormation Stack

:::steps
1. 開啟 [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)，確認右上角區域為 ``us-east-1``

2. 點擊 ::button[Create stack]{variant="primary"} → 選擇 **With new resources (standard)**

3. 在 **Specify template** 頁面：
   - 選擇 **Upload a template file**
   - 點擊 ::button[Choose file]{variant="normal"} 上傳 ``ecs-workshop-infra.yaml``
   - 點擊 ::button[Next]{variant="primary"}

4. 在 **Specify stack details** 頁面：
   - **Stack name**：輸入 ``ecs-workshop``
   - **DBPassword**：輸入資料庫密碼（至少 8 個字元，例如 ``WorkshopPass123``）
   - 點擊 ::button[Next]{variant="primary"}

5. 在 **Configure stack options** 頁面：
   - 保持預設設定
   - 點擊 ::button[Next]{variant="primary"}

6. 在 **Review** 頁面：
   - 捲到最下方，勾選 **I acknowledge that AWS CloudFormation might create IAM resources with custom names.**
   - 點擊 ::button[Submit]{variant="primary"}
:::

:::alert{type="warning"}
資料庫密碼請記住，後續 Lab 6 整合 RDS 時會用到。正式環境應使用 AWS Secrets Manager 管理密碼。
:::

---

## 2.3 等待部署完成

部署約需 **5-10 分鐘**，主要等待 RDS 建立。

:::steps
1. 在 CloudFormation Console 中，點擊剛建立的 ``ecs-workshop`` Stack
2. 切換到 **Events** 分頁，可以即時查看建立進度
3. 等待 Stack 狀態變為 ::status[CREATE_COMPLETE]{type="success" icon="aws-success"}
:::

:::alert{type="danger"}
如果狀態變為 ::status[CREATE_FAILED]{type="danger" icon="aws-error"} 或 ::status[ROLLBACK_COMPLETE]{type="danger" icon="aws-error"}，請切換到 **Events** 分頁查看失敗原因。
:::

:::expand{title="常見失敗原因"}
- 密碼不符合要求（至少 8 字元）
- 區域中已存在同名資源（如 ecs-workshop-cluster）
- IAM 權限不足
- 如需重試，請先刪除失敗的 Stack 再重新建立
:::

---

## 2.4 記錄 Stack 輸出值

部署完成後，需要記錄後續 Lab 會用到的資源資訊。

:::steps
1. 在 CloudFormation Console 中，點擊 ``ecs-workshop`` Stack
2. 切換到 **Outputs** 分頁
3. 記錄以下關鍵輸出值：
:::

| Output Key | 說明 | 用途 |
|------------|------|------|
| ECSClusterName | ECS 叢集名稱 | Lab 4 建立 Service |
| ECRRepositoryUri | ECR 映像儲存庫 URI | Lab 3 推送映像 |
| ALBDnsName | ALB DNS 名稱 | 驗證應用程式 |
| S3BucketName | S3 Bucket 名稱 | Lab 5 S3 整合 |
| RDSEndpoint | RDS 連線端點 | Lab 6 RDS 整合 |
| ECSTaskExecutionRoleArn | 執行角色 ARN | Lab 4 Task Definition |
| ECSTaskRoleArn | 任務角色 ARN | Lab 4 Task Definition |
| PublicSubnet1 / PublicSubnet2 | 公有子網路 ID | Lab 4 建立 Service |
| ECSSecurityGroup | ECS 安全群組 ID | Lab 4 建立 Service |
| TargetGroupArn | 目標群組 ARN | Lab 4 建立 Service |

:::alert{type="info"}
建議將這些值複製到一個文字檔中備用，後續 Lab 會頻繁使用。
:::

同時在終端機設定環境變數，方便後續本機操作（推送映像等）：

```bash
# 從 CloudFormation Outputs 取得值並設定環境變數
export ECR_REPO=<貼上 ECRRepositoryUri>
export ALB_DNS=<貼上 ALBDnsName>
export S3_BUCKET=<貼上 S3BucketName>
export RDS_ENDPOINT=<貼上 RDSEndpoint>
export EXECUTION_ROLE_ARN=<貼上 ECSTaskExecutionRoleArn>
export TASK_ROLE_ARN=<貼上 ECSTaskRoleArn>
export DB_PASSWORD=<你設定的資料庫密碼>
```

---

## 2.5 驗證資源建立

### 確認 ECS Cluster

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/)
2. 左側選單點擊 **Clusters**
3. 確認 ``ecs-workshop-cluster`` 存在且狀態為 ::status[Active]{type="success" icon="aws-success"}
:::

### 確認 ALB

:::steps
1. 開啟 [EC2 Console](https://console.aws.amazon.com/ec2/) → 左側選單 **Load Balancers**
2. 確認 ``ecs-workshop-alb`` 存在且狀態為 ::status[Active]{type="success" icon="aws-success"}
3. 複製 ALB 的 **DNS name**，在瀏覽器開啟 `http://<ALB_DNS>`
4. 預期看到 **503** 回應（因為尚未部署任何 Service）
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
