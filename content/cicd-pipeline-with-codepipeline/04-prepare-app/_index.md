---
title: Task 2 - 準備應用
order: 4
---

# Task 2 - 準備應用程式

::badge[實作]{type="info"} ::badge[約 15 分鐘]{type="default"}

將 Fork 的 2048 遊戲 Clone 到 Command Host，並加入 Docker 和 CI/CD 所需的設定檔。

---

## 2.1 Clone Repository

在 Command Host 的 Session Manager 終端機中執行：

:::steps
1. 設定 Git 身份（替換為你的 GitHub 資訊）

```bash
git config --global user.name "<你的 GitHub Username>"
git config --global user.email "<你的 Email>"
```

2. Clone 你 Fork 的 Repository

```bash
cd ~
git clone https://github.com/<你的 GitHub Username>/2048.git
cd 2048
```

3. 確認檔案已下載

```bash
ls -la
```
:::

---

## 2.2 建立 Dockerfile

```bash
cat > Dockerfile << 'EOF'
FROM nginx:latest
COPY . /usr/share/nginx/html
EXPOSE 80
EOF
```

:::expand{title="Dockerfile 說明"}
- **FROM nginx:latest** — 使用 Nginx 官方映像作為基底
- **COPY . /usr/share/nginx/html** — 將 2048 遊戲檔案複製到 Nginx 網頁目錄
- **EXPOSE 80** — 宣告容器開放 Port 80
:::

---

## 2.3 撰寫 buildspec.yml

`buildspec.yml` 是 CodeBuild 的核心設定檔，定義了自動化建置的每一個步驟。

```bash
cat > buildspec.yml << 'BUILDSPEC'
version: 0.2
env:
  variables:
    IMAGE_TAG: "latest"
phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - ECR_URI=$ECR_REPO
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_URI
  build:
    commands:
      - echo Building Docker image...
      - docker build -t $ECR_URI:$IMAGE_TAG .
      - docker tag $ECR_URI:$IMAGE_TAG $ECR_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION
  post_build:
    commands:
      - echo Pushing Docker image to ECR...
      - docker push $ECR_URI:$IMAGE_TAG
      - docker push $ECR_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION
      - echo Writing image definitions file...
      - printf '[{"name":"web","imageUri":"%s"}]' $ECR_URI:$IMAGE_TAG > imagedefinitions.json
artifacts:
  files:
    - imagedefinitions.json
BUILDSPEC
```

:::expand{title="buildspec.yml 逐段解析"}
| 區段 | 說明 |
|------|------|
| `pre_build` | 建置前準備 — 登入 ECR，取得 push 權限 |
| `build` | 建置 Docker Image 並標記兩個 tag：`latest` 和 commit hash |
| `post_build` | 推送 Image 至 ECR，並產生 `imagedefinitions.json` |
| `artifacts` | 指定 Pipeline 需要的輸出檔案 |

`imagedefinitions.json` 格式：
```json
[{"name": "web", "imageUri": "123456789012.dkr.ecr.us-east-1.amazonaws.com/cicd-pipeline-lab-app:latest"}]
```
- `name`：對應 Task Definition 中的 container name
- `imageUri`：新的 Image URI，ECS 會用這個更新 Service
:::

---

## 2.4 Push 設定檔至 GitHub

:::steps
1. 將新檔案加入 Git

```bash
git add Dockerfile buildspec.yml
git commit -m "Add Dockerfile and buildspec.yml for CI/CD"
```

2. Push 至 GitHub（會要求輸入 GitHub 帳號和 Personal Access Token）

```bash
git push origin master
```
:::

:::alert{type="info"}
Push 時 Username 輸入你的 GitHub 帳號，Password 輸入 Task 0 建立的 **Personal Access Token**。
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Dockerfile | `cat Dockerfile` | 看到 FROM nginx |
| buildspec.yml | `cat buildspec.yml` | 看到 version: 0.2 |
| GitHub | 開啟你的 GitHub repo | 看到 Dockerfile 和 buildspec.yml |

:::alert{type="success"}
應用程式準備完成，前往下一節手動部署至 ECS。
:::
