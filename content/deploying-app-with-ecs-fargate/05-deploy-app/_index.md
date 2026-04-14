---
title: Task 4 - 部署至 ECS
order: 5
---

# Task 4 - 將 2048 遊戲部署至 ECS Fargate

::badge[實作]{type="info"} ::badge[約 20-25 分鐘]{type="default"}

透過 ECS Console 建立 Task Definition 與 Service，將 2048 遊戲部署到 Fargate，並透過 ALB 存取。

---

## 4.1 建立 Task Definition

Task Definition 定義了容器要怎麼跑 — 用哪個映像、多少 CPU/Memory、開哪個 Port。

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → 左側選單點擊 **Task definitions**

2. 點擊 ::button[Create new task definition]{variant="action" postfix="aws-expand"} → 選擇 Create new task definition

3. 在 **Task definition configuration** 區塊：
   - **Task definition family**：輸入 ``ecs-fargate-lab-{{USERNAME}}-app``

4. 在 **Infrastructure requirements** 區塊：
   - **Launch type**：選擇 **AWS Fargate**
   - **Operating system/Architecture**：Linux/X86_64
   - **CPU**：`.25 vCPU`
   - **Memory**：`.5 GB`
   - **Task role**：選擇 `ecs-fargate-lab-task-role`
   - **Task execution role**：選擇 `ecs-fargate-lab-execution-role`

5. 在 **Container - 1** 區塊：
   - **Name**：輸入 ``web2048``
   - **Image URI**：貼上 ECR Repository URI + ``:nginx``（例如 ``123456789012.dkr.ecr.us-east-1.amazonaws.com/ecs-fargate-lab-app:nginx``）
   - **Container port**：``80``
   - **Protocol**：TCP

6. 展開 **Logging** 區塊：
   - 確認 **Log collection** 已啟用（使用 Amazon CloudWatch）
   - ECS 會自動建立 Log Group，保持預設設定即可

7. 點擊 ::button[Create]{variant="action"}
:::

:::expand{title="executionRole vs taskRole 的差別"}
- **Task execution role**：ECS Agent 使用，負責拉取 ECR 映像、寫入 CloudWatch Logs
- **Task role**：容器內的應用程式使用，存取 S3、RDS 等 AWS 服務（後續 Lab 會用到）
:::

---

## 4.2 建立 ECS Service

Service 會確保指定數量的 Task 持續運行，並與 ALB 整合分配流量。

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → 點擊 `ecs-fargate-lab-cluster`

2. 在 **Services** 分頁，點擊 ::button[Create]{variant="action" split="aws-expand"}

3. 在 **Service details** 區塊：
   - **Task definition family**：選擇 `ecs-fargate-lab-{{USERNAME}}-app`
   - **Task definition revision**：留空（自動使用最新版本）
   - **Service name**：輸入 ``ecs-fargate-lab-{{USERNAME}}-service``

4. 在 **Environment** 區塊（右上角應顯示 AWS Fargate）：
   - **Existing cluster**：已預選 `ecs-fargate-lab-cluster`

5. 在 **Deployment configuration** 區塊：
   - **Desired tasks**：``2``

6. 在 **Networking** 區塊：
   - **VPC**：選擇 `ecs-fargate-lab-vpc`
   - **Subnets**：選擇 `ecs-fargate-lab-public-1` 和 `ecs-fargate-lab-public-2`
   - **Security group**：選擇 **Use an existing security group** → 選擇 ECS Security Group（描述為 "ECS Tasks Security Group"）
   - **Public IP**：勾選 **Turned on**

7. 在 **Load balancing** 區塊：
   - ::status[**Use load balancing**]{type="none" icon="square-check"}
   - **Load balancer type**：選擇 **Application Load Balancer**
   - **Use an existing load balancer**：選擇 `ecs-fargate-lab-alb`
   - **Use an existing listener**：選擇 `80:HTTP`
   - **Use an existing target group**：選擇 `ecs-fargate-lab-{{USERNAME}}-tg`

8. 點擊 ::button[Create]{variant="action"}

9. 等待 Deploy 完成並在上方出現：

:::

:::banner{type="success"}
ecs-fargate-lab-{{USERNAME}}-service has been deployed successfully.
:::

:::alert{type="info"}
Fargate Task 需要 Public IP 才能拉取 ECR 映像（除非已設定 VPC Endpoint 或 NAT Gateway）。設定 2 個 Desired tasks 會分布在不同 AZ，提供高可用性。
:::

---

## 4.3 監控部署狀態

:::steps
1. 建立 Service 後會自動導行到進入到 Service 詳情頁
2. 切換到 **Deployments** 分頁，觀察部署進度
3. 切換到 **Tasks** 分頁，等待 2 個 Task 的狀態變為 ::status[Running]{type="success" icon="aws-success"}
:::

:::alert{type="warning"}
部署約需 2-3 分鐘，等待 Task 啟動並通過 Health Check。如果 Task 反覆 Stopped，點擊 Task ID 查看 **Stopped reason**。
:::

:::expand{title="常見問題排查"}
**Task 啟動失敗？**
- 點擊 Task ID → 查看 Stopped reason
- 常見原因：ECR 映像拉取失敗（檢查 executionRole）、Health Check 失敗、Security Group 設定錯誤

**ALB 回傳 502 Bad Gateway？**
- Target Group 中的 Task 尚未通過 Health Check，等待 1-2 分鐘後重試

**ALB 回傳 503？**
- 確認 Service 的 Running tasks 數量大於 0
:::

---

## 4.4 透過 ALB 玩 2048 遊戲

:::steps
1. 開啟 [EC2 Console](https://console.aws.amazon.com/ec2/) → **Load Balancers**
2. 點擊 `ecs-fargate-lab-alb`，複製 **DNS name**
3. 在瀏覽器開啟 `http://<ALB_DNS>`
4. 預期看到 2048 遊戲畫面，可用方向鍵試玩
:::

:::alert{type="success"}
2048 遊戲已成功部署至 AWS Fargate，透過 ALB 提供服務。兩個 Task 分布在不同 AZ，即使一個 AZ 故障，遊戲仍可正常運行。
:::

---

## 4.5 查看容器 Log

:::steps
1. 開啟 [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/) → 左側選單 **Log groups**
2. 找到以 `/ecs/ecs-fargate-lab-{{USERNAME}}-app` 開頭的 Log Group（ECS 自動建立）
3. 點擊最新的 Log stream
4. 預期看到 Nginx 的存取日誌
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Task Definition | ECS Console → Task definitions | ecs-fargate-lab-{{USERNAME}}-app:1 |
| Service 狀態 | ECS Console → Cluster → Services | Running tasks: 2 |
| 2048 遊戲 | 瀏覽器開啟 ALB DNS | 看到 2048 遊戲畫面 |
| 容器 Log | CloudWatch Logs | 看到 Nginx 存取日誌 |

:::alert{type="success"}
2048 遊戲已成功部署，前往下一節為應用加上 S3 儲存功能。
:::
