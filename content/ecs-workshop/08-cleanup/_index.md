---
title: Task 7 - 資源清除
order: 9
---

# Task 7 - 資源清除

::badge[清除]{type="danger"} ::badge[約 10 分鐘]{type="default"}

刪除本工作坊建立的所有 AWS 資源，避免產生額外費用。

:::alert{type="danger"}
請務必完成此 Lab，否則 RDS、ALB 等資源會持續計費。
:::

---

## 8.1 刪除 ECS Service

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → ``ecs-workshop-cluster``
2. 在 **Services** 分頁，勾選 ``ecs-workshop-service``
3. 點擊 ::button[Delete]{variant="primary"}
4. 在確認對話框中輸入 ``delete``，點擊 ::button[Delete]{variant="primary"}
5. 等待 Service 刪除完成
:::

---

## 8.2 反註冊 Task Definition

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Task definitions** → ``ecs-workshop-app``
2. 勾選所有版本
3. 點擊 ::button[Actions]{variant="link" dropdown} → **Deregister**
4. 切換到 **Inactive** 分頁，勾選所有版本，點擊 ::button[Actions]{variant="link" dropdown} → **Delete**
:::

---

## 8.3 清理 ECR 映像

:::steps
1. 開啟 [ECR Console](https://console.aws.amazon.com/ecr/) → **Repositories** → ``ecs-workshop-app``
2. 勾選所有映像
3. 點擊 ::button[Delete]{variant="primary"}
4. 確認刪除
:::

---

## 8.4 清空 S3 Bucket

:::steps
1. 開啟 [S3 Console](https://console.aws.amazon.com/s3/)
2. 找到並點擊 workshop 的 S3 Bucket
3. 點擊 ::button[Empty]{variant="primary"}
4. 輸入 ``permanently delete``，點擊 ::button[Empty]{variant="primary"}
:::

---

## 8.5 刪除 CloudFormation Stack

:::steps
1. 開啟 [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
2. 勾選 ``ecs-workshop`` Stack
3. 點擊 ::button[Delete]{variant="primary"}
4. 確認刪除
5. 等待狀態變為 ::status[DELETE_COMPLETE]{type="success" icon="aws-success"}（約 5-10 分鐘）
:::

:::alert{type="warning"}
如果刪除失敗，切換到 **Events** 分頁查看原因。最常見的原因是 S3 Bucket 未清空或 ECS Service 未刪除。
:::

---

## 8.6 清理完成

CloudFormation Stack 刪除後，所有資源（包含 Command Host EC2）都會一併清除。

---

## 清除檢查清單

| 資源 | 驗證方式 | 預期結果 |
|------|----------|----------|
| ECS Service | ECS Console | 不存在 |
| Task Definitions | ECS Console | 已刪除 |
| ECR 映像 | ECR Console | 空 |
| S3 Bucket | S3 Console | 不存在 |
| CloudFormation Stack | CloudFormation Console | DELETE_COMPLETE |

---

## 恭喜完成 🎉

本工作坊已全部完成。透過實作，成功將 2048 遊戲部署至 AWS Fargate，並整合了 S3 物件儲存與 RDS 資料庫。

:::alert{type="info"}
**延伸學習**
- [Amazon ECS 開發者指南](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/)
- [AWS Fargate 定價](https://aws.amazon.com/fargate/pricing/)
- [ECR 使用者指南](https://docs.aws.amazon.com/AmazonECR/latest/userguide/)
- [ECS Workshop 官方](https://ecsworkshop.com/)
:::
