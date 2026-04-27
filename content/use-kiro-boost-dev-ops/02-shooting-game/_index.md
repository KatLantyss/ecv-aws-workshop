---
title: Task 2 - 開發 Shooting Game
order: 1
---

# 透過 Kiro 開發一個 Shooting Game

:::banner{type="info"}
預計完成時間：**30 ~ 40 分鐘**
:::

## Prerequisites

- 已安裝 [Kiro IDE](https://kiro.dev/downloads/)
- 已準備 Kiro 帳號（Org Identity 或是 Builder ID）
- 已安裝 [uv](https://docs.astral.sh/uv/getting-started/installation/)（用於 MCP Servers）
- 已安裝 [AWS CDK](https://docs.aws.amazon.com/zh_tw/cdk/v2/guide/getting-started.html)

---

## Vibe Coding vs. Spec Coding

![Vibe Coding vs Spec Coding](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8B%E5%8D%882.06.48.png)

---

## 前置作業

:::steps
1. 本地先創建一個 `MyShootingGame` 的資料夾

   ![建立資料夾](./img/1772503505456.jpg)

2. 開啟 Kiro 編輯器

   ![開啟 Kiro](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8810.08.16.png)

3. 透過 Kiro 開啟 MyShootingGame 專案，確認右邊出現 Vibe / Spec 的選單

   ![確認右邊出現 Vibe / Spec 的選單](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8810.09.13.png "確認右邊出現 Vibe / Spec 的選單")
:::

---

## Exercise - Vibe

:::alert{type="info"}
使用 Vibe 模式快速生成一個 Web-based Shooting Game。
:::

輸入以下 Prompt：

```
Please help me to build a web-based shooting game use keyboard control, including a quick instruction page
```

![1. 使用 Vibe  2. 模型選用 Claude Sonnet 4.5  3. 貼上 Prompt](./img/1772503924173.jpg "1. 使用 Vibe  2. 模型選用 Claude Sonnet 4.5  3. 貼上 Prompt")

![等待 Kiro 生成](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8810.13.26.png)

如果有缺少 README.md，可直接請 Kiro 撰寫：

![請 Kiro 補充 README.md](./img/1772504181793.jpg)

![README.md 完成](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8810.16.50.png)

![Kiro 透過 WASD 按鍵作為移動指令。但實測發現 D 無法往右走，這沒關係，都可以隨時修正。](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8810.23.40.png "Kiro 透過 WASD 按鍵作為移動指令。但實測發現 D 無法往右走，這沒關係，都可以隨時修正。")

### Bug Fixing

```
I want to move with arrow keys, not WASD
```

![Bug Fixing](./img/1772504704591.jpg)

### Feature Development

```
I hope this game can have a health bar and a rating system.
```

![新增 Health Bar](./img/1772504948638.jpg)

![新增 Rating System](./img/1772505001790.jpg)

---

## Exercise - Steering

:::alert{type="info"}
Steering Docs 是 Kiro 的專案規範文件，讓 AI 在整個專案中保持一致的開發風格與規則。
:::

![什麼是 Steering Docs](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8811.07.18.png "什麼是 Steering Docs？")

:::steps
1. 點選 Generate Steering Docs

   ![點選 Generate Steering Docs](./img/1772506973879.jpg)

2. 確認生成結果

   ![Steering Docs 生成完成](./img/1772507087741.jpg)
:::

---

## Exercise - Spec

:::alert{type="info"}
Spec Coding 透過三個核心文件（requirements.md、design.md、tasks.md）引導 AI 進行結構化開發。
:::

![Spec coding 的主要三個檔案](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8811.24.35.png "Spec coding 的主要三個檔案")

![在 Requirements.md 描述 Acceptance Criteria 時的技巧](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8811.28.09.png "在 Requirements.md 描述 Acceptance Criteria 時的技巧")

輸入以下 Prompt 開始 Spec Coding：

```
Create a more comprehensive modern web-based shooting application with following high-level requirements:

1) A healthy bar or status of enemies for user to understand how many time left to take it down 
2) Allow user to select different character, please refer to 1) Annabelle  2) joker 3) Jason Voorhees.
3) Implement a power-up system , add some random items temporarily power up the character. Such as shooting more fast, or shooting more wide, please create 6 different items, the more special the better, also include explanation of the power up items
```

![在中間貼上 Spec-Coding 的提示詞](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8811.20.37.png "在中間貼上 Spec-Coding 的提示詞")

![Kiro 開始產出 Spec-Coding](./img/1772507769151.jpg)

:::steps
1. 開始產出 requirements.md

   ![開始產出 Spec-Coding（requirements.md）](./img/1772508112006.jpg "開始產出 requirements.md")

2. 檢視 requirements.md 並稍作調整，確認後點擊 **Move to design phase**

   ![Move to design phase](./img/1772508207084.jpg "檢視 requirements.md 並點擊 Move to design phase")

3. 開始撰寫 design.md

   ![開始撰寫 design.md](./img/1772508899511.jpg)

4. 檢視 design.md 並稍作調整，確認後點擊 **Move to implementation plan**

   ![Move to implementation plan](./img/1772509081860.jpg "檢視 design.md 並點擊 Move to implementation plan")

5. 回饋 **looks good to me** 讓 Kiro 繼續產出 tasks.md

   ![回饋 looks good to me](./img/1772509306812.jpg "記得先回饋給 Kiro：looks good to me")

6. 選擇 Opt. A，開始執行 Task 1，完成後進行本地測試

   ![開始執行 Task 1](./img/1772509886335.jpg "選擇 Opt. A，開始執行 Task 1")
:::

本地驗證 Task 1：

![本地測試結果 1](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8811.53.34.png)
![本地測試結果 2](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.05.05.png)
![本地測試結果 3](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.05.37.png)
![本地測試結果 4](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.05.47.png)
![本地測試結果 5](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.05.53.png)

本地驗證完成後，繼續執行 Task 2：

![執行 Task 2](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.06.57.png)
![Task 2 進行中](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.08.20.png)

![發現選擇不同角色，箭頭有不同的視覺呈現效果](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.08.39.png "發現選擇不同角色，箭頭有不同的視覺呈現效果")

本地驗證完成後，執行 Run all tasks 並等待完成：

![Run all tasks](./img/1772511014095.jpg)

![需要 Follow 並且隨時與 Kiro 互動，協助它完成驗證並且讓 Kiro 繼續下一個 Task。](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.11.11.png "需要 Follow 並且隨時與 Kiro 互動，協助它完成驗證並且讓 Kiro 繼續下一個 Task。")

![最終結果 1](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.40.11.png)
![最終結果 2](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.46.40.png)
![最終結果 3](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.46.56.png)
![最終結果 4](./img/fab04450-5c94-4bde-97ca-e62c0d912101.png)
![最終結果 5](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%AD%E5%8D%8812.51.27.png)

:::alert{type="warning"}
全部執行完成將會花費數小時，因此可以在恰當的時機點執行 Cancel，完成 Kiro 開發的初體驗。
:::

---

## Exercise - MCP

:::alert{type="warning"}
Before you start this exercise, please make sure you have installed the `uv` command. To verify:
:::

```bash
uv self version
```

![確認 uv 已安裝](./img/1772514216838.jpg)

本次 Workshop 將加入以下三個 MCP Servers：

- **AWS Documentation MCP Server** — 存取 AWS 官方文件、搜尋內容與取得建議
- **AWS Diagram MCP Server** — 使用 Python diagrams 套件產生 AWS 架構圖、流程圖等
- **AWS CDK MCP Server** — 提供 CDK 最佳實踐、IaC 模式與 CDK Nag 安全合規建議

將以下設定加入 Kiro 的 MCP 設定檔：

```json
{
  "mcpServers": {
    "awslabs.aws-documentation-mcp-server": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR",
        "AWS_DOCUMENTATION_PARTITION": "aws"
      },
      "disabled": false,
      "autoApprove": []
    },
    "awslabs.cdk-mcp-server": {
      "command": "uvx",
      "args": ["awslabs.cdk-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": ["GetAwsSolutionsConstructPattern"]
    },
    "awslabs.aws-diagram-mcp-server": {
      "command": "uvx",
      "args": ["awslabs.aws-diagram-mcp-server"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": ["list_icons", "generate_diagram", "get_diagram_examples"]
    }
  }
}
```

![MCP 設定完成](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8B%E5%8D%881.06.13.png)

:::alert{type="info"}
AWS 有提供非常多個 MCP Servers，可參考：[Welcome to Open Source MCP Servers for AWS](https://awslabs.github.io/mcp/)
:::

---

## (Optional) Exercise - Hooks

我們希望透過 Agent Hooks 監控 CDK 資源檔案的變更，並自動使用 AWS Diagram MCP Server 產生架構圖。

輸入以下 Prompt 建立 Hook：

```
1) Analyze the modified CDK files and generate or update AWS service architecture diagrams using the Python diagrams package DSL.
2) Parse the CDK code to identify AWS services, their relationships, and data flow.
3) If the previous diagram not exist, create a visual representation showing the infrastructure components, connections, and dependencies. Include proper grouping for VPCs, subnets, and logical service boundaries.
4) delete the previous diagram before create new one. Output the Python diagrams code that can be executed to generate the architecture diagram.
```

![建立 Hook](./img/1772516439106.jpg)

![Hook 設定完成](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8B%E5%8D%881.43.04.png)

---

## (Optional) Exercise - AWS 部署 Spec

為 Web-based Shooting Game 建立一個新的 Spec，規劃 AWS 部署架構：

```
I have a web-based shooting application need to deploy to AWS Cloud. Create a comprehensive AWS architecture with following high-level requirements:
1) Must use AWS serverless services, such as Cloudfront, S3, etc..
2) Follow each service's configuration best practice
3) Prefer to use Infrasturce as Code solution to deploy, such as AWS CDK.
4) Since we are in demo, please do not add any new feature for the game.
```

![AWS 部署 Spec 1](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8B%E5%8D%881.47.39.png)
![AWS 部署 Spec 2](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8B%E5%8D%881.49.53.png)

參考範例：[Kiro Spec Workshop on GitHub](https://github.com/lyhsiang/AWS-Kiro-Workshops/blob/main/Spec-Coding/Kiro-Spec-Workshop.md)
