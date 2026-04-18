---
title: Task 4 - CodeBuild
order: 6
---

# Task 4 - 建立 CodeBuild Project

::badge[實作]{type="info"} ::badge[約 20 分鐘]{type="default"}

將 Task 3 的手動 build + push 流程交給 CodeBuild 自動執行。

---

## 4.1 綁定 GitHub 與 AWS CodeBuild

在建立 Build Project 之前，需要先讓 CodeBuild 能存取你的 GitHub Repository。

:::steps
1. 開啟 [CodeBuild Console](https://console.aws.amazon.com/codesuite/codebuild/) → 左側選單展開 **Build** → 點擊 **Build projects**

2. 點擊 ::button[Create build project]{variant="action"}

3. 在 **Source** 區塊：
   - **Source provider**：選擇 **GitHub**
   - 點擊 **Manage account credential**

4. 在 **Manage default source credential** 頁面：
   - **Source Provider**：GitHub
   - **Credential type**：選擇 **Personal access token**
   - **Service**：選擇 **CodeBuild**
   - **GitHub personal access token**：貼上你在 Task 0 建立的 GitHub Personal Access Token
   - 點擊 ::button[Save]{variant="action"}
:::

:::expand{title="還沒有 Personal Access Token？"}
請回到 Task 0 的 0.3 步驟建立 Personal Access Token。需要選擇 `Only select repositories` 並指定你的 2048 Repository。
:::

:::alert{type="warning"}
Token 只會顯示一次，請立即複製並妥善保存。後續 CodePipeline 設定也會用到。
:::

---

## 4.2 建立 Build Project

:::steps
1. 開啟 [CodeBuild Console](https://console.aws.amazon.com/codesuite/codebuild/) → 左側選單展開 **Build** → 點擊 **Build projects**

2. 點擊 ::button[Create build project]{variant="action"}

3. 在 **Project configuration** 區塊：
   - **Project name**：輸入 ``cicd-pipeline-lab-{{USERNAME}}-build``

4. 在 **Source** 區塊：
   - **Source provider**：選擇 **GitHub**（credential 已在 4.1 設定完成）
   - **Repository**：選擇 **Repository in my GitHub account**
   - **GitHub repository**：選擇你 Fork 的 `2048` Repository

5. 在 **Environment** 區塊：
   - **Provisioning model**：On-demand
   - **Environment image**：Managed image
   - **Compute**：EC2
   - **Operating system**：Amazon Linux
   - **Runtime(s)**：Standard
   - **Image**：選擇最新版本（例如 `aws/codebuild/amazonlinux2-x86_64-standard:5.0`）
   - **Image version**：Always use the latest image for this runtime version
   - **Service role**：選擇 **Existing service role**
   - **Role ARN**：選擇 `cicd-pipeline-lab-{{USERNAME}}-codebuild-role`
   - 取消勾選 **Allow AWS CodeBuild to modify this service role so it can be used with this build project**

6. 在 **Buildspec** 區塊：
   - 選擇 **Use a buildspec file**
   - **Buildspec name**：留空（預設使用 Repository 根目錄的 `buildspec.yml`）

7. 在 **Artifacts** 區塊：
   - **Type**：選擇 **No artifacts**

8. 保持 **Logs** 區塊預設設定（CloudWatch Logs 啟用）

9. 點擊 ::button[Create build project]{variant="action"}
:::

:::alert{type="warning"}
**Privileged** 必須勾選，否則 CodeBuild 無法在容器內執行 `docker build` 指令。這是建置 Docker Image 的必要設定。
:::

:::expand{title="為什麼選擇 Existing service role？"}
User Stack 已經建立了 `cicd-pipeline-lab-{{USERNAME}}-codebuild-role`，這個 Role 有精確的 ECR push 和 S3 artifact 權限。如果讓 CodeBuild 自動建立 Role，權限可能不足或過大。
:::

---

## 4.3 設定環境變數

Build Project 建立後，需要加入 ECR Repository URI 的環境變數，讓 `buildspec.yml` 知道要 push 到哪裡。

:::steps
1. 在剛建立的 Build Project 頁面，點擊 ::button[Edit]{variant="default"} → 選擇 **Environment**

2. 展開 **Additional configuration** 區塊

3. 捲到 **Environment variables** 區塊，點擊 **Add environment variable** 新增以下變數：

| Name | Value | Type |
|------|-------|------|
| ``ECR_REPO`` | 貼上 CloudFormation Outputs 的 **ECRRepositoryUri** | Plaintext |
| ``AWS_DEFAULT_REGION`` | ``us-east-1`` | Plaintext |
| ``IMAGE_TAG`` | ``{{USERNAME}}-latest`` | Plaintext |

4. 點擊 ::button[Update environment]{variant="action"}
:::

---

## 4.4 手動執行 Build

:::steps
1. 在 Build Project 頁面，點擊 ::button[Start build]{variant="action"}

2. 保持預設設定，等待 Build 開始執行

3. 觀察 **Build logs** 分頁，你會看到三個階段依序執行：

| 階段 | 動作 | 對應 buildspec.yml |
|------|------|-------------------|
| PRE_BUILD | 登入 Amazon ECR | `aws ecr get-login-password` |
| BUILD | 建置 Docker Image 並標記 | `docker build` + `docker tag` |
| POST_BUILD | 推送 Image 至 ECR + 產生 imagedefinitions.json | `docker push` |

4. 等待 Build 狀態變為 ::status[Succeeded]{type="success" icon="aws-success"}
:::

:::expand{title="Build 失敗？常見原因排查"}
| 錯誤訊息 | 原因 | 解法 |
|----------|------|------|
| `docker: command not found` | 沒有勾選 Privileged | 編輯 Environment → 勾選 Privileged |
| `denied: Your authorization token has expired` | ECR_REPO 環境變數錯誤 | 確認 ECR_REPO 值正確 |
| `buildspec.yml not found` | 檔案未 push 到 GitHub | 確認 `git push` 成功 |
| `AccessDeniedException` | CodeBuild Role 權限不足 | 確認使用的是 User Stack 建立的 Role，不是 Console 自動建立的 Role |
| `toomanyrequests` | Docker Hub rate limit | 重試即可，或等幾分鐘 |
| `ecr get-login-password` 失敗 | ECR_REPO 或 AWS_DEFAULT_REGION 環境變數未設定 | 確認 4.3 的環境變數已正確設定 |
:::

---

## 4.5 驗證 Build 結果

:::steps
1. 開啟 [ECR Console](https://console.aws.amazon.com/ecr/) → 點擊 `cicd-pipeline-lab-app`
2. 確認看到以 ``{{USERNAME}}-latest`` 為 tag 的 Image
3. 另外還有一個帶 commit hash 的 tag（由 `$CODEBUILD_RESOLVED_SOURCE_VERSION` 產生）
:::

:::alert{type="info"}
CodeBuild 自動完成了你在 Task 3 手動做的 `docker build` → `docker tag` → `docker push` 流程。接下來我們把它串進 Pipeline，加上自動觸發和自動部署。
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Build Project | CodeBuild Console | Project 已建立 |
| 環境變數 | Project → Environment | ECR_REPO、AWS_DEFAULT_REGION、IMAGE_TAG 已設定 |
| Build 執行 | Build history | ::status[Succeeded]{type="success" icon="aws-success"} |
| ECR Image | ECR Console | 看到 {{USERNAME}}-latest tag 的 Image |

:::alert{type="success"}
CodeBuild 設定完成，前往下一節建立完整的 Pipeline。
:::
