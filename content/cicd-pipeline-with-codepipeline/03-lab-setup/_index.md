---
title: Task 1 - 環境建置
order: 3
---

# Task 1 - 部署 Lab 環境

::badge[實作]{type="info"} ::badge[約 10 分鐘]{type="default"}

講師已預先部署共用基礎設施（VPC、ECS Cluster、ALB、ECR）。本步驟將部署個人 Lab 資源。

---

## 1.1 共用基礎設施

以下資源由講師事先建立，所有學員共用：

| 資源類型 | 資源名稱 | 說明 |
|----------|----------|------|
| VPC | cicd-pipeline-lab-vpc | 單一 Public Subnet |
| ECS Cluster | cicd-pipeline-lab-cluster | 共用 Fargate Cluster |
| ECR Repository | cicd-pipeline-lab-app | 共用映像儲存庫 |
| IAM Roles | execution-role / task-role | 共用 ECS 角色 |

---

## 1.2 個人 Lab 資源

此步驟會建立以下個人專屬資源：

| 資源類型 | 資源名稱 | 說明 |
|----------|----------|------|
| Command Host | cicd-pipeline-lab-{{USERNAME}}-command-host | t3.micro，預裝 Docker、Git |
| ALB | cicd-pipeline-lab-{{USERNAME}}-alb | 個人負載平衡器 |
| Target Group | cicd-pipeline-lab-{{USERNAME}}-tg | 個人 ALB 目標群組 |
| CodeBuild Project | cicd-pipeline-lab-{{USERNAME}}-build | 建置專案 |
| S3 Bucket | cicd-pipeline-lab-{{USERNAME}}-artifacts-* | Pipeline Artifact 儲存 |
| IAM Roles | CodeBuild Role、CodePipeline Role | CI/CD 所需角色 |

---

## 1.3 部署個人 Lab

:::steps
1. 開啟 [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)，確認右上角區域為 ``us-east-1``

2. 點擊 ::button[Create stack]{variant="default" postfix="aws-expand"} → 選擇 **With new resources (standard)**

3. 上傳 `cicd-pipeline-lab-user.yaml`，點擊 ::button[Next]{variant="action"}

4. 在 **Specify stack details** 頁面：
   - **Stack name**：輸入 ``cicd-pipeline-lab-{{USERNAME}}``
   - **UserPrefix**：輸入 ``{{USERNAME}}``
   - **LabName**：保持預設值 `cicd-pipeline-lab`
   - 點擊 ::button[Next]{variant="action"}

5. 勾選 ::status[I acknowledge that AWS CloudFormation might create IAM resources with custom names.]{type="none" icon="square-check"}，點擊 ::button[Next]{variant="action"}

6. 點擊 ::button[Submit]{variant="action"}
:::

---

## 1.4 等待部署完成

部署約需 **2-3 分鐘**。

:::steps
1. 等待 Stack 狀態變為 ::status[CREATE_COMPLETE]{type="success" icon="aws-success"}
2. 切換到 **Outputs** 分頁，記錄以下值：
:::

| Output Key | 說明 | 在哪裡用 |
|------------|------|----------|
| CommandHostSessionUrl | Session Manager 連線 URL | 點擊連結開啟 Command Host |
| ECRRepositoryUri | ECR 映像儲存庫 URI | Build + Push Image |
| ALBDnsName | 個人 ALB DNS 名稱 | 瀏覽器驗證應用 |
| ECSClusterName | ECS Cluster 名稱 | 建立 Service |
| ECSSecurityGroup | ECS 安全群組 ID | 建立 Service |
| PublicSubnet | Public Subnet ID | 建立 Service |

---

## 1.5 設定 Command Host 環境變數

:::steps
1. 點擊 **CommandHostSessionUrl** 開啟 Session Manager
2. 切換至 Bash 並設定環境變數：
:::

```bash
cd ~ && bash
export ECR_REPO=<貼上 ECRRepositoryUri>
export ALB_DNS=<貼上 ALBDnsName>
```

驗證工具已安裝：

```bash
docker --version && git --version && aws --version
```

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Stack 狀態 | CloudFormation Console | ::status[CREATE_COMPLETE]{type="success" icon="aws-success"} |
| Command Host | Session Manager | 可連線，Docker/Git 已安裝 |

:::alert{type="success"}
Lab 環境就緒，前往下一節準備應用程式。
:::
