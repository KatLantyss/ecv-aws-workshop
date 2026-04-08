---
title: 互動元件
order: 4
---

# 互動元件

## Expand 可展開區塊

預設收合，點擊展開：

:::expand{title="點擊展開詳細說明"}
這裡的內容預設是隱藏的，適合放補充資訊。

支援完整 Markdown：

- 列表項目
- `程式碼`

```bash
echo "展開區塊內也能放程式碼"
```
:::

:::expand{title="為什麼需要 VPC？"}
VPC（Virtual Private Cloud）提供隔離的虛擬網路環境。

- **Inbound Rules** — 控制進入的流量
- **Outbound Rules** — 控制離開的流量
:::

語法：

```markdown
:::expand{title="標題文字"}
收合的內容...
:::
```

---

## Tabs 分頁

適合展示不同平台或語言的操作步驟：

:::tabs
::tab[macOS]
```bash
brew install awscli
aws --version
```

::tab[Linux]
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

::tab[Windows]
```powershell
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
aws --version
```
:::

語法：

````markdown
:::tabs
::tab[分頁標題一]
內容...

::tab[分頁標題二]
內容...
:::
````

---

## Steps 步驟列表

自動編號的步驟：

:::steps
1. 安裝 AWS CLI
2. 執行 `aws configure` 設定認證
3. 執行 `aws sts get-caller-identity` 驗證連線
:::

語法：

```markdown
:::steps
1. 第一步
2. 第二步
3. 第三步
:::
```
