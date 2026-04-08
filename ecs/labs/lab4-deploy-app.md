# Lab 4 - 將應用部署至 ECS 環境

> ⏱ 預估時間：20-25 分鐘

---

## 本節目標

建立 ECS Task Definition，建立 ECS Service，並透過 ALB 驗證應用程式已成功運行。

---

## 4.1 註冊 Task Definition

Task Definition 是 ECS 的核心，它定義了容器要怎麼跑。

### Step 1：建立 Task Definition JSON

```bash
cat > task-definition.json << EOF
{
  "family": "ecs-workshop-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "$EXECUTION_ROLE_ARN",
  "taskRoleArn": "$TASK_ROLE_ARN",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "$ECR_REPO:v1",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ecs-workshop",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "app"
        }
      }
    }
  ]
}
EOF
```

**參數說明：**

| 參數 | 值 | 說明 |
|------|-----|------|
| family | ecs-workshop-app | Task Definition 的名稱，同一 family 可有多個版本 |
| networkMode | awsvpc | Fargate 必須使用 awsvpc，每個 Task 取得獨立 ENI |
| cpu | 256 | 0.25 vCPU |
| memory | 512 | 512 MB |
| executionRoleArn | - | ECS Agent 用來拉取映像、寫入 Log 的角色 |
| taskRoleArn | - | 容器內應用程式存取 AWS 服務的角色 |
| logConfiguration | awslogs | 將容器 Log 傳送至 CloudWatch Logs |

> 💡 **executionRole vs taskRole 的差別：**
> - `executionRole`：ECS 執行代理使用，用於拉取 ECR 映像、寫入 CloudWatch Logs
> - `taskRole`：容器內的應用程式使用，用於存取 S3、RDS 等 AWS 服務

### Step 2：註冊 Task Definition

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region us-east-1
```

### Step 3：驗證

```bash
aws ecs describe-task-definition \
  --task-definition ecs-workshop-app \
  --query 'taskDefinition.{Family:family,Revision:revision,Status:status,CPU:cpu,Memory:memory}' \
  --region us-east-1
```

---

## 4.2 建立 ECS Service

Service 會確保指定數量的 Task 持續運行，並與 ALB 整合。

```bash
aws ecs create-service \
  --cluster $ECS_CLUSTER \
  --service-name ecs-workshop-service \
  --task-definition ecs-workshop-app \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$ECS_SG],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$TG_ARN,containerName=app,containerPort=3000" \
  --region us-east-1
```

**參數說明：**

| 參數 | 說明 |
|------|------|
| desired-count: 2 | 維持 2 個 Task 運行，分布在不同 AZ |
| launch-type: FARGATE | 使用 Serverless 模式 |
| assignPublicIp: ENABLED | Fargate Task 需要公網 IP 來拉取 ECR 映像 |
| load-balancers | 將 Task 的 Port 3000 註冊到 ALB Target Group |

---

## 4.3 監控部署狀態

### 查看 Service 狀態

```bash
aws ecs describe-services \
  --cluster $ECS_CLUSTER \
  --services ecs-workshop-service \
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount,Pending:pendingCount}' \
  --region us-east-1
```

### 等待 Service 穩定

```bash
aws ecs wait services-stable \
  --cluster $ECS_CLUSTER \
  --services ecs-workshop-service \
  --region us-east-1
```

> ⏳ 約需 2-3 分鐘，等待 Task 啟動並通過 Health Check。

### 查看運行中的 Tasks

```bash
aws ecs list-tasks \
  --cluster $ECS_CLUSTER \
  --service-name ecs-workshop-service \
  --query 'taskArns' \
  --region us-east-1
```

---

## 4.4 透過 ALB 驗證應用

```bash
# Health Check
curl http://$ALB_DNS/health
# 預期輸出：{"status":"healthy","timestamp":"..."}

# 首頁
curl http://$ALB_DNS/
# 預期輸出：{"message":"ECS Workshop App",...}
```

你也可以在瀏覽器中開啟：

```bash
echo "http://$ALB_DNS"
```

---

## 4.5 查看容器 Log

```bash
aws logs tail /ecs/ecs-workshop \
  --since 10m \
  --format short \
  --region us-east-1
```

你應該能看到類似以下的 Log：

```
Server running on port 3000
```

---

## ❓ 常見問題

**Q: Task 啟動失敗，狀態一直是 PENDING？**

```bash
# 查看 Task 停止原因
aws ecs describe-tasks \
  --cluster $ECS_CLUSTER \
  --tasks $(aws ecs list-tasks --cluster $ECS_CLUSTER --service-name ecs-workshop-service --query 'taskArns[0]' --output text --region us-east-1) \
  --query 'tasks[0].{Status:lastStatus,Reason:stoppedReason,StopCode:stopCode}' \
  --region us-east-1
```

常見原因：
- ECR 映像拉取失敗：檢查 executionRole 權限
- Health Check 失敗：確認應用程式的 `/health` 端點正常
- 網路問題：確認 Security Group 設定正確

**Q: ALB 回傳 502 Bad Gateway？**

通常是因為 Target Group 中的 Task 尚未通過 Health Check，等待 1-2 分鐘後重試。

---

## ✅ 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Task Definition | `describe-task-definition` | revision: 1 |
| Service 狀態 | `describe-services` | runningCount: 2 |
| ALB Health Check | `curl ALB_DNS/health` | {"status":"healthy"} |
| 容器 Log | `aws logs tail` | Server running on port 3000 |

前往 [Lab 5 - 雲端物件儲存整合（S3）](./lab5-s3-integration.md) ▶
