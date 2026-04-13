---
title: Task 1 - 基礎環境建置
order: 2
---

# Task 1 - 部署個人 Lab 環境

::badge[實作]{type="info"} ::badge[約 10 分鐘]{type="default"}

講師已預先部署共用基礎設施（VPC、ECS Cluster、ALB、ECR、RDS）。本步驟將部署個人 Lab 資源，包含 Command Host、S3 Bucket 和 ALB 路由規則。

---

## 1.1 共用基礎設施

以下資源由講師事先建立，所有學員共用：

| 資源類型 | 資源名稱 | 說明 |
|----------|----------|------|
| VPC | ecs-fargate-lab-vpc | CIDR: 10.0.0.0/16 |
| Public Subnet x2 | ecs-fargate-lab-public-1/2 | 跨 2 個 AZ |
| Private Subnet x2 | ecs-fargate-lab-private-1/2 | 跨 2 個 AZ，放置 RDS |
| ALB | ecs-fargate-lab-alb | 共用負載平衡器 |
| ECS Cluster | ecs-fargate-lab-cluster | 共用 Fargate Cluster |
| ECR Repository | ecs-fargate-lab-app | 共用映像儲存庫 |
| RDS MySQL | ecs-fargate-lab-db | 共用資料庫 |
| IAM Roles | execution-role / task-role | 共用 ECS 角色 |

:::alert{type="info"}
以上資源無需手動建立，已由講師部署就緒。個人 Lab 資源會引用這些共用基礎設施。
:::

---

## 1.2 個人 Lab 資源

下載個人 Lab CloudFormation 模板：

[::button[ecs-fargate-lab-user.yaml]{variant="default" prefix="arrow-down-to-line"}](ecs-fargate-lab-user.yaml)

此模板會建立以下個人專屬資源：

| 資源類型 | 資源名稱 | 說明 |
|----------|----------|------|
| Command Host | ecs-fargate-lab-{{prefix}}-command-host | t3.micro，預裝 Docker、Git |
| S3 Bucket | ecs-fargate-lab-{{prefix}}-* | 個人 S3 儲存桶 |
| Target Group | ecs-fargate-lab-{{prefix}}-tg | 個人 ALB 目標群組 |
| Listener Rule | — | 將流量路由到個人 Target Group |
| Security Group | ecs-fargate-lab-{{prefix}}-command-host-sg | Command Host 安全群組 |
| IAM Role | ecs-fargate-lab-{{prefix}}-command-host-role | Command Host 角色 |

---

## 1.3 透過 Console 部署個人 Lab

:::steps
1. 開啟 [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)，確認右上角區域為 ``us-east-1``

2. 點擊 ::button[Create stack]{variant="default" postfix="aws-expand"} → 選擇 **With new resources (standard)**

3. 在 **Create stacks** 頁面：
   - 選擇 **Upload a template file**
   - 點擊 ::button[Choose file]{variant="default" prefix="arrow-up-to-line"} 上傳 `ecs-fargate-lab-user.yaml`
   - 點擊 ::button[Next]{variant="action"}

4. 在 **Specify stack details** 頁面：
   - **Stack name**：輸入 ``ecs-fargate-lab-{{prefix}}``
   - **UserPrefix**：輸入 ``{{prefix}}``
   - **LabName**：保持預設值 `ecs-fargate-lab`
   - **ListenerRulePriority**：輸入講師分配的數字（例如座位號碼）
   - 點擊 ::button[Next]{variant="action"}

5. 在 **Configure stack options** 頁面：
   - 捲到最下方，勾選 ::status[I acknowledge that AWS CloudFormation might create IAM resources with custom names.]{type="none" icon="square-check"}
   - 點擊 ::button[Next]{variant="action"}

6. 在 **Review** 頁面：
   - 點擊 ::button[Submit]{variant="action"}
:::

:::alert{type="warning"}
**UserPrefix** 務必填入個人 username ``{{prefix}}``，**ListenerRulePriority** 務必填入講師分配的數字，避免與其他學員衝突。
:::

