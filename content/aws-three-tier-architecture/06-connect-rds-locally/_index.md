---
title: Lab 6 - 從本地 pgAdmin 連線 private RDS
order: 7
---

# 從本地 pgAdmin 連線 private RDS

:::banner{type="info"}
預計完成時間：**15 ~ 20 分鐘**
:::

:::alert{type="info"}
RDS 部署在 Private Subnet 內，無法直接從本地連線。以下提供兩種方式透過安全通道連線至 RDS。
:::

---

## 方式選擇

:::tabs
::tab[方式 A — Bastion Host SSH Tunnel]

> 透過 Bastion Host 建立 SSH Tunnel 連線 RDS

### 建立 Bastion 實例

:::steps
1. 建立一台 EC2 作為 Bastion Host，放置於 Public Subnet

   ![建立 Bastion](./img/image.png)

   ![Bastion 設定](./img/image_1.png)

   ![選擇 AMI](./img/image_2.png)

   ![網路設定](./img/image_3.png)

   ![Security Group](./img/image_4.png)

   ![確認建立](./img/image_5.png)

   ![Bastion 建立完成](./img/image_6.png)
:::

### 設定 Security Group (ec2-rds-1)

:::alert{type="warning"}
需要確保 RDS 的 Security Group 允許來自 Bastion 的連線（Port 5432）。
:::

![設定 Security Group](./img/image_7.png)

![新增 Inbound Rule](./img/image_8.png)

### 本地透過 SSH 建立 Tunnel 連線

```bash
# 將 key 修改為唯讀權限
chmod 400 ./your.pem

# 建立 SSH Tunnel
ssh -i ./your.pem -N -L 8182:<rds-dns-name>:5432 ec2-user@<bastion-public-ip> -v
```

![SSH Tunnel 建立成功](./img/image_9.png)

### 本地透過 pgAdmin 連線 RDS

:::steps
1. 開啟 pgAdmin，新增 Server

   ![新增 Server](./img/image_10.png)

2. 設定連線資訊（Host: `localhost`、Port: `8182`）

   ![設定連線資訊](./img/image_11.png)

3. 確認連線成功

   ![連線成功](./img/image_12.png)
:::

::tab[方式 B — Session Manager Port Forwarding]

> 透過 AWS Systems Manager Session Manager 建立 Port Forwarding 連線 RDS（無需 Bastion Host）

### 先決條件

:::alert{type="warning"}
請確認以下工具已安裝：
:::

1. 已安裝 AWS CLI
2. 已完成 AWS SSO 驗證
3. 已安裝 Session Manager Plugin

:::expand{title="安裝 Session Manager Plugin（以 Ubuntu/WSL 為例）"}
```bash
# 1. 下載最新版本的 Debian 安裝包
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" -o "session-manager-plugin.deb"

# 2. 執行安裝
sudo dpkg -i session-manager-plugin.deb

# 3. 安裝完後可以刪除安裝檔
rm session-manager-plugin.deb

# 4. 測試是否成功安裝
session-manager-plugin
```
:::

:::expand{title="如何在本地電腦配置 AWS SSO 驗證"}

**配置 SSO**

```bash
aws configure sso
```

![配置 SSO](./img/sso-image.png)

![SSO 設定](./img/sso-image-1.png)

![瀏覽器驗證](./img/sso-image-2.png)

![驗證完成](./img/sso-image-3.png)

**登入**

```bash
aws sso login
```

![SSO 登入](./img/sso-image-4.png)

![登入成功](./img/sso-image-5.png)

**測試**

```bash
aws s3 ls
```

![測試成功](./img/sso-image-6.png)
:::

### 建立 Port Forwarding 連線

```bash
aws ssm start-session \
    --target i-xxxxxxxxxxxxxxxxx \
    --document-name AWS-StartPortForwardingSessionToRemoteHost \
    --parameters '{"host":["your-rds-endpoint.region.rds.amazonaws.com"],"portNumber":["5432"],"localPortNumber":["8181"]}'
```

![成功建立連線](./img/ssm-image.png "成功建立連線，本地 GUI 將可以連線到 private RDS endpoint")

### 本地透過 pgAdmin 連線 RDS

:::steps
1. 開啟 pgAdmin，新增 Server

   ![新增 Server](./img/image_10.png)

2. 設定連線資訊（Host: `localhost`、Port: `8181`）

   ![設定連線資訊](./img/ssm-image-1.png)

3. 確認連線成功

   ![連線成功](./img/image_12.png)
:::

:::

:::alert{type="success"}
已成功從本地 pgAdmin 連線至 Private Subnet 內的 RDS 資料庫。
:::
