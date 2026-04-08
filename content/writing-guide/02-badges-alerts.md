---
title: Badge 與 Alert
order: 2
---

# Badge 與 Alert

## Badge 標籤

行內標籤，適合標示難度、時間、狀態等：

::badge[Hands-on]{type="info"} ::badge[約 2 小時]{type="default"} ::badge[初級]{type="success"} ::badge[注意]{type="warning"} ::badge[已棄用]{type="danger"}

語法：

```markdown
::badge[文字]{type="info"}
::badge[文字]{type="success"}
::badge[文字]{type="warning"}
::badge[文字]{type="danger"}
::badge[文字]{type="default"}
```

---

## Alert 提示框

四種類型，支援內部 Markdown 語法：

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

語法：

```markdown
:::alert{type="info"}
提示內容，支援 **Markdown**。
:::
```
