---
title: Task 4 - CodeBuild
order: 6
---

# Task 4 - 建立 CodeBuild Project

::badge[實作]{type="info"} ::badge[約 20 分鐘]{type="default"}

將 Task 3 的手動 build + push 流程交給 CodeBuild 自動執行。

---

## 4.1 建立 Build Project

:::steps
1. 開啟 [CodeBuild Console](https://console.aws.amazon.com/codesuite/codebuild/) → 點擊 ::button[Create build project]{variant="action"}

2. **Project configuration**：
   - **Project name**：輸入 ``cicd-pipeline-lab-{{USERNAME}}-build``

3. **Source**：
   - **Source provider**：選擇 **GitHub**
   - 點擊 **Connect using OAuth** → 授權 AWS 存取你的 GitHub
   - **Repository**：選擇你 Fork 的 2048 Repository
   - **Source version**：留空（使用預設分支）

4. **Environment**：
   - **Environment image**：Managed image
   - **Compute**：EC2
   - **Operating system**：Amazon Linux
   - **Runtime**：Standard
   - **Image**：選擇最新版本（`aws/codebuild/amazonlinux2-x86_64-standard:5.0`）
   - **Privileged**：勾選 ::status[Enable this flag if you want to build Docker images]{type="none" icon="square-check"}
   - **Service role**：選擇 **Existing service role** → `cicd-pipeline-lab-{{USERNAME}}-codebuild-role`

5. **Buildspec**：
   - 選擇 **Use a buildspec file**
   - **Buildspec name**：留空（預設使用 `buildspec.yml`）

6. **Artifacts**：
   - **Type**：No artifacts（Pipeline 模式下由 Pipeline 管理 artifacts）

7. 點擊 ::button[Create build project]{variant="action"}
:::

:::alert{type="warning"}
**Privileged** 必須勾選，否則 CodeBuild 無法執行 `docker build` 指令。
:::

---

## 4.2 設定環境變數

Build Project 建立後，需要加入 ECR Repository URI 的環境變數：

:::steps
1. 在 Build Project 頁面，點擊 ::button[Edit]{variant="default"} → **Environment**

2. 展開 **Additional configuration**

3. 在 **Environment variables** 區塊新增：

| Name | Value | Type |
|------|-------|------|
| ``ECR_REPO`` | 貼上 CloudFormation Outputs 的 ECRRepositoryUri | Plaintext |
| ``AWS_DEFAULT_REGION`` | ``us-east-1`` | Plaintext |

4. 點擊 ::button[Update environment]{variant="action"}
:::

---

## 4.3 手動執行 Build

:::steps
1. 在 Build Project 頁面，點擊 ::button[Start build]{variant="action"}

2. 保持預設設定，點擊 ::button[Start build]{variant="action"}

3. 觀察 **Build logs**，你會看到：
   - `[pre_build]` — 登入 ECR
   - `[build]` — docker build + tag
   - `[post_build]` — docker push + 產生 imagedefinitions.json

4. 等待 Build 狀態變為 ::status[Succeeded]{type="success" icon="aws-success"}
:::

:::expand{title="Build 失敗？常見原因"}
- **docker: command not found** — 沒有勾選 Privileged
- **denied: Your authorization token has expired** — ECR_REPO 環境變數設定錯誤
- **buildspec.yml not found** — 確認檔案已 push 到 GitHub
- **AccessDeniedException** — CodeBuild Role 權限不足
:::

---

## 4.4 驗證 Build 結果

:::steps
1. 開啟 [ECR Console](https://console.aws.amazon.com/ecr/) → `cicd-pipeline-lab-app`
2. 確認看到新的 Image（除了之前手動 push 的 `latest`，還有一個帶 commit hash 的 tag）
:::

:::alert{type="info"}
CodeBuild 自動完成了你在 Task 3 手動做的 `docker build` → `docker tag` → `docker push` 流程。接下來我們把它串進 Pipeline，加上自動觸發和自動部署。
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Build Project | CodeBuild Console | Project 已建立 |
| Build 執行 | Build history | ::status[Succeeded]{type="success" icon="aws-success"} |
| ECR Image | ECR Console | 看到新的 Image tag |

:::alert{type="success"}
CodeBuild 設定完成，前往下一節建立完整的 Pipeline。
:::
