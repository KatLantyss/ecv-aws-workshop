---
title: AWS Console 按鈕
order: 4
---

# AWS Console 按鈕

模擬 AWS Console 介面的按鈕元件，用於在說明步驟時標示學員應該點擊的 UI 元素，讓文件視覺上貼近真實操作畫面。

:::alert{type="info"}
按鈕元件是**純展示用途**，不能點擊跳轉。若需要附連結，請改用標準 Markdown 連結或 `::button` 搭配 `variant="default"`。
:::

## 基本樣式

:::button-row
::button[Create cluster]{variant="action"} ::button[View details]{variant="default"} ::button[Cancel]{variant="disabled"}
:::

```markdown
::button[Create cluster]{variant="action"}      ← 重要動作（橘色）
::button[View details]{variant="default"}        ← 動作（藍框線）
::button[Cancel]{variant="disabled"}             ← 無法動作（灰色）
```

## 帶圖示

`prefix` 在文字前，`postfix` 在文字後：

:::button-row
::button[Open in new tab]{variant="default" postfix="aws-new-tab"} ::button[Refresh]{variant="default" prefix="aws-refresh"} ::button[Sign out]{variant="default" prefix="aws-sign-out"}
:::

```markdown
::button[Open in new tab]{variant="default" postfix="aws-new-tab"}
::button[Refresh]{variant="default" prefix="aws-refresh"}
```

## 純圖示按鈕

:::button-row
::button[]{variant="default" prefix="aws-refresh"} ::button[]{variant="default" prefix="aws-copy"} ::button[]{variant="default" prefix="aws-new-tab"}
:::

```markdown
::button[]{variant="default" prefix="aws-refresh"}
```

## 下拉與 Split 按鈕

使用 `postfix="aws-expand"` 表示下拉箭頭，`split` 表示分離式按鈕：

:::button-row
::button[Instance state]{variant="default" postfix="aws-expand"} ::button[Actions]{variant="default" postfix="aws-expand"} ::button[Launch instances]{variant="action" split="aws-expand"}
:::

```markdown
::button[Actions]{variant="default" postfix="aws-expand"}
::button[Launch instances]{variant="action" split="aws-expand"}
```

## 按鈕列

多個按鈕並排，用 `:::button-row` 包裹：

:::button-row
::button[Launch instances]{variant="action"} ::button[Connect]{variant="default"} ::button[Instance state]{variant="default" postfix="aws-expand"} ::button[Actions]{variant="default" postfix="aws-expand"} ::button[]{variant="default" prefix="aws-refresh"}
:::

```markdown
:::button-row
::button[Launch instances]{variant="action"} ::button[Connect]{variant="default"}
:::
```

## 可用圖示

**AWS 自訂圖示：**

:::button-row
::button[aws-new-tab]{variant="disabled" prefix="aws-new-tab"} ::button[aws-refresh]{variant="disabled" prefix="aws-refresh"} ::button[aws-copy]{variant="disabled" prefix="aws-copy"} ::button[aws-sign-out]{variant="disabled" prefix="aws-sign-out"} ::button[aws-expand]{variant="disabled" prefix="aws-expand"}
:::

`aws-info`、`aws-success`、`aws-warning`、`aws-error` 通常用於 `::status`。

**其他圖示：** 任何 [Lucide](https://lucide.dev/icons) 圖示名稱都可直接使用（如 `rocket`、`database`、`settings`）。
