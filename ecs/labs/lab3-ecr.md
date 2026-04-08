# Lab 3 - ECR 容器映像儲存

> ⏱ 預估時間：15-20 分鐘

---

## 本節目標

建立一個簡單的 Node.js 應用程式，打包成 Docker 映像，並推送至 Amazon ECR。

---

## 3.1 認識 Amazon ECR

Amazon Elastic Container Registry（ECR）是 AWS 提供的全託管容器映像儲存庫，類似於 Docker Hub，但與 AWS 服務深度整合。

**ECR 的核心功能：**

| 功能 | 說明 |
|------|------|
| Image Scanning | 推送映像時自動掃描安全漏洞 |
| Lifecycle Policy | 自動清理舊映像，節省儲存成本 |
| 加密 | 映像靜態加密（AES-256） |
| IAM 整合 | 透過 IAM 控制存取權限 |
| 跨區域複製 | 支援映像跨 Region 複製 |

> 💡 在 Lab 2 的 CloudFormation 中，我們已經建立了 ECR Repository `ecs-workshop-app`，並啟用了 Image Scanning 和 Lifecycle Policy（保留最新 5 個映像）。

---

## 3.2 建立應用程式

我們將建立一個簡單的 Node.js Express 應用，提供 Health Check 端點。

### Step 1：建立專案結構

```bash
mkdir -p app
cd app
```

### Step 2：建立 package.json

```bash
cat > package.json << 'EOF'
{
  "name": "ecs-workshop-app",
  "version": "1.0.0",
  "description": "ECS Workshop Demo App",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
EOF
```

### Step 3：建立應用程式碼

```bash
cat > server.js << 'EOF'
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'ECS Workshop App',
    version: '1.0.0',
    endpoints: [
      'GET /health - Health check',
      'GET / - This page'
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
EOF
```

### Step 4：建立 Dockerfile

```bash
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
EOF
```

> 💡 **為什麼用 `node:18-alpine`？** Alpine 映像體積小（~50MB vs ~350MB），減少拉取時間與攻擊面。

---

## 3.3 本機測試

在推送到 ECR 之前，先在本機驗證映像是否正常：

```bash
# 建置映像
docker build -t ecs-workshop-app:latest .

# 啟動容器
docker run -d -p 3000:3000 --name test-app ecs-workshop-app:latest

# 測試
curl http://localhost:3000/health
# 預期輸出：{"status":"healthy","timestamp":"..."}

curl http://localhost:3000/
# 預期輸出：{"message":"ECS Workshop App",...}

# 清理
docker stop test-app && docker rm test-app
```

---

## 3.4 推送映像至 ECR

### Step 1：登入 ECR

```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_REPO
```

預期輸出：`Login Succeeded`

### Step 2：標記映像

```bash
docker tag ecs-workshop-app:latest $ECR_REPO:v1
docker tag ecs-workshop-app:latest $ECR_REPO:latest
```

> 💡 同時標記版本號 `v1` 和 `latest`，方便後續管理。

### Step 3：推送映像

```bash
docker push $ECR_REPO:v1
docker push $ECR_REPO:latest
```

### Step 4：驗證推送結果

```bash
aws ecr describe-images \
  --repository-name ecs-workshop-app \
  --query 'imageDetails[*].{Tags:imageTags,Size:imageSizeInBytes,Pushed:imagePushedAt}' \
  --output table \
  --region us-east-1
```

---

## 3.5 查看 Image Scanning 結果

因為我們在 CloudFormation 中啟用了 `ScanOnPush: true`，ECR 會自動掃描推送的映像：

```bash
aws ecr describe-image-scan-findings \
  --repository-name ecs-workshop-app \
  --image-id imageTag=v1 \
  --query 'imageScanFindings.findingSeverityCounts' \
  --region us-east-1
```

> 💡 Image Scanning 會檢查映像中的 OS 套件是否有已知的 CVE 漏洞。正式環境中應將此整合至 CI/CD Pipeline，阻擋含有 CRITICAL 漏洞的映像部署。

---

## ✅ 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| 本機測試 | `curl localhost:3000/health` | {"status":"healthy"} |
| ECR 登入 | `docker login` | Login Succeeded |
| 映像推送 | `describe-images` | 看到 v1 和 latest 標籤 |
| 漏洞掃描 | `describe-image-scan-findings` | 顯示掃描結果 |

```bash
cd ..
```

前往 [Lab 4 - 將應用部署至 ECS 環境](./lab4-deploy-app.md) ▶
