---
title: Button 按鈕
order: 4
---

# Button 按鈕

模擬 AWS Console 風格的按鈕元件。

## 基本樣式

三種 variant：

:::button-row
::button[Primary 按鈕]{variant="primary"} ::button[Link 按鈕]{variant="link"} ::button[Normal 按鈕]{variant="normal"}
:::

```markdown
::button[文字]{variant="primary"}
::button[文字]{variant="link"}
::button[文字]{variant="normal"}
```

## 帶圖示

`prefix` 放文字前方，`postfix` 放文字後方：

:::button-row
::button[開新分頁]{variant="link" prefix="aws-new-tab"} ::button[Add session]{variant="link" postfix="aws-new-tab"} ::button[登出]{variant="link" prefix="aws-sign-out"}
:::

```markdown
::button[開新分頁]{variant="link" prefix="aws-new-tab"}
::button[Add session]{variant="link" postfix="aws-new-tab"}
```

也可以用 Lucide 圖示：

:::button-row
::button[部署]{variant="primary" prefix="rocket"} ::button[資料庫]{variant="link" prefix="database"}
:::

```markdown
::button[部署]{variant="primary" prefix="rocket"}
```

## 純圖示按鈕

:::button-row
::button[]{variant="link" prefix="aws-refresh"} ::button[]{variant="link" prefix="aws-copy"}
:::

```markdown
::button[]{variant="link" prefix="aws-refresh"}
```

## 下拉按鈕

:::button-row
::button[Instance state]{variant="link" dropdown} ::button[Actions]{variant="link" dropdown}
:::

```markdown
::button[文字]{variant="link" dropdown}
```

## Split 按鈕

:::button-row
::button[Launch instances]{variant="primary" split="aws-expand"} ::button[Add session]{variant="link" postfix="aws-new-tab" split="aws-expand"}
:::

```markdown
::button[文字]{variant="primary" split="aws-expand"}
```

## 按鈕列

用 `button-row` 把多個按鈕排成一列：

:::button-row
::button[Launch instances]{variant="primary"} ::button[Connect]{variant="link"} ::button[Instance state]{variant="link" dropdown} ::button[Actions]{variant="link" dropdown}
:::

```markdown
:::button-row
::button[啟動]{variant="primary"} ::button[連線]{variant="link"}
:::
```

## 可用圖示

自訂 AWS 圖示：`aws-sign-out`、`aws-new-tab`、`aws-refresh`、`aws-expand`、`aws-info`、`aws-success`、`aws-warning`、`aws-error`、`aws-copy`

也可以直接使用任何 [Lucide](https://lucide.dev/icons) 圖示名稱。
