---
title: Badge、Status、Alert 與 Banner
order: 2
---

# Badge、Status、Alert 與 Banner

## Badge 標籤

行內標籤，適合標示難度、時間、狀態等：

::badge[Hands-on]{type="info"} ::badge[約 2 小時]{type="default"} ::badge[初級]{type="success"} ::badge[注意]{type="warning"} ::badge[已棄用]{type="danger"}

```markdown
::badge[文字]{type="info"}
::badge[文字]{type="success"}
::badge[文字]{type="warning"}
::badge[文字]{type="danger"}
::badge[文字]{type="default"}
```

---

## Status 狀態文字

行內帶 icon 的狀態文字，適合標示資源狀態：

::status[Attached]{type="success" icon="aws-success"}
::status[Warning]{type="warning" icon="aws-warning"}
::status[Failed]{type="danger" icon="aws-error"}
::status[Available]{type="info" icon="aws-info"}

```markdown
::status[Attached]{type="success" icon="aws-success"}
::status[Warning]{type="warning" icon="aws-warning"}
::status[Failed]{type="danger" icon="aws-error"}
::status[Available]{type="info" icon="aws-info"}
```

icon 可以用任何 [Lucide](https://lucide.dev/icons) 圖示名稱或 `aws-` 前綴的自訂圖示。

---

## Alert 提示框

四種類型，全邊框樣式，支援內部 Markdown 語法：

:::alert{type="info"}
**資訊提示** — 用來補充說明或提供背景知識。支援 `行內程式碼` 和 [連結](https://example.com)。
:::

:::alert{type="warning"}
**警告提示** — 提醒使用者注意潛在風險，例如可能產生費用的操作。
:::

:::alert{type="success"}
**成功提示** — 確認步驟已完成或驗證通過。
:::

:::alert{type="danger"}
**危險提示** — 標示不可逆的操作或嚴重錯誤。
:::

```markdown
:::alert{type="info"}
提示內容，支援 **Markdown**。
:::
```

---

## Banner 橫幅

填滿背景色 + 白色文字的橫幅，適合模擬 AWS Console 的通知訊息：

:::banner{type="info"}
Service deployment is in progress. It takes a few minutes.
:::

:::banner{type="success"}
Service 已成功部署，所有 Task 狀態為 Running。
:::

:::banner{type="warning"}
目前使用的映像版本較舊，建議更新至最新版本。
:::

:::banner{type="danger"}
Service 部署失敗，請檢查 Task Definition 設定。
:::

````markdown
:::banner{type="info"}
橫幅內容，支援 **Markdown**。
:::
````

與 Alert 的差異：Alert 是邊框樣式（淺色背景），Banner 是填滿樣式（深色背景 + 白色文字），視覺上更醒目。
