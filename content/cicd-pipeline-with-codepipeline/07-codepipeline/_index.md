---
title: Task 5 - CodePipeline
order: 7
---

# Task 5 - 建立 CodePipeline

::badge[實作]{type="info"} ::badge[約 30 分鐘]{type="default"}

將 Source、Build、Deploy 串成一條完整的 Pipeline，實現 git push 自動部署。

---

## 5.1 開啟 Pipeline 建立精靈

:::steps
1. 開啟 [CodePipeline Console](https://console.aws.amazon.com/codesuite/codepipeline/) → 點擊 ::button[Create pipeline]{variant="action"}

2. **Step 1 — Choose creation option**：
   - **Category**：選擇 **Build custom pipeline**
   - 點擊 ::button[Next]{variant="action"}
:::

---

## 5.2 Pipeline Settings（Step 2）

:::steps
1. **Pipeline name**：輸入 ``cicd-pipeline-lab-{{USERNAME}}-pipeline``

2. **Execution mode**：選擇 **Queued**

3. **Service role**：選擇 **Existing service role**
   - **Role ARN**：選擇 `cicd-pipeline-lab-{{USERNAME}}-pipeline-role`
   - 取消勾選 **Allow AWS CodePipeline to create a service role so it can be used with this new pipeline**

4. 點擊 ::button[Next]{variant="action"}
:::

:::expand{title="Execution mode 的差異"}
| 模式 | 說明 |
|------|------|
| **Superseded** | 新的執行會取代正在進行的執行 |
| **Queued** | 新的執行會排隊等待，依序執行（推薦） |
| **Parallel** | 多個執行同時進行 |
:::

---

## 5.3 Add Source Stage（Step 3）

:::steps
1. **Source provider**：選擇 **GitHub (via OAuth app)**

2. 如果尚未連接，點擊 **Connect to GitHub** 授權

3. 授權成功後：
   - **Repository**：選擇你 Fork 的 Repository（例如 `<你的 GitHub Username>/cicd-lab-2048`）
   - **Branch**：選擇 `master`

4. 點擊 ::button[Next]{variant="action"}
:::

:::alert{type="info"}
Console 會顯示 "GitHub (via OAuth app) action is not recommended" 的提示，這是因為 AWS 建議使用 GitHub App（CodeConnections）。對 workshop 來說 OAuth 夠用，可以忽略此提示。
:::

---

## 5.4 Add Build Stage（Step 4）

:::steps
1. **Build provider**：選擇 **Other build providers**

2. 選擇 **AWS CodeBuild**

3. **Project name**：選擇 `cicd-pipeline-lab-{{USERNAME}}-build`（Task 4 建立的）

4. **Build type**：選擇 **Single build**

5. **Input artifacts**：確認已選擇 `SourceArtifact`

6. 其他保持預設

7. 點擊 ::button[Next]{variant="action"}
:::

---

## 5.5 Skip Test Stage（Step 5）

:::steps
1. 點擊 ::button[Skip test stage]{variant="default"}
2. 確認跳過
:::

:::alert{type="info"}
本工作坊不設定測試階段。正式環境中建議加入自動化測試（單元測試、整合測試）作為品質關卡。
:::

---

## 5.6 Add Deploy Stage（Step 6）

:::steps
1. **Deploy provider**：選擇 **Amazon ECS**

2. **Cluster name**：選擇 `cicd-pipeline-lab-cluster`

3. **Service name**：選擇 `cicd-pipeline-lab-{{USERNAME}}-service`（Task 3 建立的）

4. **Image definitions file**：輸入 ``imagedefinitions.json``

5. 點擊 ::button[Next]{variant="action"}
:::

---

## 5.7 Review & Create（Step 7）

:::steps
1. 檢查所有設定：

| 項目 | 預期值 |
|------|--------|
| Pipeline name | cicd-pipeline-lab-{{USERNAME}}-pipeline |
| Pipeline type | V2 |
| Execution mode | QUEUED |
| Source provider | GitHub (via OAuth app) |
| Repository | 你的 2048 repo |
| Branch | master |
| Build provider | AWS CodeBuild |
| Project name | cicd-pipeline-lab-{{USERNAME}}-build |
| Deploy provider | Amazon ECS |

2. 點擊 ::button[Create pipeline]{variant="action"}

3. Pipeline 建立後會自動執行第一次
:::

---

## 5.8 加入 Manual Approval Stage

Pipeline 建立後，我們加入一個人工核准關卡，模擬正式環境的部署審核流程。

:::steps
1. 在 Pipeline 頁面，點擊 ::button[Edit]{variant="default"}

2. 在 **Build** 和 **Deploy** 之間，點擊 **+ Add stage**

3. **Stage name**：輸入 ``Approval``

4. 在新的 Stage 中，點擊 **+ Add action group**：
   - **Action name**：``ManualApproval``
   - **Action provider**：選擇 **Manual approval**
   - 點擊 ::button[Done]{variant="action"}

5. 點擊頁面上方的 ::button[Save]{variant="action"} → 確認 ::button[Save]{variant="action"}
:::

:::alert{type="info"}
Manual Approval 模擬正式環境中的部署審核流程。Build 完成後 Pipeline 會暫停，等待人工核准後才繼續部署。正式環境中可搭配 SNS 通知相關人員來審核。
:::

---

## 5.9 觀察 Pipeline 執行

Pipeline 儲存後會重新執行：

:::steps
1. 觀察 **Source** stage — 從 GitHub 拉取程式碼 → ::status[Succeeded]{type="success" icon="aws-success"}
2. 觀察 **Build** stage — CodeBuild 執行 buildspec.yml → ::status[Succeeded]{type="success" icon="aws-success"}
3. **Approval** stage 會停下來等待核准
4. 點擊 ::button[Review]{variant="default"} → 點擊 ::button[Approve]{variant="action"}
5. 觀察 **Deploy** stage — 更新 ECS Service → ::status[Succeeded]{type="success" icon="aws-success"}
:::

:::expand{title="Pipeline 執行失敗？"}
| Stage | 常見原因 | 解法 |
|-------|----------|------|
| Source | GitHub 授權過期 | 重新連接 GitHub |
| Build | buildspec.yml 錯誤 | 查看 CodeBuild logs |
| Deploy | ECS Service 不存在 | 確認 Task 3 已建立 Service |
| Deploy | imagedefinitions.json 格式錯誤 | 確認 container name 是 `web` |
:::

---

## 5.10 驗證

在瀏覽器開啟 `http://<ALB_DNS>`，確認 2048 遊戲仍正常運作。

:::alert{type="success"}
恭喜！你已經建立了一條完整的 CI/CD Pipeline。接下來我們要體驗它的威力 — 只要 `git push`，一切自動完成。
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Pipeline | CodePipeline Console | 四個 Stage 全部 Succeeded |
| 2048 遊戲 | 瀏覽器開啟個人 ALB DNS | 正常運作 |

:::alert{type="success"}
Pipeline 建立完成，前往下一節體驗 CI/CD 的威力。
:::
