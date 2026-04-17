---
title: Task 5 - CodePipeline
order: 7
---

# Task 5 - 建立 CodePipeline

::badge[實作]{type="info"} ::badge[約 30 分鐘]{type="default"}

將 Source、Build、Approval、Deploy 四個階段串成一條完整的 Pipeline。

---

## 5.1 建立 Pipeline

:::steps
1. 開啟 [CodePipeline Console](https://console.aws.amazon.com/codesuite/codepipeline/) → 點擊 ::button[Create pipeline]{variant="action"}

2. **Pipeline settings**：
   - **Pipeline name**：輸入 ``cicd-pipeline-lab-{{USERNAME}}-pipeline``
   - **Pipeline type**：V2
   - **Service role**：選擇 **Existing service role** → `cicd-pipeline-lab-{{USERNAME}}-pipeline-role`
   - 點擊 ::button[Next]{variant="action"}
:::

---

## 5.2 設定 Source Stage

:::steps
1. **Source provider**：選擇 **GitHub (Version 2)**

2. 點擊 **Connect to GitHub**（如果尚未建立 Connection）：
   - **Connection name**：輸入 ``cicd-pipeline-lab-{{USERNAME}}-github``
   - 點擊 ::button[Connect to GitHub]{variant="action"}
   - 在彈出視窗中授權 AWS 存取你的 GitHub
   - 點擊 ::button[Install a new app]{variant="default"}
   - 選擇你的 GitHub 帳號，授權存取 2048 Repository
   - 點擊 ::button[Connect]{variant="action"}

3. **Repository name**：選擇你 Fork 的 2048 Repository

4. **Default branch**：選擇 `master`

5. **Output artifact format**：CodePipeline default

6. 點擊 ::button[Next]{variant="action"}
:::

:::alert{type="info"}
**CodeConnections**（原 CodeStar Connections）是 AWS 與 GitHub 之間的安全橋樑。建立一次後，Pipeline 就能自動偵測 GitHub 的 push 事件。
:::

---

## 5.3 設定 Build Stage

:::steps
1. **Build provider**：選擇 **AWS CodeBuild**

2. **Project name**：選擇 `cicd-pipeline-lab-{{USERNAME}}-build`（Task 4 建立的）

3. **Build type**：Single build

4. 點擊 ::button[Next]{variant="action"}
:::

---

## 5.4 設定 Deploy Stage

:::steps
1. **Deploy provider**：選擇 **Amazon ECS**

2. **Cluster name**：選擇 `cicd-pipeline-lab-cluster`

3. **Service name**：選擇 `cicd-pipeline-lab-{{USERNAME}}-service`（Task 3 建立的）

4. **Image definitions file**：輸入 ``imagedefinitions.json``

5. 點擊 ::button[Next]{variant="action"}
:::

---

## 5.5 Review 並建立

:::steps
1. 檢查所有設定
2. 點擊 ::button[Create pipeline]{variant="action"}
3. Pipeline 建立後會自動執行第一次
:::

---

## 5.6 加入 Manual Approval Stage

Pipeline 建立後，我們加入一個人工核准關卡：

:::steps
1. 在 Pipeline 頁面，點擊 ::button[Edit]{variant="default"}

2. 在 **Build** 和 **Deploy** 之間，點擊 **+ Add stage**

3. **Stage name**：輸入 ``Approval``

4. 在新的 Stage 中，點擊 **+ Add action group**：
   - **Action name**：``ManualApproval``
   - **Action provider**：**Manual approval**
   - **Comments**：``請確認 Build 成功後再核准部署``
   - 點擊 ::button[Done]{variant="action"}

5. 點擊 ::button[Save]{variant="action"} → 確認 ::button[Save]{variant="action"}
:::

---

## 5.7 觀察 Pipeline 執行

Pipeline 儲存後會重新執行：

:::steps
1. 觀察 **Source** stage — 從 GitHub 拉取程式碼
2. 觀察 **Build** stage — CodeBuild 執行 buildspec.yml
3. **Approval** stage 會停下來等待核准
4. 點擊 ::button[Review]{variant="default"} → 輸入核准備註 → 點擊 ::button[Approve]{variant="action"}
5. 觀察 **Deploy** stage — 更新 ECS Service
6. 等待所有 Stage 變為 ::status[Succeeded]{type="success" icon="aws-success"}
:::

---

## 5.8 驗證

在瀏覽器開啟 `http://<ALB_DNS>`，確認 2048 遊戲仍正常運作。

:::alert{type="info"}
恭喜！你已經建立了一條完整的 CI/CD Pipeline。接下來我們要體驗它的威力 — 只要 `git push`，一切自動完成。
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Pipeline | CodePipeline Console | 四個 Stage 全部 Succeeded |
| Approval | Pipeline history | 有核准記錄 |
| 2048 遊戲 | 瀏覽器 ALB DNS | 正常運作 |

:::alert{type="success"}
Pipeline 建立完成，前往下一節體驗 CI/CD 的威力。
:::
