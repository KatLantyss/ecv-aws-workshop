---
title: Task 3-1 - 透過 Kiro 建立基礎 FileUpload 專案（前後端分離）
order: 3
---

# 透過 Kiro 建立基礎 FileUpload 專案（前後端分離）

### 前置作業

▶️  開啟 Kiro IDE

![截圖 2026-03-03 上午10.08.16.png](./img/%E6%88%AA%E5%9C%96_2026-03-03_%E4%B8%8A%E5%8D%8810.08.16.png)
![1772519235266.jpg](./img/1772519235266.jpg)

### 透過 Kiro 開發 FileUpload 程式專案

▶️ 了解目標

```mermaid
graph LR
    A[使用者] -->|操作| B[Frontend<br/>Angular]
    B -->|API 請求| C[Backend<br/>.NET Core]
    C -->|存取| D[檔案系統<br/>uploads]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#e8f5e9
    style D fill:#f3e5f5
```

```mermaid
sequenceDiagram
    actor User as 使用者
    participant FE as Frontend<br/>(Angular)
    participant BE as Backend API<br/>(.NET Core)
    participant FS as 檔案系統<br/>(uploads)

    Note over User,FS: 1. 身份驗證流程
    User->>FE: 輸入帳號密碼
    FE->>BE: POST /api/auth/login<br/>{username, password}
    BE->>BE: 驗證帳號密碼
    alt 驗證成功
        BE->>FE: 200 OK<br/>{token, username}
        FE->>FE: 儲存 JWT Token 至 localStorage
        FE->>User: 導向檔案管理頁面
    else 驗證失敗
        BE->>FE: 401 Unauthorized
        FE->>User: 顯示錯誤訊息
    end

    Note over User,FS: 2. 檔案上傳流程
    User->>FE: 選擇檔案並點擊上傳
    FE->>FE: 從 localStorage 取得 Token
    FE->>BE: POST /api/files/upload<br/>Header: Authorization: Bearer {token}<br/>Body: FormData(file)
    BE->>BE: 驗證 JWT Token
    alt Token 有效
        BE->>FS: 儲存檔案<br/>(時間戳記_檔名)
        FS-->>BE: 儲存成功
        BE->>FE: 200 OK<br/>{message, fileName, size}
        FE->>User: 顯示上傳成功訊息
        FE->>BE: GET /api/files/list<br/>Header: Authorization: Bearer {token}
        BE->>FS: 讀取檔案清單
        FS-->>BE: 回傳檔案資訊
        BE->>FE: 200 OK<br/>[{name, size, uploadDate}]
        FE->>User: 更新檔案清單
    else Token 無效或過期
        BE->>FE: 401 Unauthorized
        FE->>User: 導向登入頁面
    end

    Note over User,FS: 3. 檔案下載流程
    User->>FE: 點擊下載按鈕
    FE->>FE: 從 localStorage 取得 Token
    FE->>BE: GET /api/files/download/{fileName}<br/>Header: Authorization: Bearer {token}
    BE->>BE: 驗證 JWT Token
    alt Token 有效且檔案存在
        BE->>FS: 讀取檔案
        FS-->>BE: 回傳檔案內容
        BE->>FE: 200 OK<br/>Content-Type: application/octet-stream<br/>檔案二進位資料
        FE->>User: 瀏覽器下載檔案
    else Token 無效
        BE->>FE: 401 Unauthorized
        FE->>User: 導向登入頁面
    else 檔案不存在
        BE->>FE: 404 Not Found
        FE->>User: 顯示錯誤訊息
    end

    Note over User,FS: 4. 登出流程
    User->>FE: 點擊登出按鈕
    FE->>FE: 清除 localStorage 中的 Token
    FE->>User: 導向登入頁面
```

▶️  透過 Vibe-coding 輸入以下提示詞

```json
請幫我建立一個前後端分離的 FileUpload 的簡易系統，Frontend使用 Angular，BackendAPI使用 .NET Core，共2份專案，每份專案包含README.md說明文件。

1) Frontend 與 BackendAPI 有一個基本的JWT身份驗證機制，提供使用者進行登入/登出，初始帳號及密碼設置於BackendAPI的配置檔，初始帳號為admin。
2) Frontend 透過 FORM POST 向 BackendAPI 上傳檔案，BackendAPI將檔案存於暫存資料夾。
3) Frontend 透過 GET 請求，向 BackendAPI 讀取檔案清單，呈現於列表畫面，提供使用者下載檔案。
```

![截圖 2026-03-04 上午10.08.54.png](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.08.54.png "▶️  引導 Kiro 完成工作")
![創建資料夾](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.09.43.png "創建資料夾")

![確認是否已安裝 ng, donet](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.10.33.png "確認是否已安裝 ng, donet")
![協助 kiro 完成 command 並取得回傳](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.12.00.png "協助 kiro 完成 command 並取得回傳")
![等待 kiro 撰寫程式碼](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.13.25.png "等待 kiro 撰寫程式碼")

![檢驗 kiro 完成的程式專案，並且補充安裝依賴套件 (例如 donet sdk)](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.15.20.png "檢驗 kiro 完成的程式專案，並且補充安裝依賴套件 (e.g. donet sdk)")

![Backend](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.18.20.png "Backend")

![Frontend](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.19.12.png "Frontend")



![Backend 啟動成功](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.30.29.png "Backend 啟動成功")
![Frontend 啟動成功](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.30.48.png "Frontend 啟動成功")

### 驗證專案成果

> 通常需要檢驗結果，並且回報錯誤給Kiro，引導它進一步完善程式專案。
> 

![截圖 2026-03-04 上午10.31.25.png](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.31.25.png)

![截圖 2026-03-04 上午10.31.47.png](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.31.47.png)

![測試檔案上傳](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.32.44.png "測試檔案上傳")
![檢查 uploads 資料夾（成功）](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.34.05.png "檢查 uploads 資料夾（成功）")
![測試下載功能（成功）](./img/1772592993132.jpg "測試下載功能（成功）")

💡完成驗證 Kiro 的程式專案

[https://github.com/richguosa/FileUploadProject](https://github.com/richguosa/FileUploadProject)

- 紀錄 Kiro Credits 使用率
    
    ![截圖 2026-03-04 上午10.54.58.png](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8810.54.58.png)
### 建立 Kiro Steering

![1772595011314.jpg](./img/1772595011314.jpg)

![截圖 2026-03-04 上午11.32.09.png](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%8811.32.09.png)