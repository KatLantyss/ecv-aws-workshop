---
title: Task 5 - 應用升級
order: 6
---

# Task 5 - 應用升級：Node.js + S3 + RDS

::badge[實作]{type="info"} ::badge[約 25-30 分鐘]{type="default"}

將純 Nginx 靜態網站升級為 Node.js 應用。靜態檔案改從 S3 載入，並加入 RDS MySQL 排行榜功能。

:::alert{type="info"}
本 Task 模擬真實開發中的需求迭代 — 從純靜態網站逐步演進為具備後端 API 的完整應用。
:::

---

## 5.1 上傳靜態檔案至 S3

將 2048 遊戲的原始靜態檔案上傳到 S3 Bucket，後續 Node.js 應用啟動時會從 S3 sync 這些檔案。

在 Command Host 終端機中執行：

```bash
cd ~/2048
aws s3 sync . s3://$S3_BUCKET/public/ \
  --exclude "Dockerfile" --exclude "*.md" --exclude "LICENSE*" \
  --exclude "Rakefile" --exclude "CONTRIBUTING*" --exclude "package.json" \
  --exclude "server.js" --exclude ".git/*"
```

驗證上傳結果：

```bash
aws s3 ls s3://$S3_BUCKET/public/
```

:::expand{title="預期輸出"}
```
                           PRE js/
                           PRE meta/
                           PRE style/
2024-01-01 00:00:00       4286 favicon.ico
2024-01-01 00:00:00       3988 index.html
```
:::

---

## 5.2 建立 Node.js 應用

在 Command Host 上建立新的應用程式碼：

:::steps
1. 回到 2048 目錄

```bash
cd ~/2048
```

2. 建立 `package.json`

```bash
cat > package.json << 'EOF'
{
  "name": "web2048-api",
  "version": "2.0.0",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "express": "^4.18.0",
    "mysql2": "^3.6.0"
  }
}
EOF
```

3. 建立 `server.js`

```bash
cat > server.js << 'SERVEREOF'
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const { execSync } = require('child_process');

const app = express();
const PORT = 80;

app.use(express.json());

// 啟動時從 S3 sync 靜態檔案
const BUCKET = process.env.S3_BUCKET;
if (BUCKET) {
  console.log(`Syncing static files from s3://${BUCKET}/public/ ...`);
  try {
    execSync(`aws s3 sync s3://${BUCKET}/public/ /app/public/`, { stdio: 'inherit' });
    console.log('S3 sync completed');
  } catch (err) {
    console.error('S3 sync failed:', err.message);
  }
}

app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', version: '2.0.0', source: 'node' });
});

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

4. 更新 Dockerfile

```bash
cat > Dockerfile << 'EOF'
FROM node:18-alpine
RUN apk add --no-cache aws-cli
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js .
RUN mkdir -p public
EXPOSE 80
CMD ["node", "server.js"]
EOF
```
:::

:::alert{type="info"}
架構變更重點：
- 映像不再打包靜態檔案，改為啟動時從 S3 sync
- 加入 `aws-cli` 以便容器內執行 `aws s3 sync`
- 加入 MySQL 驅動，連接 RDS 排行榜
- `/api/health` 端點回傳 `source: "node"` 用於驗證
:::

---

## 5.3 建置並推送新映像

```bash
sudo docker build -t web2048:v2 .
sudo docker tag web2048:v2 $ECR_REPO:node
sudo docker push $ECR_REPO:node
```

---

## 5.4 透過 Console 建立新版 Task Definition

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Task definitions** → `ecs-fargate-lab-app`

2. 點擊 ::button[Create new revision]{variant="action" postfix="aws-expand"}

3. 在 **Container - 1** 區塊：
   - 將 **Image URI** 的 tag 從 `:nginx` 改為 ``:node``（例如 `123456789012.dkr.ecr.us-east-1.amazonaws.com/ecs-fargate-lab-app:node`）
   - 展開 **Environment variables**，新增以下變數：

| Key | Value |
|-----|-------|
| ``S3_BUCKET`` | 貼上 Task 1 記錄的 S3 Bucket 名稱 |
| ``DB_HOST`` | 貼上 Task 1 記錄的 RDS Endpoint |
| ``DB_USER`` | ``admin`` |
| ``DB_PASSWORD`` | Task 1 設定的資料庫密碼 |
| ``DB_NAME`` | ``workshopdb`` |

4. 點擊 ::button[Create]{variant="action"}
:::

:::alert{type="warning"}
將資料庫密碼放在環境變數中僅適用於實驗環境。正式環境應使用 AWS Secrets Manager，並透過 Task Definition 的 **valueFrom** 欄位注入。
:::

---

## 5.5 透過 Console 更新 ECS Service

:::steps
1. 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → `ecs-fargate-lab-cluster`
2. 在 **Services** 分頁，勾選 `ecs-fargate-lab-service`
3. 點擊 ::button[Update]{variant="default" split="aws-expand"} → 選擇 **Quick service update**
4. 在 **Task definition revision** 欄位，選擇最新的 revision（數字最大的）
5. 勾選 **Force new deployment**
6. 點擊 ::button[Update]{variant="action"}
:::

