# Lab 6 - 資料庫儲存整合（RDS）

> ⏱ 預估時間：15-20 分鐘

---

## 本節目標

更新應用程式整合 RDS MySQL，實現資料的寫入與讀取，重新建置映像並部署至 ECS。

---

## 6.1 更新應用程式

### Step 1：更新 package.json

```bash
cd app

cat > package.json << 'EOF'
{
  "name": "ecs-workshop-app",
  "version": "3.0.0",
  "description": "ECS Workshop Demo App with S3 + RDS",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "@aws-sdk/client-s3": "^3.400.0",
    "mysql2": "^3.6.0"
  }
}
EOF
```

### Step 2：更新 server.js

```bash
cat > server.js << 'SERVEREOF'
const express = require('express');
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;
const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET = process.env.S3_BUCKET;

app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'workshopdb',
  waitForConnections: true,
  connectionLimit: 5
});

// Initialize DB table
async function initDB() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database table initialized');
  } catch (err) {
    console.error('DB init error:', err.message);
  }
}
initDB();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '3.0.0', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'ECS Workshop App',
    version: '3.0.0',
    features: ['health-check', 's3-upload', 's3-list', 'db-read', 'db-write'],
    endpoints: [
      'GET  /health       - Health check',
      'POST /s3/upload    - Upload text to S3',
      'GET  /s3/files     - List S3 files',
      'POST /db/messages  - Write message to DB',
      'GET  /db/messages  - Read messages from DB'
    ]
  });
});

// ===== S3 Endpoints =====
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
    const files = (data.Contents || []).map(f => ({ key: f.Key, size: f.Size, lastModified: f.LastModified }));
    res.json({ bucket: BUCKET, fileCount: files.length, files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== DB Endpoints =====
app.post('/db/messages', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }
    const [result] = await pool.execute('INSERT INTO messages (content) VALUES (?)', [content]);
    res.json({ message: 'Message saved', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/db/messages', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM messages ORDER BY created_at DESC LIMIT 20');
    res.json({ count: rows.length, messages: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`S3 Bucket: ${BUCKET}`);
  console.log(`DB Host: ${process.env.DB_HOST}`);
});
SERVEREOF
```

---

## 6.2 重新建置並推送映像

```bash
docker build -t ecs-workshop-app:v3 .

docker tag ecs-workshop-app:v3 $ECR_REPO:v3
docker tag ecs-workshop-app:v3 $ECR_REPO:latest

docker push $ECR_REPO:v3
docker push $ECR_REPO:latest
```

---

## 6.3 更新 Task Definition

新增 RDS 相關的環境變數：

```bash
cat > task-definition-v3.json << EOF
{
  "family": "ecs-workshop-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "$EXECUTION_ROLE_ARN",
  "taskRoleArn": "$TASK_ROLE_ARN",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "$ECR_REPO:v3",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        { "name": "S3_BUCKET", "value": "$S3_BUCKET" },
        { "name": "DB_HOST", "value": "$RDS_ENDPOINT" },
        { "name": "DB_USER", "value": "admin" },
        { "name": "DB_PASSWORD", "value": "$DB_PASSWORD" },
        { "name": "DB_NAME", "value": "workshopdb" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ecs-workshop",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "app"
        }
      }
    }
  ]
}
EOF
```

> ⚠️ **安全提醒**：將資料庫密碼放在環境變數中僅適用於實驗環境。正式環境應使用 AWS Secrets Manager 或 SSM Parameter Store，並透過 Task Definition 的 `secrets` 欄位注入。

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition-v3.json \
  --region us-east-1
```

---

## 6.4 更新 ECS Service

```bash
aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service ecs-workshop-service \
  --task-definition ecs-workshop-app \
  --force-new-deployment \
  --region us-east-1

aws ecs wait services-stable \
  --cluster $ECS_CLUSTER \
  --services ecs-workshop-service \
  --region us-east-1
```

---

## 6.5 測試 RDS 功能

### 寫入資料

```bash
curl -X POST http://$ALB_DNS/db/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello from ECS Workshop!"}'
```

預期輸出：
```json
{"message":"Message saved","id":1}
```

### 讀取資料

```bash
curl http://$ALB_DNS/db/messages
```

預期輸出：
```json
{"count":1,"messages":[{"id":1,"content":"Hello from ECS Workshop!","created_at":"..."}]}
```

### 驗證完整功能

```bash
# 確認所有端點都正常
curl http://$ALB_DNS/
curl http://$ALB_DNS/health
curl http://$ALB_DNS/s3/files
curl http://$ALB_DNS/db/messages
```

---

## ❓ 常見問題

**Q: 連接 RDS 失敗（ETIMEDOUT）？**

確認：
1. RDS Security Group 允許來自 ECS Security Group 的 Port 3306 流量
2. RDS 部署在 Private Subnet，ECS Task 部署在 Public Subnet，兩者在同一 VPC 內
3. 環境變數 `DB_HOST` 是否正確設定為 RDS Endpoint

**Q: 資料庫連線被拒絕（Access Denied）？**

確認 `DB_USER` 和 `DB_PASSWORD` 與 CloudFormation 部署時設定的一致。

---

## ✅ 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| 映像推送 | `describe-images` | 看到 v3 標籤 |
| Task Definition | `describe-task-definition` | revision: 3，含 DB 環境變數 |
| DB 寫入 | `curl POST /db/messages` | Message saved |
| DB 讀取 | `curl GET /db/messages` | 顯示已寫入的訊息 |
| 全功能驗證 | `curl /` | version: 3.0.0，5 個端點 |

```bash
cd ..
```

前往 [Lab 7 - 資源清除](./lab7-cleanup.md) ▶
