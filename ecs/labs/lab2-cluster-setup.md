# Lab 2 - 部署基礎環境與 ECS 叢集建置

> ⏱ 預估時間：15-20 分鐘

---

## 本節目標

使用 CloudFormation 一鍵部署本工作坊所需的所有基礎設施，包含 VPC、ECS Cluster、ALB、ECR、S3、RDS。

---

## 2.1 認識 CloudFormation 模板

本工作坊提供了一份 CloudFormation 模板 `ecs-workshop-infra.yaml`，它會建立以下資源：

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

### 安全群組規則說明

```
Internet ──▶ ALB SG (Port 80) ──▶ ECS SG (Port 3000) ──▶ RDS SG (Port 3306)
```

- **ALB Security Group**：允許來自 Internet 的 HTTP (80) 流量
- **ECS Security Group**：僅允許來自 ALB SG 的 Port 3000 流量
- **RDS Security Group**：僅允許來自 ECS SG 的 Port 3306 流量

> 💡 這種分層安全群組設計確保每一層只接受來自上一層的流量，是 AWS 安全最佳實踐。

---

## 2.2 部署 CloudFormation Stack

### Step 1：設定資料庫密碼

```bash
# 設定 RDS 密碼（至少 8 個字元）
export DB_PASSWORD="YourSecurePassword123"
```

> ⚠️ 這是實驗環境的簡化做法。正式環境應使用 AWS Secrets Manager 管理密碼。

### Step 2：部署 Stack

```bash
aws cloudformation create-stack \
  --stack-name ecs-workshop \
  --template-body file://ecs-workshop-infra.yaml \
  --parameters ParameterKey=DBPassword,ParameterValue=$DB_PASSWORD \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

參數說明：
- `--capabilities CAPABILITY_NAMED_IAM`：因為模板會建立 IAM Role，需要明確授權
- `--template-body file://`：指定本地模板檔案

### Step 3：等待部署完成

```bash
aws cloudformation wait stack-create-complete \
  --stack-name ecs-workshop \
  --region us-east-1
```

> ⏳ 部署約需 5-10 分鐘，主要等待 RDS 建立。

### Step 4：確認部署狀態

```bash
aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].StackStatus' \
  --output text \
  --region us-east-1
```

預期輸出：`CREATE_COMPLETE`

---

## 2.3 取得 Stack 輸出值

部署完成後，取得後續 Lab 需要的資源資訊：

```bash
# 取得所有輸出值
aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs' \
  --output table \
  --region us-east-1
```

將關鍵值存為環境變數，後續 Lab 會用到：

```bash
# ECS Cluster
export ECS_CLUSTER=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`ECSClusterName`].OutputValue' \
  --output text --region us-east-1)

# ECR Repository URI
export ECR_REPO=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`ECRRepositoryUri`].OutputValue' \
  --output text --region us-east-1)

# ALB DNS Name
export ALB_DNS=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`ALBDnsName`].OutputValue' \
  --output text --region us-east-1)

# S3 Bucket Name
export S3_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
  --output text --region us-east-1)

# RDS Endpoint
export RDS_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`RDSEndpoint`].OutputValue' \
  --output text --region us-east-1)

# IAM Roles
export EXECUTION_ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`ECSTaskExecutionRoleArn`].OutputValue' \
  --output text --region us-east-1)

export TASK_ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`ECSTaskRoleArn`].OutputValue' \
  --output text --region us-east-1)

# Networking
export SUBNET_1=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`PublicSubnet1`].OutputValue' \
  --output text --region us-east-1)

export SUBNET_2=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`PublicSubnet2`].OutputValue' \
  --output text --region us-east-1)

export ECS_SG=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`ECSSecurityGroup`].OutputValue' \
  --output text --region us-east-1)

export TG_ARN=$(aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --query 'Stacks[0].Outputs[?OutputKey==`TargetGroupArn`].OutputValue' \
  --output text --region us-east-1)

# 驗證
echo "Cluster: $ECS_CLUSTER"
echo "ECR: $ECR_REPO"
echo "ALB: $ALB_DNS"
echo "S3: $S3_BUCKET"
echo "RDS: $RDS_ENDPOINT"
```

---

## 2.4 驗證資源建立

### 確認 ECS Cluster

```bash
aws ecs describe-clusters \
  --clusters $ECS_CLUSTER \
  --query 'clusters[0].{Name:clusterName,Status:status,CapacityProviders:capacityProviders}' \
  --region us-east-1
```

預期看到 Cluster 狀態為 `ACTIVE`，且 Capacity Provider 包含 `FARGATE`。

### 確認 ALB

```bash
curl -s -o /dev/null -w "%{http_code}" http://$ALB_DNS
```

預期輸出：`503`（因為尚未部署任何 Service，Target Group 沒有健康的目標）

---

## ❓ 常見問題

**Q: Stack 建立失敗怎麼辦？**

```bash
# 查看失敗事件
aws cloudformation describe-stack-events \
  --stack-name ecs-workshop \
  --query 'StackEvents[?ResourceStatus==`CREATE_FAILED`].[LogicalResourceId,ResourceStatusReason]' \
  --output table \
  --region us-east-1
```

常見原因：
- 密碼不符合要求（至少 8 字元）
- 區域中已存在同名資源
- IAM 權限不足

---

## ✅ 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Stack 狀態 | `describe-stacks` | CREATE_COMPLETE |
| ECS Cluster | `describe-clusters` | ACTIVE |
| ALB 回應 | `curl ALB_DNS` | HTTP 503 |
| 環境變數 | `echo $ECS_CLUSTER` | 非空值 |

前往 [Lab 3 - ECR 容器映像儲存](./lab3-ecr.md) ▶