等待部署完成（約 2-3 分鐘），在 **Deployments** 分頁確認新版本已完成。

---

## 5.6 驗證

### 確認遊戲仍正常（靜態檔案來自 S3）

在瀏覽器開啟 `http://<ALB_DNS>`，2048 遊戲應正常運作。

### 確認 API 端點（Node.js 後端）

```bash
curl http://$ALB_DNS/api/health -w "\n"
```

:::expand{title="預期輸出"}
```json
{"status":"healthy","version":"2.0.0","source":"node"}
```
:::

`source: "node"` 確認已從 Nginx 切換為 Node.js 後端。

### 驗證 S3 + RDS 整合

接下來展示 S3 架構的核心優勢 — 不需要重新建置映像，只需更新 S3 上的檔案並重啟 Task，即可部署前端變更。

:::steps
1. 在 Command Host 上，還原並修改 `index.html`，加入排行榜功能

```bash
cd ~/2048
git checkout index.html
sed -i 's/<title>2048<\/title>/<title>2048 - S3 Edition<\/title>/' index.html

cat > leaderboard.js << 'LBEOF'
(function(){
  var origMessage = HTMLActuator.prototype.message;
  HTMLActuator.prototype.message = function(won){
    origMessage.apply(this, arguments);
    var score = this.score;
    setTimeout(function(){
      var name = prompt((won ? "You win!" : "Game Over!") + " Score: " + score + "\nEnter your name for the leaderboard:");
      if(name){
        fetch("/api/scores",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({player:name,score:score})
        }).then(function(r){return r.json()})
          .then(function(d){alert("Score submitted! ID: "+d.id)})
          .catch(function(e){alert("Submit failed: "+e)});
      }
    }, 800);
  };
})();
LBEOF

sed -i '/leaderboard.js/!s|</body>|<script src="leaderboard.js"></script></body>|' index.html
```

2. 上傳修改後的檔案到 S3

```bash
aws s3 cp index.html s3://$S3_BUCKET/public/index.html
aws s3 cp leaderboard.js s3://$S3_BUCKET/public/leaderboard.js
```

3. 重啟 ECS Task 以載入新內容
   - 開啟 [ECS Console](https://console.aws.amazon.com/ecs/) → **Clusters** → `ecs-fargate-lab-cluster` → **Tasks** 分頁
   - 勾選任一 Task，點擊 ::button[Stop]{variant="action"}
   - 等待新 Task 變為 ::status[Running]{type="success" icon="aws-success"}

4. 在瀏覽器開啟 `http://<ALB_DNS>`，確認分頁標題已變為「2048 - S3 Edition」
5. 玩 2048 遊戲直到 Game Over，預期彈出輸入框要求輸入名稱
6. 輸入名稱後，分數自動提交至 RDS
:::

:::alert{type="info"}
整個前端更新過程不需要重新 build 映像、不需要 push ECR、不需要更新 Task Definition — 只需要更新 S3 檔案並重啟 Task。這就是內容與映像分離架構的價值。
:::

### 查看排行榜

在 Command Host 上查看排行榜資料：

```bash
curl -s http://$ALB_DNS/api/scores | python3 -m json.tool
```

:::expand{title="預期輸出"}
```json
{"count":2,"scores":[{"id":2,"player":"Bob","score":4096,"created_at":"..."},{"id":1,"player":"Alice","score":2048,"created_at":"..."}]}
```
:::

---

## 常見問題

:::expand{title="S3 sync 失敗？"}
確認 ECS Task Role（`ecs-fargate-lab-task-role`）具有 S3 讀取權限。可在 [IAM Console](https://console.aws.amazon.com/iam/) → **Roles** → `ecs-fargate-lab-task-role` 中確認。
:::

:::expand{title="連接 RDS 失敗（ETIMEDOUT）？"}
1. 確認 RDS Security Group 允許來自 ECS Security Group 的 Port 3306 流量
2. 確認環境變數 `DB_HOST` 正確設定為 RDS Endpoint
3. 可在 [RDS Console](https://console.aws.amazon.com/rds/) → **Databases** → `ecs-fargate-lab-db` 中確認
:::

:::expand{title="資料庫連線被拒絕（Access Denied）？"}
確認 `DB_USER` 和 `DB_PASSWORD` 與 CloudFormation 部署時設定的一致。
:::

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| 2048 遊戲 | 瀏覽器開啟 ALB DNS | 遊戲正常運作（內容來自 S3） |
| Health API | `curl /api/health` | `source: "node"` |
| S3 驗證 | 修改 S3 檔案 → 重啟 Task | 頁面內容更新 |
| 排行榜 | `curl /api/scores` | 顯示分數排名 |

:::alert{type="success"}
應用升級完成 — 靜態檔案從 S3 載入，排行榜資料存入 RDS。前往最後一節清除資源。
:::
