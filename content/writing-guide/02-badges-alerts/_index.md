---
title: 提示框與標籤
order: 2
---

# 提示框與標籤

## 選用指南

| 元件 | 用途 | 位置 |
|------|------|------|
| `:::alert` | 步驟旁的重要提示、警告、費用說明 | 區塊，獨立一行 |
| `:::banner` | 模擬 AWS Console 的通知橫幅 | 區塊，獨立一行 |
| `::badge` | 頁面標題旁的標籤（難度、時間、狀態） | 行內 |
| `::status` | 說明資源當前狀態（Running、Failed…） | 行內 |

---

## Alert 提示框

Lab 最常用的元件，四種類型：

:::alert{type="info"}
**info** — 補充說明或背景知識，不影響操作。
:::

:::alert{type="warning"}
**warning** — 提醒注意事項，例如會產生費用的操作。
:::

:::alert{type="success"}
**success** — 確認步驟已完成或驗證通過。
:::

:::alert{type="danger"}
**danger** — 不可逆的操作或嚴重錯誤，請謹慎。
:::

內容支援完整 Markdown（粗體、程式碼、連結）：

:::alert{type="warning"}
這個步驟會建立 **NAT Gateway**，每小時約 $0.045 USD，Lab 結束後請記得在 `07-cleanup` 章節刪除。
:::

```markdown
:::alert{type="info"}
提示內容，支援 **Markdown** 和 `程式碼`。
:::
```

---

## Banner 橫幅

用來模擬 AWS Console 的通知訊息，背景填滿、白色文字，視覺比 Alert 更強烈：

:::banner{type="success"}
Service 已成功部署，所有 Task 狀態為 Running。
:::

:::banner{type="warning"}
目前使用的映像版本較舊，建議更新至最新版本。
:::

:::banner{type="danger"}
Service 部署失敗，請檢查 Task Definition 設定。
:::

:::banner{type="info"}
Deployment is in progress. This may take a few minutes.
:::

````markdown
:::banner{type="success"}
橫幅內容
:::
````

---

## Badge 標籤

行內標籤，通常放在頁面標題正下方說明難度、時間、類型：

::badge[HANDS-ON]{type="info"} ::badge[約 30 分鐘]{type="default"} ::badge[初級]{type="success"} ::badge[注意事項]{type="warning"} ::badge[已棄用]{type="danger"}

```markdown
::badge[文字]{type="info"}
::badge[文字]{type="success"}
::badge[文字]{type="warning"}
::badge[文字]{type="danger"}
::badge[文字]{type="default"}
```

---

## Status 狀態文字

行內帶 icon 的狀態文字，用於說明 AWS 資源的當前狀態：

服務狀態：::status[Running]{type="success" icon="aws-success"} 已正常啟動

任務狀態：::status[Failed]{type="danger" icon="aws-error"} 請檢查 CloudWatch Logs

```markdown
::status[Running]{type="success" icon="aws-success"}
::status[Failed]{type="danger" icon="aws-error"}
::status[Pending]{type="warning" icon="aws-warning"}
::status[Available]{type="info" icon="aws-info"}
```

`icon` 可使用 `aws-success`、`aws-warning`、`aws-error`、`aws-info`，或任何 [Lucide](https://lucide.dev/icons) 圖示名稱。
