---
title: 總覽
order: 0
---

# 打造 AWS 進階網路與安全防護

::badge[AWS]{type="info"} ::badge[進階]{type="default"} ::badge[2~3 小時]{type="default"}

*ECV Solutions Architect. FUYU GUO (Rich) - Published at 2026.01*

---

## 實作目標

本次實作旨在實踐 AWS 進階網路安全架構，核心目標包含：

- 利用 **Transit Gateway** 串連多個 VPC 環境，簡化路由管理。
- 部署 **AWS Network Firewall** 於獨立的 Inspection VPC，對跨 VPC 及對外流量進行過濾。
- 實現**集中式 Egress 控制**，確保所有工作負載必須經過安全檢查哨後，方能經由 NAT Gateway 訪問網際網路。

---

## Architecture

![打造進階網路與安全防護](./00-prerequisites/img/architecture.jpg)

---

## 課程大綱

| Lab | 預估時間 | 學習內容 |
|-----|---------|---------|
| 行前準備 | 15 mins | 安裝 aws-cli、session-manager-plugin |
| 建立虛擬網路 VPC、Subnets | 15 mins | 創建 VPC、Subnet、Route Tables、IGW、NAT Gateway |
| 建立 AWS Network Firewall | 15-20 mins | 如何創建 AWS Network Firewall |
| 變更路由並測試防火牆規則 | 15-20 mins | 如何測試 AWS Network Firewall |
| 在 Workload-VPC 創建 ALB + EC2 | 15-20 mins | 如何創建 ALB 負載均衡器、EC2 實例 |
| 創建 TGW 連通兩個 VPC | 20-25 mins | 如何配置路由、Transit Gateway 連通兩個 VPC |
| 測試 Workload-VPC 底下的 EC2 連線 | 10-15 mins | 如何測試最終結果 |

---

## 章節導覽

:::steps
1. [行前準備](./00-prerequisites/_index.md)

   ::badge[15 分鐘]{type="default"}

2. [建立虛擬網路 VPC、Subnets](./01-vpc-subnets/_index.md)

   ::badge[15 分鐘]{type="default"}

3. [建立 AWS Network Firewall 防火牆於 Inspection VPC](./02-network-firewall/_index.md)

   ::badge[15~20 分鐘]{type="default"}

4. [變更 Inspection VPC 路由，測試防火牆規則](./03-test-firewall-rules/_index.md)

   ::badge[15~20 分鐘]{type="default"}

5. [在 Workload-VPC 創建 ALB 負載均衡器 + EC2 實例](./04-workload-alb-ec2/_index.md)

   ::badge[15~20 分鐘]{type="default"}

6. [創建 TGW 連通兩個 VPC](./05-transit-gateway/_index.md)

   ::badge[20~25 分鐘]{type="default"}

7. [測試 Workload-VPC 底下的 EC2 連線](./06-final-testing/_index.md)

   ::badge[10~15 分鐘]{type="default"}
:::
