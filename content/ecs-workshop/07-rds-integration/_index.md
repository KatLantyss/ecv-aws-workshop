---
title: Task 6 - RDS 整合
order: 8
---

# Task 6 - 資料庫儲存整合（RDS）

::badge[實作]{type="info"} ::badge[約 15-20 分鐘]{type="default"}

為應用加上 RDS MySQL 整合，實現遊戲排行榜的寫入與讀取功能。

---

## 7.1 更新應用程式

:::steps
1. 進入 2048 目錄

```bash
cd ~/2048
```

2. 更新 ``package.json``（新增 MySQL 驅動）

```bash
cat > package.json << 'EOF'
{
  "name": "web2048-api",
  "version": "3.0.0",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "express": "^4.18.0",
    "@aws-sdk/client-s3": "^3.400.0",
    "mysql2": "^3.6.0"
  }
}
EOF
```

3. 更新 ``server.js``（新增 DB 端點）

```bash
cat > server.js << 'SERVEREOF'
const express = require('express');
const path = require('path');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 80;
const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET = process.env.S3_BUCKET;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'workshopdb',
  waitForConnections: true,
  connectionLimit: 5
});

async function initDB() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        player VARCHAR(50) NOT NULL,
        score INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database table initialized');
  } catch (err) { console.error('DB init error:', err.message); }
}
initDB();

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', version: '3.0.0' });
});

// S3 endpoints
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

// Leaderboard endpoints
app.post('/api/scores', async (req, res) => {
  try {
    const { player, score } = req.body;
    if (!player || !score) return res.status(400).json({ error: 'player and score required' });
    const [result] = await pool.execute('INSERT INTO scores (player, score) VALUES (?, ?)', [player, score]);
    res.json({ message: 'Score saved', id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/scores', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM scores ORDER BY score DESC LIMIT 10');
    res.json({ count: rows.length, scores: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`S3 Bucket: ${BUCKET}`);
  console.log(`DB Host: ${process.env.DB_HOST}`);
});
SERVEREOF
```
:::

---

## 7.2 重新建置並推送映像

```bash
docker build -t web2048:v3 .
docker tag web2048:v3 $ECR_REPO:latest
docker push $ECR_REPO:latest
```

---

## 7.3 透過 Console 更新 Task Definition

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Task definitions** → ``ecs-workshop-app``

2. 點擊 ::button[Create new revision]{variant="primary"}

3. 在 **Environment variables** 區段，保留既有的 ``S3_BUCKET``，新增以下變數：

| Key | Value |
|-----|-------|
| ``DB_HOST`` | 貼上 Task 1 記錄的 RDS Endpoint |
| ``DB_USER`` | ``admin`` |
| ``DB_PASSWORD`` | Task 1 設定的資料庫密碼 |
| ``DB_NAME`` | ``workshopdb`` |

4. 點擊 ::button[Create]{variant="primary"}
:::

:::alert{type="warning"}
將資料庫密碼放在環境變數中僅適用於實驗環境。正式環境應使用 AWS Secrets Manager，並透過 Task Definition 的 **valueFrom** 欄位注入。
:::

---

## 7.4 透過 Console 更新 ECS Service

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → ``ecs-workshop-cluster``
2. 在 **Services** 分頁，勾選 ``ecs-workshop-service``，點擊 ::button[Update]{variant="primary"}
3. **Revision**：選擇 LATEST
4. 勾選 **Force new deployment**
5. 點擊 ::button[Update]{variant="primary"}
:::

等待部署完成（約 2-3 分鐘）。

---

## 7.5 測試排行榜功能

### 提交分數

```bash
curl -X POST http://$ALB_DNS/api/scores \
  -H "Content-Type: application/json" \
  -d '{"player": "Alice", "score": 2048}'

curl -X POST http://$ALB_DNS/api/scores \
  -H "Content-Type: application/json" \
  -d '{"player": "Bob", "score": 4096}'
```

### 查看排行榜

```bash
curl http://$ALB_DNS/api/scores
```

:::expand{title="預期輸出"}
```json
{"count":2,"scores":[{"id":2,"player":"Bob","score":4096,"created_at":"..."},{"id":1,"player":"Alice","score":2048,"created_at":"..."}]}
```
:::

### 驗證完整功能

```bash
curl http://$ALB_DNS/api/health    # version: 3.0.0
curl http://$ALB_DNS/api/s3/files  # S3 仍正常
curl http://$ALB_DNS/api/scores    # 排行榜
```

瀏覽器開啟 ``http://<ALB_DNS>``，2048 遊戲仍正常運作。

---

## 常見問題

:::expand{title="連接 RDS 失敗（ETIMEDOUT）？"}
1. 確認 RDS Security Group 允許來自 ECS Security Group 的 Port 3306 流量
2. 確認 RDS 部署在 Private Subnet，ECS Task 部署在 Public Subnet，兩者在同一 VPC 內
3. 確認環境變數 ``DB_HOST`` 是否正確設定為 RDS Endpoint

可在 [RDS Console](https://console.aws.amazon.com/rds/) → **Databases** → ``ecs-workshop-db`` 中確認。
:::

:::expand{title="資料庫連線被拒絕（Access Denied）？"}
確認 ``DB_USER`` 和 ``DB_PASSWORD`` 與 CloudFormation 部署時設定的一致。
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| 2048 遊戲 | 瀏覽器開啟 ALB DNS | 遊戲正常運作 |
| Health API | ``curl /api/health`` | version: 3.0.0 |
| 提交分數 | ``curl POST /api/scores`` | Score saved |
| 排行榜 | ``curl GET /api/scores`` | 顯示分數排名 |

:::alert{type="success"}
所有功能整合完成，前往最後一節清除資源。
:::
