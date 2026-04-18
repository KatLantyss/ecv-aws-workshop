---
title: Task 7 - 資源清除
order: 9
---

# Task 7 - 資源清除

::badge[清除]{type="danger"} ::badge[約 10 分鐘]{type="default"}

刪除本工作坊建立的所有 AWS 資源，避免產生額外費用。

:::alert{type="warning"}
請務必完成此步驟，否則 ALB、ECS 等資源會持續計費。
:::

---

## 7.1 刪除 CodePipeline

:::steps
1. 開啟 [CodePipeline Console](https://console.aws.amazon.com/codesuite/codepipeline/)
2. 選擇 `cicd-pipeline-lab-{{USERNAME}}-pipeline`
3. 點擊 ::button[Delete pipeline]{variant="default"}
4. 輸入 pipeline 名稱確認刪除
:::

---

## 7.2 刪除 CodeBuild Project

:::steps
1. 開啟 [CodeBuild Console](https://console.aws.amazon.com/codesuite/codebuild/)
2. 選擇 `cicd-pipeline-lab-{{USERNAME}}-build`
3. 點擊 ::button[Delete build project]{variant="default"}
4. 確認刪除
:::

---

## 7.3 刪除 ECS Service

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → `cicd-pipeline-lab-cluster`
2. 在 **Services** 分頁，勾選 `cicd-pipeline-lab-{{USERNAME}}-service`
3. 點擊 ::button[Delete service]{variant="default"}
4. 輸入 ``delete`` 確認
:::

---

## 7.4 反註冊 Task Definition

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Task definitions** → `cicd-pipeline-lab-{{USERNAME}}-app`
2. 勾選所有版本
3. 點擊 ::button[Actions]{variant="default" postfix="aws-expand"} → **Deregister**
:::

---

## 7.5 清空 S3 Bucket

:::steps
1. 開啟 [S3 Console](https://console.aws.amazon.com/s3/)
2. 找到 `cicd-pipeline-lab-{{USERNAME}}-artifacts-*` 的 Bucket
3. 點擊 ::button[Empty]{variant="default"}
4. 輸入 ``permanently delete``，點擊 ::button[Empty]{variant="action"}
:::

---

## 7.6 刪除 CloudFormation Stack

:::steps
1. 開啟 [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
2. 勾選 `cicd-pipeline-lab-{{USERNAME}}` Stack
3. 點擊 ::button[Delete stack]{variant="default"}
4. 等待刪除完成
:::

:::alert{type="info"}
CloudFormation 會自動刪除 Command Host、ALB、Target Group、S3 Bucket、IAM Roles 等個人 Lab 資源。
:::

---

## 7.7 刪除 GitHub Connection（選擇性）

:::steps
1. 開啟 [CodePipeline Console](https://console.aws.amazon.com/codesuite/codepipeline/) → **Settings** → **Connections**
2. 選擇 `cicd-pipeline-lab-{{USERNAME}}-github`
3. 點擊 ::button[Delete]{variant="default"}
:::

---

## 7.8 清理 CloudWatch Log Groups（選擇性）

:::steps
1. 開啟 [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/) → **Log groups**
2. 找到以 `/aws/codebuild/cicd-pipeline-lab-{{USERNAME}}` 和 `/ecs/cicd-pipeline-lab-{{USERNAME}}` 開頭的 Log Group
3. 勾選後刪除
:::

---

## 清除檢查清單

| 資源 | 驗證方式 | 預期結果 |
|------|----------|----------|
| CodePipeline | CodePipeline Console | 不存在 |
| CodeBuild | CodeBuild Console | 不存在 |
| ECS Service | ECS Console | 不存在 |
| Task Definition | ECS Console | 不存在 |
| S3 Bucket | S3 Console | 不存在 |
| CloudFormation Stack | CloudFormation Console | 不存在 |

---

## 恭喜完成

本工作坊已全部完成。透過實作，你成功建立了一條完整的 CI/CD Pipeline：

- ✅ 使用 GitHub 管理原始碼
- ✅ 使用 CodeBuild 自動化建置 Docker Image
- ✅ 使用 CodePipeline 串接完整的部署流程
- ✅ 體驗了 `git push` 自動觸發部署
- ✅ 實現了零停機應用切換

:::alert{type="info"}
**延伸學習**
- [AWS CodePipeline 使用者指南](https://docs.aws.amazon.com/codepipeline/latest/userguide/)
- [AWS CodeBuild 使用者指南](https://docs.aws.amazon.com/codebuild/latest/userguide/)
- [Amazon ECS 搭配 CodePipeline 教學](https://docs.aws.amazon.com/codepipeline/latest/userguide/ecs-cd-pipeline.html)
- [buildspec.yml 參考](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html)
:::
