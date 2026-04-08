---
title: Lab 4 - 部署應用至 ECS
order: 5
---

# Lab 4 - 將應用部署至 ECS 環境

::badge[實作]{type="info"} ::badge[約 20-25 分鐘]{type="default"}

透過 ECS Console 建立 Task Definition 與 Service，並透過 ALB 驗證應用程式已成功運行。

---

## 4.1 建立 Task Definition

Task Definition 是 ECS 的核心，它定義了容器要怎麼跑。

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → 左側選單點擊 **Task definitions**

2. 點擊 ::button[Create new task definition]{variant="primary"}

3. 在 **Task definition configuration** 區塊：
   - **Task definition family**：輸入 ``ecs-workshop-app``

4. 在 **Infrastructure requirements** 區塊：
   - **Launch type**：選擇 **AWS Fargate**
   - **Operating system/Architecture**：Linux/X86_64
   - **CPU**：``.25 vCPU``
   - **Memory**：``.5 GB``
   - **Task role**：選擇 ``ecs-workshop-task-role``
   - **Task execution role**：選擇 ``ecs-workshop-execution-role``

5. 在 **Container - 1** 區塊：
   - **Name**：輸入 ``app``
   - **Image URI**：貼上 ECR Repository URI + ``:v1``（例如 ``123456789012.dkr.ecr.us-east-1.amazonaws.com/ecs-workshop-app:v1``）
   - **Container port**：``3000``
   - **Protocol**：TCP

6. 展開 **Container - 1** 的 **Logging** 區塊：
   - 確認 **Log collection** 已啟用
   - **awslogs-group**：``/ecs/ecs-workshop``
   - **awslogs-region**：``us-east-1``
   - **awslogs-stream-prefix**：``app``

7. 點擊 ::button[Create]{variant="primary"}
:::

:::expand{title="executionRole vs taskRole 的差別"}
- **executionRole**（Task execution role）：ECS 執行代理使用，用於拉取 ECR 映像、寫入 CloudWatch Logs
- **taskRole**（Task role）：容器內的應用程式使用，用於存取 S3、RDS 等 AWS 服務
:::

---

## 4.2 建立 ECS Service

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → 點擊 ``ecs-workshop-cluster``

2. 在 **Services** 分頁，點擊 ::button[Create]{variant="primary"}

3. 在 **Environment** 區塊：
   - **Compute options**：選擇 **Launch type**
   - **Launch type**：FARGATE

4. 在 **Deployment configuration** 區塊：
   - **Application type**：Service
   - **Task definition** → **Family**：選擇 ``ecs-workshop-app``
   - **Revision**：選擇 LATEST
   - **Service name**：輸入 ``ecs-workshop-service``
   - **Desired tasks**：``2``

5. 在 **Networking** 區塊：
   - **VPC**：選擇 ``ecs-workshop-vpc``
   - **Subnets**：選擇 ``ecs-workshop-public-1`` 和 ``ecs-workshop-public-2``
   - **Security group**：選擇 **Use an existing security group** → 選擇 ECS Security Group（描述為 "ECS Tasks Security Group"）
   - **Public IP**：勾選 **Turned on**

6. 在 **Load balancing** 區塊：
   - **Load balancer type**：選擇 **Application Load Balancer**
   - **Use an existing load balancer**：選擇 ``ecs-workshop-alb``
   - **Use an existing listener**：選擇 ``80:HTTP``
   - **Use an existing target group**：選擇 ``ecs-workshop-tg``

7. 點擊 ::button[Create]{variant="primary"}
:::

:::alert{type="info"}
Fargate Task 需要 Public IP 才能拉取 ECR 映像（除非你設定了 VPC Endpoint 或 NAT Gateway）。
:::

---

## 4.3 監控部署狀態

:::steps
1. 建立 Service 後會自動跳轉到 Service 詳情頁
2. 切換到 **Deployments** 分頁，觀察部署進度
3. 切換到 **Tasks** 分頁，確認 2 個 Task 的狀態逐漸變為 ::status[Running]{type="success" icon="aws-success"}
:::

:::alert{type="warning"}
部署約需 2-3 分鐘，等待 Task 啟動並通過 Health Check。如果 Task 狀態一直是 **Pending** 或反覆 **Stopped**，請查看 Task 的 **Stopped reason**。
:::

:::expand{title="常見問題排查"}
**Task 啟動失敗？**
- 點擊 Task ID → 查看 **Stopped reason**
- 常見原因：ECR 映像拉取失敗（檢查 executionRole 權限）、Health Check 失敗（確認 `/health` 端點正常）、Security Group 設定錯誤

**ALB 回傳 502 Bad Gateway？**
- 通常是因為 Target Group 中的 Task 尚未通過 Health Check
- 等待 1-2 分鐘後重試
:::

---

## 4.4 透過 ALB 驗證應用

:::steps
1. 開啟 [EC2 Console](https://console.aws.amazon.com/ec2/) → **Load Balancers**
2. 點擊 ``ecs-workshop-alb``，複製 **DNS name**
3. 在瀏覽器開啟 ``http://<ALB_DNS>/health``
4. 預期看到：`{"status":"healthy","timestamp":"..."}`
5. 開啟 ``http://<ALB_DNS>/``
6. 預期看到：`{"message":"ECS Workshop App","version":"1.0.0",...}`
:::

也可以用終端機驗證：

```bash
curl http://$ALB_DNS/health
curl http://$ALB_DNS/
```

---

## 4.5 查看容器 Log

:::steps
1. 開啟 [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/) → 左側選單 **Log groups**
2. 點擊 ``/ecs/ecs-workshop``
3. 點擊最新的 Log stream
4. 應該能看到 ``Server running on port 3000``
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Task Definition | ECS Console → Task definitions | ecs-workshop-app:1 |
| Service 狀態 | ECS Console → Cluster → Services | Running tasks: 2 |
| ALB Health Check | 瀏覽器開啟 ALB_DNS/health | `{"status":"healthy"}` |
| 容器 Log | CloudWatch Logs | Server running on port 3000 |

:::alert{type="success"}
應用已成功部署到 ECS，前往下一節整合 S3 儲存功能。
:::
