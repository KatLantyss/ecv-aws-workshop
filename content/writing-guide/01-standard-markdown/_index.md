---
title: Markdown 速查
order: 1
---

# Markdown 速查

標準 GFM 語法速查，以及本框架特有的程式碼擴充。

## 文字格式

| 效果 | 語法 |
|------|------|
| **粗體** | `**文字**` |
| *斜體* | `*文字*` |
| ~~刪除線~~ | `~~文字~~` |

## 清單

```markdown
- 無序清單
  - 巢狀項目

1. 有序清單
2. 第二項

- [x] 已完成（Task list）
- [ ] 未完成
```

## 引用

> 適合用來標示重要提醒或背景說明。

```markdown
> 引用文字
```

:::alert{type="info"}
需要更醒目的提示請改用 `:::alert` 或 `:::banner`，請參考「提示框與標籤」章節。
:::

## 表格

| 服務 | 類型 | 用途 |
|------|------|------|
| EC2 | 運算 | 虛擬伺服器 |
| S3 | 儲存 | 物件儲存 |
| RDS | 資料庫 | 關聯式資料庫 |

```markdown
| 欄位一 | 欄位二 |
|--------|--------|
| 內容   | 內容   |
```

## 程式碼

**行內程式碼** — 一般顯示用：

`aws s3 ls`

```markdown
`aws s3 ls`
```

**可複製行內程式碼** — 雙 backtick，點擊即複製到剪貼簿：

``aws sts get-caller-identity``

```markdown
``aws sts get-caller-identity``
```

**程式碼區塊** — 自動語法高亮 + 右上角複製按鈕：

```bash
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=workshop"
```

````markdown
```bash
程式碼內容
```
````

常用語言識別字：`bash`、`python`、`json`、`yaml`、`javascript`、`typescript`、`hcl`、`sql`

## 分隔線

---

```markdown
---
```

## 圖片與影片

圖片與影片嵌入請參考「[媒體嵌入](#writing-guide/05-media)」章節，其中說明了相對路徑的解析規則。
