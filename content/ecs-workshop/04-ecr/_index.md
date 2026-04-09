---
title: Task 3 - ECR 映像推送
order: 5
---

# Task 3 - 推送映像至 Amazon ECR

::badge[實作]{type="info"} ::badge[約 10-15 分鐘]{type="default"}

將 Command Host 上建置好的 Docker 映像推送至 Amazon ECR，讓 ECS 可以從中拉取映像來部署。

---

## 4.1 在 Console 確認 ECR Repository

Task 1 的 CloudFormation 已經建立了 ECR Repository。

:::steps
1. 開啟 [ECR Console](https://console.aws.amazon.com/ecr/)
2. 左側選單點擊 **Repositories**
3. 確認 ``ecs-workshop-app`` 存在，目前應該沒有任何映像
:::

:::alert{type="info"}
CloudFormation 已為這個 Repository 啟用了 **Image Scanning**（推送時自動掃描漏洞）和 **Lifecycle Policy**（保留最新 5 個映像）。
:::

---

## 4.2 登入 ECR

```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_REPO
```

預期輸出：``Login Succeeded``

:::expand{title="ECR_REPO 環境變數還沒設定？"}
如果 Task 1 未設定環境變數，請先執行：

```bash
export ECR_REPO=<貼上 CloudFormation Outputs 的 ECRRepositoryUri>
```

例如：`export ECR_REPO=123456789012.dkr.ecr.us-east-1.amazonaws.com/ecs-workshop-app`
:::

---

## 4.3 標記並推送映像

:::steps
1. 標記映像

```bash
docker tag web2048:latest $ECR_REPO:latest
```

2. 確認標記成功

```bash
docker images
```

預期看到兩個映像指向同一個 IMAGE ID：`web2048:latest` 和 `<ECR_URI>:latest`。

3. 推送映像

```bash
docker push $ECR_REPO:latest
```
:::

:::expand{title="預期輸出"}
```
The push refers to repository [123456789012.dkr.ecr.us-east-1.amazonaws.com/ecs-workshop-app]
9fb7edea8440: Pushed
abc66ad258e9: Pushed
...
latest: digest: sha256:... size: 1780
```
:::

---

## 4.4 在 Console 驗證推送結果

:::steps
1. 回到 [ECR Console](https://console.aws.amazon.com/ecr/) → **Repositories** → ``ecs-workshop-app``
2. 確認看到 ``latest`` 映像標籤
3. 點擊映像，可以查看 **Vulnerabilities** 欄位（Image Scanning 結果）
:::

:::expand{title="關於 Image Scanning"}
ECR 會自動掃描推送的映像，檢查 OS 套件是否有已知的 CVE 漏洞。正式環境中應將此整合至 CI/CD Pipeline，阻擋含有 CRITICAL 漏洞的映像部署。
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| ECR 登入 | ``docker login`` | Login Succeeded |
| 映像推送 | ECR Console | 看到 latest 標籤 |
| 漏洞掃描 | ECR Console → Vulnerabilities | 顯示掃描結果 |

:::alert{type="success"}
映像已推送至 ECR，前往下一節將 2048 遊戲部署到 ECS Fargate。
:::
