# Lab 0 - 行前準備

> ⏱ 預估時間：10 分鐘

---

## 本節目標

確認本機開發環境已安裝所有必要工具，並驗證 AWS 帳號權限正確。

---

## 0.1 安裝 AWS CLI v2

AWS CLI 是與 AWS 服務互動的命令列工具，本工作坊所有操作皆透過 CLI 完成。

**macOS（使用 pkg 安裝）：**

```bash
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

**Linux（x86_64）：**

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**驗證安裝：**

```bash
aws --version
# 預期輸出：aws-cli/2.x.x Python/3.x.x ...
```

---

## 0.2 設定 AWS Credentials

```bash
aws configure
```

依序輸入：

| 欄位 | 值 |
|------|----|
| AWS Access Key ID | 你的 Access Key |
| AWS Secret Access Key | 你的 Secret Key |
| Default region name | `us-east-1` |
| Default output format | `json` |

**驗證身份：**

```bash
aws sts get-caller-identity
```

你應該看到類似以下輸出，確認帳號與 ARN 正確：

```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

---

## 0.3 安裝 Docker

Docker 用於在本機建置容器映像，後續會推送至 Amazon ECR。

- **macOS / Windows**：下載 [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux**：參考 [Docker Engine 安裝指南](https://docs.docker.com/engine/install/)

**驗證安裝：**

```bash
docker --version
# 預期輸出：Docker version 2x.x.x, build xxxxxxx

docker info
# 確認 Docker daemon 正在運行
```

---

## 0.4 設定環境變數

為了後續 Lab 操作方便，先設定共用環境變數：

```bash
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "Region: $AWS_REGION"
echo "Account ID: $AWS_ACCOUNT_ID"
```

---

## ✅ 完成檢查

| 項目 | 指令 | 預期結果 |
|------|------|----------|
| AWS CLI | `aws --version` | v2.x.x |
| AWS 身份 | `aws sts get-caller-identity` | 顯示帳號資訊 |
| Docker | `docker --version` | v2x.x.x |
| Docker 運行 | `docker info` | 無錯誤訊息 |

全部通過後，前往 [Lab 1 - ECS 概念說明](./lab1-ecs-concepts.md) ▶
