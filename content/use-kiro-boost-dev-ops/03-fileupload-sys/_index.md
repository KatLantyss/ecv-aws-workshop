---
title: Task 3 - AI 智能開發及容器化的安全檔案上傳系統
order: 2
---

# AI 智能開發及容器化的安全檔案上傳系統 (60~80 mins)

### Prerequisites

- 已安裝 [Kiro IDE](https://kiro.dev/downloads/)
- 已準備 Kiro 帳號（Org Identity 或是 Builder ID）
- **Others**
    - 已安裝 [uv](https://docs.astral.sh/uv/getting-started/installation/) (MCP Servers)
    - 已安裝 git
    - 已安裝 [AWS CDK](https://docs.aws.amazon.com/zh_tw/cdk/v2/guide/getting-started.html)
    - 已安裝 Docker

### 核心課程（FileUpload）

[透過 Kiro 建立基礎 FileUpload 專案（前後端分離）](./03-1-basic-spa/_index.md)

### ⤴️ 進階延伸課程（Containerized + EC2）*for HDRE Taipei*

> **AI智能開發容器化應用與快速部署實戰**
> 

[透過 Kiro 將 FileUpload 專案容器化 並推送至 Amazon ECR](./03-2-containerized-ecr/_index.md)

[透過 Kiro 將 FileUpload 容器映像快速部署於 EC2](./03-3-deploy-to-ec2/_index.md)

### ⤴️ 進階延伸課程（S3 + Security）*for YangMing*

> **S3 & GuardDuty 安全上傳實戰**
> 

[建置 AWS GuardDuty Malware Protection + S3 Buckets 安全檔案雲端環境](https://www.notion.so/AWS-GuardDuty-Malware-Protection-S3-Buckets-3199f60ac54e80009600c3995fccd8d4?pvs=21)

[透過 Kiro 將 FileUpload 專案串接 S3+GuardDuty Malware Protection 實現安全檔案上傳流程 (ToDo)](https://www.notion.so/Kiro-FileUpload-S3-GuardDuty-Malware-Protection-ToDo-3199f60ac54e80928ac6ce4bedf9abdd?pvs=21)