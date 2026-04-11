---
title: 媒體嵌入
order: 5
---

# 媒體嵌入

## 圖片

圖片直接放在**頁面資料夾**下，用相對路徑引用：

```
content/
└── my-workshop/
    └── 01-intro/
        ├── _index.md       ← 這個頁面
        └── architecture.png
```

```markdown
![架構圖說明](architecture.png)
```

:::alert{type="info"}
相對路徑會自動解析到當前頁面所在的目錄。若圖片放在 workshop 根目錄，需要加上路徑前綴，例如 `../architecture.png`。
:::

實際效果：

![架構圖範例](guidance-arch.png)

也支援外部圖片 URL：

```markdown
![AWS Logo](https://example.com/image.png)
```

## 影片

支援 YouTube 連結，自動轉換為嵌入式播放器：

```markdown
::video{src="https://www.youtube.com/watch?v=VIDEO_ID"}
::video{src="https://youtu.be/VIDEO_ID"}
```

效果：

::video{src="https://www.youtube.com/watch?v=mUL0ABssVKo"}