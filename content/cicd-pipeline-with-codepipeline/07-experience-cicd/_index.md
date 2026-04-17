---
title: Task 6 - 體驗 CI/CD
order: 8
---

# Task 6 - 體驗 CI/CD 的威力

::badge[實作]{type="info"} ::badge[約 20 分鐘]{type="default"}

Pipeline 已就緒。現在體驗 `git push` 自動觸發完整部署流程，並實現零停機應用切換。

---

## 6.1 小幅修改觸發 Pipeline

先做一個小修改，驗證 Pipeline 能自動偵測並執行：

:::steps
1. 在 Command Host 上修改 2048 的標題

```bash
cd ~/2048
sed -i 's/<title>2048<\/title>/<title>2048 - CI\/CD Edition<\/title>/' index.html
```

2. Commit 並 Push

```bash
git add index.html
git commit -m "Update title to CI/CD Edition"
git push origin master
```

3. 立即切換到 [CodePipeline Console](https://console.aws.amazon.com/codesuite/codepipeline/)

4. 觀察 Pipeline 自動觸發：
   - **Source** — 偵測到 GitHub push，拉取新程式碼
   - **Build** — CodeBuild 自動 build 新的 Docker Image
   - **Approval** — 等待你的核准

5. 點擊 ::button[Review]{variant="default"} → ::button[Approve]{variant="action"}

6. 觀察 **Deploy** — ECS Service 自動更新

7. 等待所有 Stage ::status[Succeeded]{type="success" icon="aws-success"}
:::

在瀏覽器重新整理 `http://<ALB_DNS>`，確認分頁標題已變為 **2048 - CI/CD Edition**。

:::alert{type="info"}
你沒有手動 `docker build`、沒有手動 `docker push`、沒有手動更新 ECS Service — 一切都由 Pipeline 自動完成。
:::

---

## 6.2 零停機應用切換 — 從 2048 到 Flappy Bird

接下來展示 CI/CD 的真正威力 — 把整個應用從 2048 換成 Flappy Bird，只需要一次 `git push`。

:::steps
1. 下載 Flappy Bird 遊戲原始碼

```bash
cd ~/2048
git clone https://github.com/CodeExplainedRepo/Original-Flappy-bird-JavaScript /tmp/flappy
```

2. 保留 CI/CD 設定檔，替換應用程式碼

```bash
# 保留 Dockerfile、buildspec.yml 和 .git
find . -maxdepth 1 ! -name 'Dockerfile' ! -name 'buildspec.yml' ! -name '.git' ! -name '.' -exec rm -rf {} +

# 複製 Flappy Bird 檔案
cp -r /tmp/flappy/* .
```

3. 確認 CI/CD 設定檔還在

```bash
ls Dockerfile buildspec.yml
```

4. Commit 並 Push

```bash
git add -A
git commit -m "Switch to Flappy Bird"
git push origin master
```

5. 切換到 CodePipeline Console，觀察 Pipeline 自動觸發
:::

---

## 6.3 觀察自動部署過程

:::steps
1. **Source** stage — 偵測到 push，拉取 Flappy Bird 程式碼
2. **Build** stage — CodeBuild 用同一個 Dockerfile 建置新的 Image（內容是 Flappy Bird）
3. **Approval** stage — 點擊 ::button[Review]{variant="default"} → ::button[Approve]{variant="action"}
4. **Deploy** stage — ECS 自動用新 Image 替換舊的 Task
:::

:::alert{type="info"}
ECS 的部署策略是 **Rolling Update** — 先啟動新的 Task，確認 Health Check 通過後，再停止舊的 Task。整個過程中服務不中斷。
:::

---

## 6.4 驗證應用切換

:::steps
1. 等待 Deploy stage ::status[Succeeded]{type="success" icon="aws-success"}
2. 在瀏覽器重新整理 `http://<ALB_DNS>`
3. 預期看到 **Flappy Bird** 遊戲畫面（取代了 2048）
:::

---

## 6.5 回顧

你剛才做了什麼？

| 步驟 | 你做的事 | Pipeline 做的事 |
|------|----------|-----------------|
| 1 | 修改程式碼 | — |
| 2 | `git push` | 偵測變更 |
| 3 | — | 自動 Build Docker Image |
| 4 | — | 自動 Push 至 ECR |
| 5 | 點擊 Approve | — |
| 6 | — | 自動更新 ECS Service |
| 7 | — | 零停機切換應用 |

**你只做了 3 個動作**（改 code、push、approve），Pipeline 自動完成了其餘所有工作。

:::alert{type="success"}
這就是 CI/CD 的價值 — 將重複的手動工作自動化，讓開發者專注在程式碼本身。前往最後一節清除資源。
:::
