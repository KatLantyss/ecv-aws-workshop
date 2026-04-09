---
title: Task 5 - S3 整合
order: 7
---

# Task 5 - 雲端物件儲存整合（S3）

::badge[實作]{type="info"} ::badge[約 15-20 分鐘]{type="default"}

為 2048 遊戲加上 API 後端，整合 S3 實現檔案上傳與讀取功能。本 Lab 將建立一個新的 Node.js 應用，將它與 2048 遊戲一起打包成新的容器映像。

---

## 6.1 建立 API 後端

回到工作目錄，在 2048 專案中加入 API 後端：

:::steps
1. 進入 2048 目錄

```bash
cd ~/2048
```

2. 建立 ``package.json``

```bash
cat > package.json << 'EOF'
{
  "name": "web2048-api",
  "version": "2.0.0",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "express": "^4.18.0",
    "@aws-sdk/client-s3": "^3.400.0"
  }
}
EOF
```

3. 建立 ``server.js``

```bash
cat > server.js << 'SERVEREOF'
const express = require('express');
const path = require('path');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const app = express();
const PORT = 80;
const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET = process.env.S3_BUCKET;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', version: '2.0.0' });
});

app.post('/api/s3/upload', async (req, res) => {
  try {
    const { filename, content } = req.body;
    if (!filename || !content) return res.status(400).json({ error: 'filename and content required' });
    await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: filename, Body: content, ContentType: 'text/plain' }));
    res.json({ message: 'Upload successful', bucket: BUCKET, key: filename });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/s3/files', async (req, res) => {
  try {
    const data = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
    const files = (data.Contents || []).map(f => ({ key: f.Key, size: f.Size, lastModified: f.LastModified }));
    res.json({ bucket: BUCKET, fileCount: files.length, files });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`S3 Bucket: ${BUCKET}`);
});
SERVEREOF
```

4. 將 2048 遊戲檔案移到 public 目錄

```bash
mkdir -p public
mv index.html favicon.ico js meta style Rakefile public/ 2>/dev/null
```

5. 更新 Dockerfile

```bash
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js .
COPY public ./public
EXPOSE 80
CMD ["node", "server.js"]
EOF
```
:::

:::alert{type="info"}
架構改變：從純 Nginx 靜態服務改為 Node.js + Express。Express 同時提供 2048 遊戲的靜態檔案和 API 端點。
:::

---

## 6.2 重新建置並推送映像

```bash
docker build -t web2048:v2 .
docker tag web2048:v2 $ECR_REPO:latest
docker push $ECR_REPO:latest
```

---

## 6.3 透過 Console 更新 Task Definition

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Task definitions** → ``ecs-workshop-app``

2. 點擊 ::button[Create new revision]{variant="primary"}

3. 在 **Container - 1** 區塊，展開 **Environment variables**，點擊 ::button[Add environment variable]{variant="link"}：
   - **Key**：``S3_BUCKET``
   - **Value type**：Value
   - **Value**：貼上 Task 1 記錄的 S3 Bucket 名稱

4. 確認 **Health check** 的 Command 為空或設為 ``CMD-SHELL,curl -f http://localhost/api/health || exit 1``

5. 點擊 ::button[Create]{variant="primary"}
:::

---

## 6.4 透過 Console 更新 ECS Service

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → ``ecs-workshop-cluster``

2. 在 **Services** 分頁，勾選 ``ecs-workshop-service``，點擊 ::button[Update]{variant="primary"}

3. **Revision**：選擇 LATEST
4. 勾選 **Force new deployment**
5. 點擊 ::button[Update]{variant="primary"}
:::

等待部署完成（約 2-3 分鐘），在 **Deployments** 分頁確認新版本已完成。

---

## 6.5 測試

### 確認 2048 遊戲仍正常

在瀏覽器開啟 ``http://<ALB_DNS>``，遊戲應該跟之前一樣正常運作。

### 測試 S3 API

```bash
# Health Check
curl http://$ALB_DNS/api/health

# 上傳檔案
curl -X POST http://$ALB_DNS/api/s3/upload \
  -H "Content-Type: application/json" \
  -d '{"filename": "hello.txt", "content": "Hello from Web 2048!"}'

# 列出檔案
curl http://$ALB_DNS/api/s3/files
```

### 在 Console 驗證

:::steps
1. 開啟 [S3 Console](https://console.aws.amazon.com/s3/)
2. 找到並點擊 workshop 的 S3 Bucket
3. 確認 ``hello.txt`` 已存在
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| 2048 遊戲 | 瀏覽器開啟 ALB DNS | 遊戲正常運作 |
| Health API | ``curl /api/health`` | version: 2.0.0 |
| S3 上傳 | ``curl POST /api/s3/upload`` | Upload successful |
| S3 Console | S3 Console | 看到 hello.txt |

:::alert{type="success"}
S3 整合完成，前往下一節加上 RDS 資料庫功能。
:::
