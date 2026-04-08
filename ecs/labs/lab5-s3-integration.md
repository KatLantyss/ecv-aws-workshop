# Lab 5 - 雲端物件儲存整合（S3）

> ⏱ 預估時間：15-20 分鐘

---

## 本節目標

更新應用程式，新增 S3 上傳與讀取功能，重新建置映像並部署至 ECS。

---

## 5.1 更新應用程式

### Step 1：更新 package.json

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

### Step 2：更新 server.js

```bash
cat > server.js << 'SERVEREOF'
const express = require('express');
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

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

// S3 Upload
app.post('/s3/upload', async (req, res) => {
  try {
    const { filename, content } = req.body;
    if (!filename || !content) {
      return res.status(400).json({ error: 'filename and content are required' });
    }
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: filename,
      Body: content,
      ContentType: 'text/plain'
    }));
    res.json({ message: 'Upload successful', bucket: BUCKET, key: filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// S3 List
app.get('/s3/files', async (req, res) => {
  try {
    const data = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
    const files = (data.Contents || []).map(f => ({ key: f.Key, size: f.Size, lastModified: f.LastModified }));
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

## 5.3 更新 Task Definition

新版本的 Task Definition 需要加入 S3 Bucket 環境變數：

```bash
cat > task-definition-v2.json << EOF
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
      "image": "$ECR_REPO:v2",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "S3_BUCKET",
          "value": "$S3_BUCKET"
        }
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

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition-v2.json \
  --region us-east-1
```

---

## 5.4 更新 ECS Service

```bash
aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service ecs-workshop-service \
  --task-definition ecs-workshop-app \
  --force-new-deployment \
  --region us-east-1
```

> 💡 `--force-new-deployment` 會強制 ECS 使用新的 Task Definition 重新部署所有 Task。ECS 會執行 Rolling Update，先啟動新 Task，確認健康後再停止舊 Task。

```bash
# 等待部署完成
aws ecs wait services-stable \
  --cluster $ECS_CLUSTER \
  --services ecs-workshop-service \
  --region us-east-1
```

---

## 5.5 測試 S3 功能

### 上傳檔案

```bash
curl -X POST http://$ALB_DNS/s3/upload \
  -H "Content-Type: application/json" \
  -d '{"filename": "hello.txt", "content": "Hello from ECS Workshop!"}'
```

預期輸出：
```json
{"message":"Upload successful","bucket":"ecs-workshop-xxx","key":"hello.txt"}
```

### 列出檔案

```bash
curl http://$ALB_DNS/s3/files
```

預期輸出：
```json
{"bucket":"ecs-workshop-xxx","fileCount":1,"files":[{"key":"hello.txt",...}]}
```

### 透過 AWS CLI 驗證

```bash
aws s3 ls s3://$S3_BUCKET/
```

---

## ❓ 常見問題

**Q: S3 上傳回傳 AccessDenied？**

確認 Task Role 具有 S3 存取權限。在 CloudFormation 模板中，`ECSTaskRole` 已配置了 `s3:GetObject`、`s3:PutObject`、`s3:ListBucket` 權限。

**Q: 環境變數沒有傳入容器？**

確認 Task Definition 中的 `environment` 欄位已正確設定，且使用的是最新版本的 Task Definition。

---

## ✅ 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| 映像推送 | `describe-images` | 看到 v2 標籤 |
| Task Definition | `describe-task-definition` | revision: 2，含 S3_BUCKET 環境變數 |
| S3 上傳 | `curl POST /s3/upload` | Upload successful |
| S3 列表 | `curl GET /s3/files` | 顯示已上傳的檔案 |

```bash
cd ..
```

前往 [Lab 6 - 資料庫儲存整合（RDS）](./lab6-rds-integration.md) ▶
