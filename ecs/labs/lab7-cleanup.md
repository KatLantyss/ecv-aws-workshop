# Lab 7 - 資源清除

> ⏱ 預估時間：10 分鐘

---

## 本節目標

刪除本工作坊建立的所有 AWS 資源，避免產生額外費用。

> ⚠️ **重要**：請務必完成此 Lab，否則 RDS、ALB 等資源會持續計費。

---

## 7.1 刪除 ECS Service

Service 必須先刪除，否則 CloudFormation 無法清除相關資源。

```bash
# 將 desired count 設為 0，停止所有 Task
aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service ecs-workshop-service \
  --desired-count 0 \
  --region us-east-1

# 等待 Task 停止
sleep 30

# 刪除 Service
aws ecs delete-service \
  --cluster $ECS_CLUSTER \
  --service ecs-workshop-service \
  --force \
  --region us-east-1
```

---

## 7.2 刪除 Task Definition

```bash
# 列出所有版本
TASK_DEFS=$(aws ecs list-task-definitions \
  --family-prefix ecs-workshop-app \
  --query 'taskDefinitionArns' \
  --output text \
  --region us-east-1)

# 反註冊所有版本
for td in $TASK_DEFS; do
  aws ecs deregister-task-definition \
    --task-definition $td \
    --region us-east-1 > /dev/null
  echo "Deregistered: $td"
done

# 刪除所有版本
for td in $TASK_DEFS; do
  aws ecs delete-task-definitions \
    --task-definitions $td \
    --region us-east-1 > /dev/null
  echo "Deleted: $td"
done
```

---

## 7.3 清理 ECR 映像

```bash
# 刪除所有映像
IMAGES=$(aws ecr list-images \
  --repository-name ecs-workshop-app \
  --query 'imageIds[*]' \
  --output json \
  --region us-east-1)

if [ "$IMAGES" != "[]" ]; then
  aws ecr batch-delete-image \
    --repository-name ecs-workshop-app \
    --image-ids "$IMAGES" \
    --region us-east-1
  echo "ECR images deleted"
fi
```

---

## 7.4 清空 S3 Bucket

CloudFormation 無法刪除非空的 S3 Bucket，需先清空：

```bash
aws s3 rm s3://$S3_BUCKET --recursive
echo "S3 bucket emptied"
```

---

## 7.5 刪除 CloudFormation Stack

```bash
aws cloudformation delete-stack \
  --stack-name ecs-workshop \
  --region us-east-1

echo "等待 Stack 刪除中..."
aws cloudformation wait stack-delete-complete \
  --stack-name ecs-workshop \
  --region us-east-1

echo "Stack 已刪除完成"
```

> ⏳ 刪除約需 5-10 分鐘，主要等待 RDS 刪除。

---

## 7.6 驗證清除

```bash
# 確認 Stack 已刪除
aws cloudformation describe-stacks \
  --stack-name ecs-workshop \
  --region us-east-1 2>&1

# 預期輸出：An error occurred (ValidationError) ... Stack with id ecs-workshop does not exist
```

---

## 7.7 清理本機檔案（選擇性）

```bash
# 清理本機 Docker 映像
docker rmi ecs-workshop-app:latest ecs-workshop-app:v1 ecs-workshop-app:v2 ecs-workshop-app:v3 2>/dev/null
docker rmi $ECR_REPO:v1 $ECR_REPO:v2 $ECR_REPO:v3 $ECR_REPO:latest 2>/dev/null

# 清理臨時檔案
rm -f task-definition.json task-definition-v2.json task-definition-v3.json
```

---

## ✅ 清除檢查清單

| 資源 | 驗證方式 | 預期結果 |
|------|----------|----------|
| ECS Service | `describe-services` | 不存在 |
| Task Definitions | `list-task-definitions` | 空 |
| ECR 映像 | `list-images` | 空 |
| S3 Bucket | `s3 ls` | Bucket 不存在 |
| CloudFormation Stack | `describe-stacks` | Stack does not exist |
| RDS | RDS Console | 不存在 |
| VPC | VPC Console | ecs-workshop-vpc 不存在 |

---

## 🎉 恭喜完成！

你已經完成了整個 ECS 容器化服務實戰工作坊！在這個過程中，你學會了：

- ✅ ECS 核心概念（Cluster、Task Definition、Service）
- ✅ 使用 Fargate Serverless 模式部署容器
- ✅ 透過 ECR 管理容器映像
- ✅ 透過 ALB 實現負載平衡
- ✅ 整合 S3 實現物件儲存
- ✅ 整合 RDS MySQL 實現資料庫存取
- ✅ 使用 CloudFormation 管理基礎設施

返回 [README](../README.md)
