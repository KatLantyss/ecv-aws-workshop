---
title: 標準 Markdown
order: 1
---

# 標準 Markdown

所有 GFM（GitHub Flavored Markdown）語法都支援。

## 文字格式

**粗體文字** 、 *斜體文字* 、 ~~刪除線~~

## 列表

- 無序列表項目一
- 無序列表項目二
  - 巢狀項目

1. 有序列表項目一
2. 有序列表項目二

## 引用

> 這是一段引用區塊，適合用來標示重要提示或引述。

## 連結與圖片

```markdown
[連結文字](https://example.com)
![圖片說明](images/screenshot.png)
```

圖片使用相對路徑，會自動解析到該 workshop 目錄下。

## 表格

| 服務       | 類型     | 用途           |
|------------|----------|----------------|
| EC2        | 運算     | 虛擬伺服器     |
| S3         | 儲存     | 物件儲存       |
| DynamoDB   | 資料庫   | NoSQL 資料庫   |

## 程式碼

行內程式碼：`aws s3 ls`

可複製的行內程式碼（雙 backtick），點擊即複製到剪貼簿：``aws sts get-caller-identity``好

```markdown
`一般行內程式碼`
``點擊可複製的行內程式碼``
```

程式碼區塊會自動語法高亮並附帶複製按鈕：

```bash
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=workshop"
```

```python
import json

def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Hello'})
    }
```
