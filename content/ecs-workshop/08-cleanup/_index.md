---
title: Lab 7 - 資源清除
order: 8
---

# Lab 7 - 資源清除

::badge[清除]{type="danger"} ::badge[約 10 分鐘]{type="default"}

刪除本工作坊建立的所有 AWS 資源，避免產生額外費用。

:::alert{type="danger"}
請務必完成此 Lab，否則 RDS、ALB 等資源會持續計費。
:::

---

## 7.1 刪除 ECS Service

Service 必須先刪除，否則 CloudFormation 無法清除相關資源。

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → ``ecs-workshop-cluster``

2. 在 **Services** 分頁，勾選 ``ecs-workshop-service``

3. 點擊 ::button[Delete]{variant="primary"} （或 ::button[Update]{variant="primary"} 先將 Desired tasks 設為 0）

4. 在確認對話框中輸入 ``delete``，點擊 ::button[Delete]{variant="primary"}

5. 等待 Service 刪除完成（所有 Task 會自動停止）
:::

---

## 7.2 反註冊 Task Definition

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Task definitions** → ``ecs-workshop-app``

2. 勾選所有版本（revision）

3. 點擊 ::button[Actions]{variant="link" dropdown} → **Deregister**

4. 確認反註冊

5. 切換到 **Inactive** 分頁，勾選所有版本，點擊 ::button[Actions]{variant="link" dropdown} → **Delete**
:::

---

## 7.3 清理 ECR 映像

:::steps
1. 開啟 [ECR Console](https://console.aws.amazon.com/ecr/) → **Repositories** → ``ecs-workshop-app``

2. 勾選所有映像

3. 點擊 ::button[Delete]{variant="primary"}

4. 在確認對話框中輸入 ``delete``，點擊 ::button[Delete]{variant="primary"}
:::

---

## 7.4 清空 S3 Bucket

CloudFormation 無法刪除非空的 S3 Bucket，需先清空。

:::steps
1. 開啟 [S3 Console](https://console.aws.amazon.com/s3/)

2. 找到並點擊 workshop 的 S3 Bucket

3. 點擊 ::button[Empty]{variant="primary"}

4. 在確認欄位輸入 ``permanently delete``，點擊 ::button[Empty]{variant="primary"}
:::

---

## 7.5 刪除 CloudFormation Stack

:::steps
1. 開啟 [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)

2. 勾選 ``ecs-workshop`` Stack

3. 點擊 ::button[Delete]{variant="primary"}

4. 在確認對話框中點擊 ::button[Delete]{variant="primary"}

5. 等待 Stack 狀態變為 ::status[DELETE_COMPLETE]{type="success" icon="aws-success"}（約 5-10 分鐘，主要等待 RDS 刪除）
:::

:::alert{type="warning"}
如果刪除失敗，切換到 **Events** 分頁查看原因。最常見的原因是 S3 Bucket 未清空或 ECS Service 未刪除。
:::

---

## 7.6 清理本機檔案（選擇性）

```bash
# 清理本機 Docker 映像
docker rmi ecs-workshop-app:latest ecs-workshop-app:v1 ecs-workshop-app:v2 ecs-workshop-app:v3 2>/dev/null
docker rmi $ECR_REPO:v1 $ECR_REPO:v2 $ECR_REPO:v3 $ECR_REPO:latest 2>/dev/null

# 清理臨時檔案
rm -f task-definition.json task-definition-v2.json task-definition-v3.json
```

---

## 清除檢查清單

| 資源 | 驗證方式 | 預期結果 |
|------|----------|----------|
| ECS Service | ECS Console → Cluster | 不存在 |
| Task Definitions | ECS Console → Task definitions | 已刪除 |
| ECR 映像 | ECR Console | 空 |
| S3 Bucket | S3 Console | Bucket 不存在 |
| CloudFormation Stack | CloudFormation Console | DELETE_COMPLETE |
| RDS | RDS Console | 不存在 |
| VPC | VPC Console | ecs-workshop-vpc 不存在 |

---

## 恭喜完成 🎉

你已經完成了整個 ECS 容器化服務實戰工作坊。在這個過程中，你學會了：

- ECS 核心概念（Cluster、Task Definition、Service）
- 使用 Fargate Serverless 模式部署容器
- 透過 ECR 管理容器映像
- 透過 ALB 實現負載平衡
- 整合 S3 實現物件儲存
- 整合 RDS MySQL 實現資料庫存取
- 使用 CloudFormation 管理基礎設施

:::alert{type="info"}
**延伸學習**
- [Amazon ECS 開發者指南](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/)
- [AWS Fargate 定價](https://aws.amazon.com/fargate/pricing/)
- [ECR 使用者指南](https://docs.aws.amazon.com/AmazonECR/latest/userguide/)
- [ECS Workshop 官方](https://ecsworkshop.com/)
:::
