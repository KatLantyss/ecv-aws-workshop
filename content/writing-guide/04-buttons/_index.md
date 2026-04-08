---
title: Button 按鈕
order: 5
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

`icon` 放文字前方，`postfix` 放文字後方：

:::button-row
::button[開新分頁]{variant="link" icon="new-tab"} ::button[Add session]{variant="link" postfix="new-tab"} ::button[登出]{variant="link" icon="sign-out"}
:::

```markdown
::button[開新分頁]{variant="link" icon="new-tab"}
::button[Add session]{variant="link" postfix="new-tab"}
```

## 純圖示按鈕

:::button-row
::button[]{variant="link" icon="refresh"} ::button[]{variant="link" icon="copy"}
:::

```markdown
::button[]{variant="link" icon="refresh"}
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
::button[Launch instances]{variant="primary" split="expand"} ::button[Add session]{variant="link" postfix="new-tab" split="expand"}
:::

```markdown
::button[文字]{variant="primary" split="expand"}
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

`sign-out`、`new-tab`、`refresh`、`expand`、`info`、`success`、`warning`、`error`、`copy`