---

## 1.4 等待部署完成

部署約需 **2-3 分鐘**。

:::steps
1. 在 CloudFormation Console 中，點擊剛建立的 `ecs-fargate-lab-{{prefix}}` Stack
2. 切換到 **Events** 分頁，查看建立進度
3. 等待 Stack 狀態變為 ::status[CREATE_COMPLETE]{type="success" icon="aws-success"}
:::

:::expand{title="常見失敗原因"}
- UserPrefix 包含大寫字母或特殊字元（只允許小寫英數和 `-`）
- ListenerRulePriority 與其他學員重複
- 區域中已存在同名資源（其他學員用了相同的 prefix）
- 講師的基礎設施 Stack 尚未部署完成
- 如需重試，請先刪除失敗的 Stack 再重新建立
:::

---

## 1.5 記錄 Stack 輸出值

:::steps
1. 在 CloudFormation Console 中，點擊 `ecs-fargate-lab-{{prefix}}` Stack
2. 切換到 **Outputs** 分頁
3. 記錄以下關鍵輸出值：
:::

| Output Key | 說明 | 用途 |
|------------|------|------|
| CommandHostSessionUrl | Session Manager 連線 URL | 連線至個人 Command Host |
| ECRRepositoryUri | ECR 映像儲存庫 URI | Task 3 推送映像 |
| ALBDnsName | ALB DNS 名稱 | Task 4 驗證應用 |
| S3BucketName | 個人 S3 Bucket 名稱 | Task 5 應用升級 |
| RDSEndpoint | RDS 連線端點 | Task 5 應用升級 |
| ECSSecurityGroup | ECS 安全群組 ID | Task 4 建立 Service |
| TargetGroupArn | 個人 Target Group ARN | Task 4 建立 Service |

:::alert{type="info"}
建議將這些值複製到一個文字檔中備用，後續 Lab 會頻繁使用。
:::

在 Command Host 終端機設定環境變數：

:::steps
1. 在 Outputs 中，點擊 **CommandHostSessionUrl** 的連結，開啟 Session Manager 終端機
2. 執行以下指令設定環境變數：
:::

```bash
export ECR_REPO=<貼上 ECRRepositoryUri>
export ALB_DNS=<貼上 ALBDnsName>
export S3_BUCKET=<貼上 S3BucketName>
export RDS_ENDPOINT=<貼上 RDSEndpoint>
```

---

## 1.6 驗證資源建立

### 確認 Command Host

:::steps
1. 在 Outputs 中，點擊 **CommandHostSessionUrl** 的連結
2. 預期開啟 Session Manager 終端機畫面
3. 執行以下指令確認工具已安裝：

```bash
docker --version && git --version && aws --version
```
:::

### 確認 ECS Cluster（共用）

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters**
2. 確認 `ecs-fargate-lab-cluster` 存在且狀態為 ::status[Active]{type="success" icon="aws-success"}
:::

### 確認 ALB（共用）

:::steps
1. 開啟 [EC2 Console](https://console.aws.amazon.com/ec2/) → **Load Balancers**
2. 確認 `ecs-fargate-lab-alb` 存在且狀態為 ::status[Active]{type="success" icon="aws-success"}
3. 在瀏覽器開啟 `http://<ALB_DNS>`
4. 預期看到 **404** 回應（尚未部署任何 Service）
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| 個人 Stack 狀態 | CloudFormation Console | ::status[CREATE_COMPLETE]{type="success" icon="aws-success"} |
| Command Host | Session Manager | 可連線，Docker/Git 已安裝 |
| ECS Cluster | ECS Console | ::status[Active]{type="success" icon="aws-success"} |
| ALB | 瀏覽器 | HTTP 404 |
| Outputs | CloudFormation Outputs | 所有值已記錄 |

:::alert{type="success"}
個人 Lab 環境就緒，前往下一節建置容器映像。
:::
