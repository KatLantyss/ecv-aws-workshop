---
title: AWS Console 按鈕
order: 4
---

# AWS Console 按鈕

模擬 AWS Console 介面的按鈕元件，用於在說明步驟時標示學員應該點擊的 UI 元素，讓文件視覺上貼近真實操作畫面。

:::alert{type="info"}
按鈕元件是**純展示用途**，不能點擊跳轉。若需要附連結，請改用標準 Markdown 連結或 `::button` 搭配 `variant="link"`。
:::

## 基本樣式

:::button-row
::button[Create cluster]{variant="primary"} ::button[View details]{variant="link"} ::button[Cancel]{variant="normal"}
:::

```markdown
::button[Create cluster]{variant="primary"}   ← 主要操作
::button[View details]{variant="link"}         ← 次要連結
::button[Cancel]{variant="normal"}             ← 一般動作
```

## 帶圖示

`prefix` 在文字前，`postfix` 在文字後：

:::button-row
::button[Open in new tab]{variant="link" postfix="aws-new-tab"} ::button[Refresh]{variant="link" prefix="aws-refresh"} ::button[Sign out]{variant="link" prefix="aws-sign-out"}
:::

```markdown
::button[Open in new tab]{variant="link" postfix="aws-new-tab"}
::button[Refresh]{variant="link" prefix="aws-refresh"}
```

## 純圖示按鈕

:::button-row
::button[]{variant="link" prefix="aws-refresh"} ::button[]{variant="link" prefix="aws-copy"} ::button[]{variant="link" prefix="aws-new-tab"}
:::

```markdown
::button[]{variant="link" prefix="aws-refresh"}
```

## 下拉與 Split 按鈕

:::button-row
::button[Instance state]{variant="link" dropdown} ::button[Actions]{variant="link" dropdown} ::button[Launch instances]{variant="primary" split="aws-expand"}
:::

```markdown
::button[Actions]{variant="link" dropdown}
::button[Launch instances]{variant="primary" split="aws-expand"}
```

## 按鈕列

多個按鈕並排，用 `:::button-row` 包裹：

:::button-row
::button[Launch instances]{variant="primary"} ::button[Connect]{variant="link"} ::button[Instance state]{variant="link" dropdown} ::button[Actions]{variant="link" dropdown} ::button[]{variant="link" prefix="aws-refresh"}
:::

```markdown
:::button-row
::button[Launch instances]{variant="primary"} ::button[Connect]{variant="link"}
:::
```

## 可用圖示

**AWS 自訂圖示：**

:::button-row
::button[aws-new-tab]{variant="normal" prefix="aws-new-tab"} ::button[aws-refresh]{variant="normal" prefix="aws-refresh"} ::button[aws-copy]{variant="normal" prefix="aws-copy"} ::button[aws-sign-out]{variant="normal" prefix="aws-sign-out"} ::button[aws-expand]{variant="normal" prefix="aws-expand"}
:::

`aws-info`、`aws-success`、`aws-warning`、`aws-error` 通常用於 `::status`。

**其他圖示：** 任何 [Lucide](https://lucide.dev/icons) 圖示名稱都可直接使用（如 `rocket`、`database`、`settings`）。
