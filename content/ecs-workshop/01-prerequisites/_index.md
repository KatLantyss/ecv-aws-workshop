---
title: Lab 0 - 行前準備
order: 1
---

# Lab 0 - 行前準備

::badge[行前準備]{type="info"} ::badge[約 10 分鐘]{type="default"}

確認本機開發環境已安裝所有必要工具，並驗證 AWS 帳號權限正確。

---

## 0.1 確認 AWS 帳號

:::steps
1. 登入 [AWS Management Console](https://console.aws.amazon.com/)
2. 確認右上角區域為 ``us-east-1`` (N. Virginia)
3. 確認帳號具備 **AdministratorAccess** 或同等權限
:::

:::alert{type="info"}
如果你使用的是公司或組織帳號，請確認你有足夠權限建立 VPC、ECS、ECR、S3、RDS、IAM Role 等資源。
:::

---

## 0.2 安裝 AWS CLI v2

AWS CLI 用於本機建置 Docker 映像後登入 ECR 並推送映像。

:::tabs
::tab[macOS]
```bash
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

::tab[Linux]
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

::tab[Windows]
從 [AWS CLI 官方頁面](https://aws.amazon.com/cli/) 下載 MSI 安裝程式並執行。
:::

驗證安裝：

```bash
aws --version
# 預期輸出：aws-cli/2.x.x Python/3.x.x ...
```

---

## 0.3 設定 AWS Credentials

```bash
aws configure
```

| 欄位 | 值 |
|------|----|
| AWS Access Key ID | 你的 Access Key |
| AWS Secret Access Key | 你的 Secret Key |
| Default region name | ``us-east-1`` |
| Default output format | ``json`` |

驗證身份：

```bash
aws sts get-caller-identity
```

:::expand{title="預期輸出範例"}
```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```
:::

---

## 0.4 安裝 Docker

Docker 用於在本機建置容器映像，後續會推送至 Amazon ECR。

:::tabs
::tab[macOS / Windows]
下載並安裝 [Docker Desktop](https://www.docker.com/products/docker-desktop/)

::tab[Linux]
參考 [Docker Engine 安裝指南](https://docs.docker.com/engine/install/)
:::

驗證安裝：

```bash
docker --version
# 預期輸出：Docker version 2x.x.x, build xxxxxxx
```

```bash
docker info
# 確認 Docker daemon 正在運行，無錯誤訊息
```

---

## 0.5 設定環境變數

為了後續 Lab 中本機操作方便，先設定共用環境變數：

```bash
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "Region: $AWS_REGION"
echo "Account ID: $AWS_ACCOUNT_ID"
```

---

## 完成檢查

| 項目 | 指令 | 預期結果 |
|------|------|----------|
| AWS CLI | ``aws --version`` | v2.x.x |
| AWS 身份 | ``aws sts get-caller-identity`` | 顯示帳號資訊 |
| Docker | ``docker --version`` | v2x.x.x |
| Docker 運行 | ``docker info`` | 無錯誤訊息 |

:::alert{type="success"}
全部通過後，前往下一節開始學習 ECS 核心概念。
:::
