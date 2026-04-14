---
title: Task 6 - 資源清除
order: 7
---

# Task 6 - 資源清除

::badge[清除]{type="danger"} ::badge[約 10 分鐘]{type="default"}

刪除本工作坊建立的所有 AWS 資源，避免產生額外費用。

:::alert{type="warning"}
請務必完成此 Lab，否則 RDS、ALB 等資源會持續計費。
:::

---

## 6.1 刪除 ECS Service

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → `ecs-fargate-lab-cluster`
2. 在 **Services** 分頁，勾選 `ecs-fargate-lab-{{USERNAME}}-service`
3. 點擊 ::button[Delete service]{variant="default"}
4. 在確認對話框中輸入 ``delete``，點擊 ::button[Delete]{variant="action"}
5. 等待 Service 刪除完成（所有 Task 會自動停止）
:::

---

## 6.2 反註冊 Task Definition

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Task definitions** → `ecs-fargate-lab-{{USERNAME}}-app`
2. 勾選所有版本
3. 點擊 ::button[Actions]{variant="default" postfix="aws-expand"} → **Deregister**
:::

---

## 6.3 清空 S3 Bucket

CloudFormation 無法刪除非空的 S3 Bucket，需先清空。

:::steps
1. 開啟 [S3 Console](https://console.aws.amazon.com/s3/)
2. 找到並點擊 `ecs-fargate-lab-{{USERNAME}}-*` 的 S3 Bucket
3. 點擊 ::button[Empty]{variant="default"}
4. 輸入 ``permanently delete``，點擊 ::button[Empty]{variant="action"}
:::

---

## 6.4 刪除 CloudFormation Stack

:::steps
1. 開啟 [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
2. 勾選 `ecs-fargate-lab-{{USERNAME}}` Stack
3. 點擊 ::button[Delete stack]{variant="default"}
4. 輸入 ``ecs-fargate-lab-{{USERNAME}}`` ，點擊 ::button[Delete stack]{variant="action"}
5. 等待狀態 ::status[DELETE_IN_PROGRESS]{type="info" icon="aws-info"} ， 期間可以使用 ::button[]{variant="default" prefix="aws-refresh"} 來刷新狀態，直到資源消失，即刪除完成。
:::

:::alert{type="info"}
CloudFormation 會自動刪除 ECR Repository（含映像）、VPC、ALB、ECS Cluster、RDS、Command Host 等所有資源。
:::

:::expand{title="刪除失敗怎麼辦？"}
切換到 **Events** 分頁查看原因。常見原因：
- **S3 Bucket 未清空** — 回到 6.3 清空 Bucket 後重試
- **ECS Service 未刪除** — 回到 6.1 確認 Service 已刪除
- **ENI 仍在使用中** — 等待幾分鐘後重試，Fargate Task 的 ENI 需要時間釋放
:::

---

## 6.5 清理 CloudWatch Log Group（選擇性）

ECS 自動建立的 Log Group 不在 CloudFormation 管理範圍內，如需清理：

:::steps
1. 開啟 [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/) → **Log groups**
2. 找到以 `/ecs/ecs-fargate-lab-{{USERNAME}}-app` 開頭的 Log Group
3. 勾選後點擊 ::button[Actions]{variant="default" postfix="aws-expand"} → **Delete log group(s)**
:::

---

## 6.6 清理完成

CloudFormation Stack 刪除後，所有資源（包含 Command Host EC2）都會一併清除。

---

## 清除檢查清單

| 資源 | 驗證方式 | 預期結果 |
|------|----------|----------|
| ECS Service | ECS Console → Cluster | 不存在 |
| Task Definitions | ECS Console → Task definitions | 不存在 |
| CloudFormation Stack | CloudFormation Console | 不存在 |
| S3 Bucket | S3 Console | 不存在 |
| ECR Repository | ECR Console | 不存在 |
| RDS | RDS Console | 不存在 |
| VPC | VPC Console | ecs-fargate-lab-vpc 不存在 |

---

## 恭喜完成

本工作坊已全部完成。透過實作，成功將 2048 遊戲部署至 AWS Fargate，並整合了 S3 物件儲存與 RDS 資料庫。

:::alert{type="info"}
**延伸學習**
- [Amazon ECS 開發者指南](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/)
- [AWS Fargate 定價](https://aws.amazon.com/fargate/pricing/)
- [ECR 使用者指南](https://docs.aws.amazon.com/AmazonECR/latest/userguide/)
- [ECS Workshop 官方](https://ecsworkshop.com/)
:::
