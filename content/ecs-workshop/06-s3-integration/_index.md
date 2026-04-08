---
title: Lab 5 - S3 整合
order: 6
---

# Lab 5 - 雲端物件儲存整合（S3）

::badge[實作]{type="info"} ::badge[約 15-20 分鐘]{type="default"}

更新應用程式，新增 S3 上傳與讀取功能，重新建置映像並透過 Console 部署至 ECS。

---

## 5.1 更新應用程式

:::steps
1. 更新 ``package.json``（新增 S3 SDK）

```bash
cd app

cat > package.json << 'EOF'
{
  "name": "ecs-workshop-app",
  "version": "2.0.0",
  "description": "ECS Workshop Demo App with S3",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "@aws-sdk/client-s3": "^3.400.0"
  }
}
EOF
```

2. 更新 ``server.js``（新增 S3 端點）

```bash
cat > server.js << 'SERVEREOF'
const express = require('express');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const app = express();
const PORT = 3000;
const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET = process.env.S3_BUCKET;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '2.0.0', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'ECS Workshop App',
    version: '2.0.0',
    features: ['health-check', 's3-upload', 's3-list'],
    endpoints: [
      'GET  /health     - Health check',
      'POST /s3/upload  - Upload text to S3',
      'GET  /s3/files   - List S3 files'
    ]
  });
});

app.post('/s3/upload', async (req, res) => {
  try {
    const { filename, content } = req.body;
    if (!filename || !content) {
      return res.status(400).json({ error: 'filename and content are required' });
    }
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET, Key: filename, Body: content, ContentType: 'text/plain'
    }));
    res.json({ message: 'Upload successful', bucket: BUCKET, key: filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/s3/files', async (req, res) => {
  try {
    const data = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
    const files = (data.Contents || []).map(f => ({
      key: f.Key, size: f.Size, lastModified: f.LastModified
    }));
    res.json({ bucket: BUCKET, fileCount: files.length, files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`S3 Bucket: ${BUCKET}`);
});
SERVEREOF
```
:::

---

## 5.2 重新建置並推送映像

```bash
# 建置
docker build -t ecs-workshop-app:v2 .

# 標記
docker tag ecs-workshop-app:v2 $ECR_REPO:v2
docker tag ecs-workshop-app:v2 $ECR_REPO:latest

# 推送
docker push $ECR_REPO:v2
docker push $ECR_REPO:latest
```

---

## 5.3 透過 Console 建立新版 Task Definition

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Task definitions** → 點擊 ``ecs-workshop-app``

2. 點擊 ::button[Create new revision]{variant="primary"}

3. 在 **Container - 1** 區塊：
   - 將 **Image URI** 的標籤從 ``:v1`` 改為 ``:v2``

4. 在 **Container - 1** 區塊，展開 **Environment variables** 區段，點擊 ::button[Add environment variable]{variant="link"}：
   - **Key**：``S3_BUCKET``
   - **Value type**：Value
   - **Value**：貼上你在 Lab 2 記錄的 S3 Bucket 名稱

5. 點擊 ::button[Create]{variant="primary"}
:::

---

## 5.4 透過 Console 更新 ECS Service

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → ``ecs-workshop-cluster``

2. 在 **Services** 分頁，勾選 ``ecs-workshop-service``，點擊 ::button[Update]{variant="primary"}

3. 在 **Deployment configuration** 區塊：
   - **Revision**：選擇 LATEST（應該是剛建立的新版本）
   - 勾選 **Force new deployment**

4. 點擊 ::button[Update]{variant="primary"}
:::

:::alert{type="info"}
ECS 會執行 Rolling Update：先啟動新版 Task，確認通過 Health Check 後再停止舊版 Task，確保零停機部署。
:::

等待部署完成（約 2-3 分鐘），在 Service 的 **Deployments** 分頁確認新版本已完成部署。

---

## 5.5 測試 S3 功能

### 上傳檔案

```bash
curl -X POST http://$ALB_DNS/s3/upload \
  -H "Content-Type: application/json" \
  -d '{"filename": "hello.txt", "content": "Hello from ECS Workshop!"}'
```

:::expand{title="預期輸出"}
```json
{"message":"Upload successful","bucket":"ecs-workshop-xxx","key":"hello.txt"}
```
:::

### 列出檔案

```bash
curl http://$ALB_DNS/s3/files
```

:::expand{title="預期輸出"}
```json
{"bucket":"ecs-workshop-xxx","fileCount":1,"files":[{"key":"hello.txt",...}]}
```
:::

### 在 Console 驗證

:::steps
1. 開啟 [S3 Console](https://console.aws.amazon.com/s3/)
2. 找到並點擊 workshop 的 S3 Bucket
3. 確認 ``hello.txt`` 已存在
:::

---

## 常見問題

:::expand{title="S3 上傳回傳 AccessDenied？"}
確認 Task Role（``ecs-workshop-task-role``）具有 S3 存取權限。在 CloudFormation 模板中，此角色已配置了 `s3:GetObject`、`s3:PutObject`、`s3:ListBucket` 權限。

可在 [IAM Console](https://console.aws.amazon.com/iam/) → **Roles** → ``ecs-workshop-task-role`` 中確認。
:::

:::expand{title="環境變數沒有傳入容器？"}
確認 Task Definition 的新版本中已正確設定 ``S3_BUCKET`` 環境變數，且 Service 已更新為使用最新版本的 Task Definition。
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| 映像推送 | ECR Console | 看到 v2 標籤 |
| Task Definition | ECS Console | 新版本含 S3_BUCKET 環境變數 |
| S3 上傳 | ``curl POST /s3/upload`` | Upload successful |
| S3 列表 | ``curl GET /s3/files`` | 顯示已上傳的檔案 |
| S3 Console | S3 Console | 看到 hello.txt |

```bash
cd ..
```

:::alert{type="success"}
S3 整合完成，前往下一節整合 RDS 資料庫。
:::
