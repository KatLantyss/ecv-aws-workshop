---
title: Task 3-3 - 將容器快速部署於 EC2
order: 5
---

# 透過 Kiro 將 FileUpload 容器映像快速部署於 EC2

## Prerequisite

:::alert{type="warning"}
開始前請確認已完成 Task 3-2：將 FileUpload 專案容器化並推送至 Amazon ECR，且已在 Kiro 的 terminal 完成 `aws configure sso` 驗證。
:::

---

## 部署任務

繼容器映像推送至 ECR 之後，於 Kiro Session 裡繼續輸入以下提示詞，請 Kiro 協助部署：

```
1) 我已將 Docker Image 推送至 ECR

2) 請協助我啟動 1 台 EC2 實例於 Tokyo 地區，AMI 選擇 Amazon Linux 2023，Instance Type 選擇 t3.medium，並且透過 user data 預設安裝 docker

3) EC2 的 key 命名為 my-fileupload-ec2-key

4) 將 EC2 建立於 vpc-0b040f4f3d7b5ef01 的 workload-subnet-public1-ap-northeast-1a 公有子網，選擇 Auto-assign public IP

5) EC2 的 security group 命名為 my-fileupload-sg

6) EC2 的 Instance Profile 需要具備 ECR 的 Pull Image 權限

7) 透過 ssh 將 #docker-compose.yaml 複製到 EC2 實例內，並且啟動 backend & frontend 應用，最終告訴我可以訪問的 URL 位置

8) 終端機執行過程，只需要一個 terminal 視窗，請不要新的指令就重啟新terminal視窗，避免需要重複 aws configure sso 登入
```

:::steps
1. Kiro 先檢查網路是否存在，然後開始建立 EC2 Key Pair 金鑰

   ![建立 EC2 Key Pair](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.16.58.png)
   ![建立 Key Pair 進行中](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.19.01.png "Kiro 先檢查網路是否存在，然後開始建立 EC2 Key Pair 金鑰")

2. 建立 Security Group 安全群組

   ![建立 Security Group](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.19.56.png "開始創建 Security Group 安全群組")

3. 建立 EC2 實例

   ![建立 EC2 實例](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.21.17.png "開始創建 EC2 實例")

4. 至 AWS Console 確認 EC2 已建立完成

   ![EC2 建立完成](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.22.06.png "檢查 AWS Console - EC2 已建立完成")

5. 執行 SSH 連線指令

   ![SSH 連線](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.23.35.png "繼續執行 ssh 連線指令")

6. 透過 SCP 複製 docker-compose 檔案到 EC2

   ![SCP 複製檔案](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.24.05.png "透過 scp 複製 docker-compose 檔案到 EC2")

7. 設定 EC2 Instance Profile（配置 ECR Pull Image 權限）

   ![設定 Instance Profile](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.28.56.png "設定 EC2 Instance Profile（配置 ECR Pull Image 權限）")

8. 成功運行 docker-compose.yaml

   ![docker-compose 啟動成功](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.44.30.png "成功運行 docker-compose.yaml 檔案")
:::

---

## 驗證結果

:::steps
1. 前往 AWS Console → EC2，複製 Public IP

   ![複製 Public IP](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.45.20.png "前往 AWS Console - EC2，複製 Public IP")

2. 用瀏覽器訪問 FileUpload 網頁

   ![訪問 FileUpload 網頁](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.45.52.png "訪問 FileUpload 網頁")

3. 確認功能正常

   ![功能確認](./img/%E6%88%AA%E5%9C%96_2026-03-31_%E4%B8%8A%E5%8D%8811.46.18.png)
:::

:::alert{type="success"}
部署完成！可直接下載完成品參考：[GitHub - richguosa/FileUploadProject (feat/push-ecr-deploy-ec2)](https://github.com/richguosa/FileUploadProject/tree/feat/push-ecr-deploy-ec2#)
:::
