---
title: Task 2 - 容器化應用
order: 3
---

# Task 2 - 容器化 Web 2048 遊戲

::badge[實作]{type="info"} ::badge[約 15-20 分鐘]{type="default"}

本 Lab 將 clone 一個開源的 2048 遊戲，建立 Dockerfile 將它打包成容器映像，並在 Command Host 上測試。

---

## 2.1 認識容器化

容器將軟體與其運行環境隔離，確保它在不同環境（開發、測試、生產）中都能一致運行。這讓應用更具可攜性和一致性。

本 Lab 使用 **Nginx** 作為 Web Server 來服務 2048 遊戲的靜態檔案。Nginx 官方提供了維護良好的 Docker 映像，省去了繁瑣的安裝設定。

---

## 2.2 Clone 2048 遊戲原始碼

在 Command Host 的 Session Manager 終端機中執行：

:::steps
1. 確認目前的工作目錄

```bash
pwd
```

2. 進入家目錄並切換至 Bash

```bash
cd ~ && bash
```

3. Clone 2048 遊戲的 GitHub Repository

```bash
git clone https://github.com/gabrielecirulli/2048
cd 2048
```

4. 確認檔案已下載

```bash
ll
```
:::

:::expand{title="預期輸出"}
```bash
total 44
-rw-rw-r--. 1 ssm-user ssm-user  1970 Apr  9 07:46 CONTRIBUTING.md
-rw-rw-r--. 1 ssm-user ssm-user  1083 Apr  9 07:46 LICENSE.txt
-rw-rw-r--. 1 ssm-user ssm-user  2350 Apr  9 07:46 README.md
-rw-rw-r--. 1 ssm-user ssm-user   300 Apr  9 07:46 Rakefile
-rw-rw-r--. 1 ssm-user ssm-user  4286 Apr  9 07:46 favicon.ico
-rw-rw-r--. 1 ssm-user ssm-user  3988 Apr  9 07:46 index.html
drwxrwxr-x. 2 ssm-user ssm-user 16384 Apr  9 07:46 js
drwxrwxr-x. 2 ssm-user ssm-user   125 Apr  9 07:46 meta
drwxrwxr-x. 3 ssm-user ssm-user    72 Apr  9 07:46 style
```
:::

---

## 2.3 建立 Dockerfile

在 2048 目錄中建立 Dockerfile：

```bash
cat > Dockerfile << 'EOF'
FROM nginx:latest
COPY . /usr/share/nginx/html
EXPOSE 80
EOF
```

:::expand{title="Dockerfile 各指令說明"}
- **FROM nginx:latest** — 使用 Nginx 官方映像作為基底。Docker 會自動安裝好 Nginx 所有相依套件，省去手動設定的時間。
- **COPY . /usr/share/nginx/html** — 將 2048 遊戲的所有檔案複製到 Nginx 的預設網頁目錄，取代預設的 `index.html`。
- **EXPOSE 80** — 宣告容器開放 Port 80。後續在 ECS 建立 Service 時，會透過 ALB 將流量轉發到這個 Port。
:::

:::alert{type="info"}
Dockerfile 的檔名必須是大寫 `D` 開頭，且沒有副檔名。
:::

---

## 2.4 建置 Docker 映像

```bash
sudo docker build -t web2048 .
```

:::alert{type="warning"}
指令最後的 `.` 不要漏掉，它代表使用當前目錄作為 build context。
:::

:::expand{title="預期輸出"}
```
[+] Building 6.6s (7/7) FINISHED
 => [internal] load build definition from Dockerfile
 => [1/2] FROM docker.io/library/nginx:latest
 => [2/2] COPY . /usr/share/nginx/html
 => exporting to image
 => => naming to docker.io/library/web2048
```
:::

確認映像已建立：

```bash
sudo docker images
```

預期看到 `web2048` 映像，大小約 143MB。

---

## 2.5 驗證映像

:::steps
1. 啟動容器

```bash
sudo docker run -d -p 80:80 --name test-2048 web2048
```

2. 在 Command Host 上測試

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost
```

預期輸出：`200`
:::

測試完成後，停止並移除容器：

```bash
sudo docker stop test-2048 && sudo docker rm test-2048
```

---

## 完成檢查

| 項目 | 驗證方式 | 預期結果 |
|------|----------|----------|
| Git Clone | `ll` | 看到 index.html、js、style 等檔案 |
| Docker Build | `sudo docker images` | 看到 web2048 映像 |
| 驗證 | `curl localhost` | HTTP 200 |

:::alert{type="success"}
容器映像已就緒，前往下一節將映像推送至 Amazon ECR。
:::
