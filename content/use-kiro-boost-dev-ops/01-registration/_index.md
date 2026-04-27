---
title: Task 1 - Kiro 帳號註冊及登入前置作業
order: 1
---

# Kiro 帳號註冊及登入前置作業

## Prerequisites

- 已安裝 [Kiro IDE](https://kiro.dev/downloads/)
- 已有 AWS IAM Identity Center 帳號

---

## 於 AWS Console 註冊 Kiro 帳號

:::steps
1. 登入 AWS Console，在搜尋框查詢 `Kiro`

   ![搜尋 Kiro](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%889.24.01.png)

2. 點選 **Onboard your team to Kiro**

   ![Onboard your team to Kiro](./img/1772587609383.jpg)

3. 選擇 **IAM Identity Center**

   ![選擇 IAM Identity Center](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%889.28.46.png)

4. 填寫 Email address

   ![填寫 Email address](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%889.29.56.png)

5. 點選 **Enable**

   ![點選 Enable](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%889.30.26.png)

6. 串接好 Identity Center 之後，新增 User

   ![新增 User](./img/1772588003576.jpg)
   ![User 設定畫面](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%889.34.11.png)

7. 在搜尋框查詢 User 名稱，並點擊 **Assign**

   ![搜尋 User](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%889.35.02.png)
   ![確認 Assign](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%889.35.55.png)
   ![Assign 完成](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%889.36.07.png)
:::

---

## 於 Kiro IDE 登入 AWS 訂閱的帳號

:::steps
1. 在本機電腦開啟 Kiro IDE，點擊 **Sign in**

   ![點擊 Sign in](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%889.37.29.png)
   ![Sign in 畫面](./img/1772588312466.jpg)

2. 點選 **Sign in via IAM Identity Center instead**

   ![點選 Sign in via IAM Identity Center instead](./img/1772588406466.jpg "點選 Sign in via IAM Identity Center instead")

3. 填寫 IAM Identity Center 的 Sign in URL 及 Region，然後點選 **Continue**

   ![填寫 Sign in URL](./img/1772588534296.jpg)
   ![填寫 Region](./img/1772588469129.jpg)
   ![Continue](./img/%E6%88%AA%E5%9C%96_2026-03-04_%E4%B8%8A%E5%8D%889.42.46.png)

4. 登入成功

   ![登入成功](./img/1772588705079.jpg "登入成功")
:::

:::alert{type="success"}
完成登入後即可開始使用 Kiro IDE 進行開發。
:::
