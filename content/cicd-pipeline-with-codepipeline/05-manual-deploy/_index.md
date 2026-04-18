---
title: Task 3 - 手動部署
order: 5
---

# Task 3 - 手動部署至 ECS

::badge[實作]{type="info"} ::badge[約 25 分鐘]{type="default"}

在自動化之前，先手動走一遍完整的部署流程。體驗這個「痛」，才能理解 CI/CD 的價值。

---

## 3.1 Build Docker Image

在 Command Host 終端機中：

```bash
cd ~/2048
sudo docker build -t web2048 .
```

確認映像已建立：

```bash
sudo docker images
```

---

## 3.2 Push Image 至 ECR

:::steps
1. 登入 ECR

```bash
aws ecr get-login-password --region us-east-1 | \
  sudo docker login --username AWS --password-stdin $ECR_REPO
```

2. 標記並推送映像

```bash
sudo docker tag web2048:latest $ECR_REPO:{{USERNAME}}-latest
sudo docker push $ECR_REPO:{{USERNAME}}-latest
```
:::

在 [ECR Console](https://console.aws.amazon.com/ecr/) 確認 `cicd-pipeline-lab-app` 有 `latest` 映像。

---

## 3.3 建立 Task Definition

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Task definitions** → ::button[Create new task definition]{variant="action"}

2. **Task definition family**：輸入 ``cicd-pipeline-lab-{{USERNAME}}-app``

3. **Infrastructure requirements**：
   - **Launch type**：AWS Fargate
   - **CPU**：`.25 vCPU`、**Memory**：`.5 GB`
   - **Task role**：`cicd-pipeline-lab-task-role`
   - **Task execution role**：`cicd-pipeline-lab-execution-role`

4. **Container - 1**：
   - **Name**：輸入 ``web``
   - **Image URI**：貼上 ECR URI + ``:{{USERNAME}}-latest``
   - **Container port**：``80``

5. 點擊 ::button[Create]{variant="action"}
:::

:::alert{type="warning"}
Container Name 必須是 ``web``，這要跟 `buildspec.yml` 中 `imagedefinitions.json` 的 `name` 欄位一致。
:::

---

## 3.4 建立 ECS Service

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → `cicd-pipeline-lab-cluster`

2. 在 **Services** 分頁，點擊 ::button[Create]{variant="action"}

3. **Service details**：
   - **Task definition family**：選擇 `cicd-pipeline-lab-{{USERNAME}}-app`
   - **Service name**：輸入 ``cicd-pipeline-lab-{{USERNAME}}-service``

4. **Deployment configuration**
   - **Desired tasks**：``1``

5. **Networking**：
   - **VPC**：選擇 `cicd-pipeline-lab-vpc`
   - **Subnets**：選擇 Public Subnet
   - **Security group**：選擇 ECS Security Group
   - **Public IP**：Turned on

6. **Load balancing**：
   - 選擇 **Application Load Balancer**
   - **Use an existing load balancer**：`cicd-pipeline-lab-{{USERNAME}}-alb`
   - **Use an existing listener**：`80:HTTP`
   - **Use an existing target group**：`cicd-pipeline-lab-{{USERNAME}}-tg`

7. 點擊 ::button[Create]{variant="action"}
:::

---

## 3.5 驗證部署

:::steps
1. 等待 Service 的 Task 狀態變為 ::status[Running]{type="success" icon="aws-success"}（約 2-3 分鐘）
2. 在瀏覽器開啟 `http://<ALB_DNS>`
3. 預期看到 2048 遊戲畫面
:::

---

## 3.6 回顧手動流程

剛才你手動完成了以下步驟：

:::steps
1. `docker build` — 建置映像
2. `docker tag` + `docker push` — 推送至 ECR
3. Console 建立 Task Definition — 定義容器規格
4. Console 建立 Service — 部署至 ECS
:::

:::alert{type="warning"}
每次程式碼更新，都要重複步驟 1-2，然後手動更新 Service。想像一天部署 10 次的場景 — 這就是為什麼需要 CI/CD。
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| ECR Image | ECR Console | 看到 latest 標籤 |
| ECS Service | ECS Console | Running tasks: 1 |
| 2048 遊戲 | 瀏覽器開啟個人 ALB DNS | 看到遊戲畫面 |

:::alert{type="success"}
手動部署完成。接下來，讓我們把這些步驟全部自動化。
:::
