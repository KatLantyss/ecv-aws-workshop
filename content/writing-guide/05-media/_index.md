---
title: 媒體嵌入
order: 6
---

# 媒體嵌入

## 圖片

使用標準 Markdown 圖片語法，相對路徑會自動解析到頁面所在目錄：

```markdown
![架構圖](guidance-arch.png)
```

實際效果：

![架構圖](guidance-arch.png)

## 影片

支援 YouTube 連結，自動轉換為嵌入式播放器：

```markdown
::video{src="https://www.youtube.com/watch?v=VIDEO_ID"}
::video{src="https://youtu.be/VIDEO_ID"}
```
