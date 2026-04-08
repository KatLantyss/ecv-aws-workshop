---
title: 驗證資源建立
order: 3.2
---

# 驗證資源建立

部署完成後，逐一確認各項資源是否正確建立。

---

## 確認 ECS Cluster

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/)
2. 左側選單點擊 **Clusters**
3. 確認 ``ecs-workshop-cluster`` 存在且狀態為 ::status[Active]{type="success" icon="aws-success"}
4. 點擊進入，確認 Capacity Provider 包含 **FARGATE**
:::

---

## 確認 ALB

:::steps
1. 開啟 [EC2 Console](https://console.aws.amazon.com/ec2/) → 左側選單 **Load Balancers**
2. 確認 ``ecs-workshop-alb`` 存在且狀態為 ::status[Active]{type="success" icon="aws-success"}
3. 複製 ALB 的 **DNS name**，在瀏覽器開啟 `http://<ALB_DNS>`
4. 預期看到 **503** 回應（因為尚未部署任何 Service）
:::

---

## 確認 RDS

:::steps
1. 開啟 [RDS Console](https://console.aws.amazon.com/rds/) → 左側選單 **Databases**
2. 確認 ``ecs-workshop-db`` 存在且狀態為 ::status[Available]{type="success" icon="aws-success"}
3. 記下 **Endpoint** 值，後續 Lab 6 會用到
:::

---

## 確認 S3

:::steps
1. 開啟 [S3 Console](https://console.aws.amazon.com/s3/)
2. 找到 workshop 建立的 Bucket（名稱由 CloudFormation 自動產生）
3. 確認 **Block all public access** 為 On
:::

:::alert{type="success"}
所有資源確認完畢，回到上一頁繼續後續步驟。
:::
