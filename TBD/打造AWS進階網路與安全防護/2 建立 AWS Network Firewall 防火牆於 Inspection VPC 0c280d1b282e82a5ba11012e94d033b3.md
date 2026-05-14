# 2. 建立 AWS Network Firewall 防火牆於 Inspection VPC

## 建立 AWS Network Firewall 防火牆於 Inspection VPC

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%201.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%202.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%203.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%204.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%205.png)

### 建立 CloudWatch Log Group

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%206.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%207.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%208.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%209.png)

### 回到 Create firewall 介面

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2010.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2011.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2012.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2013.png)

![等待Firewall佈建完成 (約 10-15 分鐘)](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2014.png)

等待Firewall佈建完成 (約 10-15 分鐘)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2015.png)

### 在 Network Firewall rule groups 建立 Stateful rule group (allow domain)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2016.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2017.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2018.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2019.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2020.png)

### 將建立的 Rule Group (allow-specific-domain-list) 新增到 Policy

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2021.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2022.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2023.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2024.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2025.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2026.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2027.png)

### 在 Network Firewall rule groups 再建立一個 Stateful rule group (allow ICMP)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2028.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2029.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2030.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2031.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2032.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2033.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2034.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2035.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2036.png)

### 將建立的 Rule Group (allow-ping-rg) 新增到 Policy

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2037.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2038.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2039.png)

![image.png](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2040.png)

![到 Firewall 觀察 Sync State 狀態，直到轉為 In sync ](2%20%E5%BB%BA%E7%AB%8B%20AWS%20Network%20Firewall%20%E9%98%B2%E7%81%AB%E7%89%86%E6%96%BC%20Inspection%20VPC/image%2041.png)

到 Firewall 觀察 Sync State 狀態，直到轉為 In sync