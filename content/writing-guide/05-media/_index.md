---
title: 媒體嵌入
order: 5
---

# 媒體嵌入

## 圖片

圖片直接放在頁面資料夾下，用相對路徑引用：

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

效果：

::video{src="https://www.youtube.com/watch?v=mUL0ABssVKo"}