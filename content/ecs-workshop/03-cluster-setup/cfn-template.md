---
title: CloudFormation 模板說明
order: 3.1
---

# CloudFormation 模板說明

本頁補充說明 ``ecs-workshop-infra.yaml`` 模板中各資源的設計考量。

---

## VPC 網路架構

模板建立了一個跨 2 個 AZ 的 VPC，包含 Public 和 Private Subnet：

| Subnet | CIDR | 用途 |
|--------|------|------|
| Public Subnet 1 | 10.0.1.0/24 | ALB + Fargate Tasks (AZ-a) |
| Public Subnet 2 | 10.0.2.0/24 | ALB + Fargate Tasks (AZ-b) |
| Private Subnet 1 | 10.0.3.0/24 | RDS (AZ-a) |
| Private Subnet 2 | 10.0.4.0/24 | RDS (AZ-b) |

:::alert{type="info"}
Public Subnet 透過 Internet Gateway 連接外部網路，Private Subnet 則完全隔離，僅允許來自 ECS Security Group 的流量。
:::

---

## Security Group 設計

```
Internet ──▶ ALB SG (Port 80) ──▶ ECS SG (Port 3000) ──▶ RDS SG (Port 3306)
```

每一層 Security Group 只允許來自上一層的流量，形成嚴格的存取控制鏈。

---

## IAM Role 設計

模板建立了兩個 IAM Role：

:::expand{title="ECS Task Execution Role"}
- 用途：ECS Agent 使用，負責拉取 ECR 映像和寫入 CloudWatch Logs
- 附加政策：`AmazonECSTaskExecutionRolePolicy`（AWS 託管政策）
:::

:::expand{title="ECS Task Role"}
- 用途：容器內應用程式使用，存取 S3 等 AWS 服務
- 自訂政策：允許 `s3:GetObject`、`s3:PutObject`、`s3:ListBucket`
:::
