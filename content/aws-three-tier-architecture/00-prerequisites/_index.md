---
title: 行前準備 - 安裝工具
order: 1
---

# 行前準備 - 安裝工具

:::banner{type="info"}
預計完成時間：**15 分鐘**
:::

---

## Prerequisites

:::alert{type="warning"}
開始前請確認以下工具已安裝完成：
:::

- 已安裝 [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- 已安裝 [Session Manager Plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)
- 已安裝 [pgAdmin](https://www.pgadmin.org/download/)（用於連線 RDS 資料庫）
- 擁有 AWS 帳號並具備足夠權限（VPC、EC2、RDS、SSM、WAF、IAM）

---

## 目標架構

![建立企業級三層式架構](./img/architecture.jpg)

---

## 架構說明

本次實作將在單一 VPC 內橫跨兩個可用區域 (AZ) 部署以下元件：

```mermaid
graph TB
    subgraph Internet
        User[使用者]
    end
    
    subgraph AWS Cloud
        WAF[AWS WAF]
        ALB[Application Load Balancer]
        
        subgraph AZ1[Availability Zone 1]
            PubSub1[Public Subnet]
            PrivSub1[Private Subnet - App]
            PrivDB1[Private Subnet - DB]
        end
        
        subgraph AZ2[Availability Zone 2]
            PubSub2[Public Subnet]
            PrivSub2[Private Subnet - App]
            PrivDB2[Private Subnet - DB]
        end
        
        ASG[Auto Scaling Group]
        RDS[(Amazon RDS)]
    end
    
    User --> WAF --> ALB
    ALB --> PubSub1
    ALB --> PubSub2
    PubSub1 --> PrivSub1
    PubSub2 --> PrivSub2
    PrivSub1 --> ASG
    PrivSub2 --> ASG
    PrivDB1 --> RDS
    PrivDB2 --> RDS
```

:::alert{type="info"}
確認所有工具安裝完成後，即可開始進行下一個章節。
:::
