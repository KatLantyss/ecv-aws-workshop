---
title: 題目說明與素材下載
order: 1
---

# AI 船舶效能分析與節能決策支援系統

:::banner{type="info"}
**AWS Summit Taipei 2026 AI Hackathon — 百工百業瘋 AI**
命題企業：陽明海運　|　命題類別：智慧航運
:::

---

## 一、背景

陽明海運船隊的效能管理目前高度依賴人工經驗：船舶效能異常的判讀、維修時機的決策，仰賴特定資深人員查閱歷史紀錄與套用國際標準公式（ISO 15016、ISO 19030），形成「無人可接手」的知識斷層。

船隊每天產出 **Noon Report**（船舶每日午報），每數週產出一次 **UWI Report**（水下檢查報告），兩者都是半結構化或圖文混排的 PDF 文件，目前停留在人工查閱、無法被系統化分析利用的階段。

:::alert{type="info"}
**本題目目標：** 把這兩種原始文件，透過 AI 轉化為自動化的效能分析、異常預警與維修決策支援系統。
:::

---

## 二、使用者會問的問題

系統最終呈現在 Dashboard／Chatbot 介面，使用者（節能小組、船隊管理者）預期會問的問題，決定了整個資料與分析架構要支援什麼：

:::expand{title="查看使用者問題與評選需求對應"}
| 使用者問題類型 | 評選需求 |
|---|---|
| 「YM WELLNESS 最近一個月的效能趨勢如何？」 | 效能趨勢分析 |
| 「上次清潔船體後，船速回復了多少？」 | 維修效益驗證 |
| 「為什麼上週油耗突然變高？」 | 異常預警與成因分類 |
| 「現在該不該安排 YM COSMOS 進塢維修？」 | 最佳維修時機建議 |
| 「三艘船裡哪艘的維修優先度最高？」 | 最佳維修時機建議 |
| 「這個月因為船體污損多花了多少燃料錢？」 | 異常預警與成因分類 |
:::

---

## 三、評選四大需求

:::steps
1. **效能趨勢分析**

   分析單艘船隨時間推移的效能指標（船速、油耗、主機功率）變化，識別長期劣化趨勢。

2. **維修效益驗證**

   評估船體清潔或螺旋槳拋光後的實際效益，量化驗證維修前後的效能差異。

3. **異常預警與成因分類**

   偵測異常油耗或效能下降事件，並協助分類成因（污損、天候、機械故障等）。

4. **最佳維修時機建議**

   綜合效能劣化速率與維修成本，提出進塢或清潔時機的決策建議。
:::

---

## 四、素材檔案

### 4.1 檔案說明

| 檔案 | 格式 | 內容說明 | 用途 |
|---|---|---|---|
| `NoonReport_YM_WELLNESS_20241115.pdf` | PDF（半結構化） | 單艘船單日午報：船速、主機功率、燃油消耗、海況、船長備註 | AI 解析的原始輸入範例 |
| `UWI_Report_YM_WELLNESS_20241015.pdf` | PDF（圖文混排） | 單艘船單次水下檢查報告：污損評分、螺旋槳狀態、驗船師結論 | AI 解析的原始輸入範例 |
| `Vessel_Reference.csv` | CSV（結構化） | 三艘船的靜態主尺度與設計基準值 | 效能計算的查詢字典 |
| `YangMing_MockData_Hackathon.xlsx` | Excel（4 分頁） | PDF 解析完成後「理論上應該長成的樣子」—— `Noon_Report`、`UWI_Inspections`、`Vessel_Reference`、`KPI_Monthly`，涵蓋 5 年 × 3 艘船的模擬資料 | 資料解析的參考基準（非標準答案） |

:::alert{type="warning"}
**注意：** 黑客松現場會提供大量 PDF 檔案，需要某種方式把它們轉換成可分析的結構化資料。素材中的 PDF 為範例文件，請勿直接依賴其內容做為最終資料集。
:::

### 4.2 資料說明

:::expand{title="PDF 如何轉化成結構化資料 — 參考思路"}
`NoonReport_*.pdf` 和 `UWI_Report_*.pdf` 是「解析前」的原始輸入範例，展示真實資料的原始格式。

`YangMing_MockData_Hackathon.xlsx` 則是「解析後可能長成的樣子」之一——內含四個分頁：

| 分頁 | 內容 |
|---|---|
| `Noon_Report` | 從 Noon Report PDF 解析後的每日欄位資料 |
| `UWI_Inspections` | 從 UWI Report PDF 解析後的水下檢查紀錄 |
| `Vessel_Reference` | 三艘船的靜態主尺度（與 csv 檔相同） |
| `KPI_Monthly` | 彙整計算後的月度效能 KPI |

:::alert{type="info"}
這份 Excel 是**參考基準，不是標準答案**。團隊可以依照自己的設計，產出完全不同的欄位結構——只要能回答四項評選需求即可。儲存格式也不限 Excel，CSV、Parquet 或直接存入資料庫都是合理的選擇。
:::

以下僅列出其中一種可能的技術路線作為起點參考，**不代表唯一或最佳做法**：

- 表格與鍵值對欄位（如「M/E Power (kW): 46,120 kW」）— 可考慮使用 OCR/文件理解服務（例如 Amazon Textract）萃取
- 自由文字段落（船長備註、驗船師結論）— 可能需要語言模型協助語意理解
- 解析結果的儲存格式（CSV、Parquet 等）與位置（S3 或其他），皆為團隊自行評估的設計選擇

**具體如何設計資料流程、選用什麼 AWS 服務、架構分成幾層，完全開放給參賽團隊自由發揮。**
:::

### 4.3 下載素材

:::alert{type="success"}
以下為本題目的全部素材檔案，請下載後仔細閱讀，作為解題的輸入資料。
:::

::download-template[📄 NoonReport\_YM\_WELLNESS\_20241115.pdf]{file="_idea/files/NoonReport_YM_WELLNESS_20241115.pdf"}

::download-template[📄 UWI\_Report\_YM\_WELLNESS\_20241015.pdf]{file="_idea/files/UWI_Report_YM_WELLNESS_20241015.pdf"}

::download-template[📊 Vessel\_Reference.csv]{file="_idea/files/Vessel_Reference.csv"}

::download-template[📋 YangMing\_MockData\_Hackathon.xlsx]{file="_idea/files/YangMing_MockData_Hackathon.xlsx"}

---

## 五、實作方式：開放設計空間

:::alert{type="info"}
以上三個部分（背景、目標、素材）是這個題目本身的事實與限制。從這裡開始，**怎麼設計資料流程、選用什麼 AWS 服務、架構分成幾層、用 ML 還是規則邏輯**，這些都是完全開放的設計空間，沒有預設答案。
:::

討論過程中浮現的一些可能方向，僅供參考：

- 用 OCR / 文件理解服務解析 PDF，搭配語言模型處理自由文字段落
- 把確定性的數值計算（趨勢分析、效益比較）和機率性的 ML 任務（異常偵測、預測）分開處理
- 用 RAG 的方式讓 Dashboard / Chatbot 查詢歷史資料並生成回答

:::alert{type="warning"}
**這些只是其中一種思路，不是建議的標準架構，也不代表最佳解法。**

參賽團隊完全可以依照自己對題目的理解、熟悉的工具、時間限制，設計出不同的資料流程與服務組合——只要最終能回答評選標準裡的四項需求即可。
:::

---

## 六、參考資料

- [Amazon Textract 文件](https://docs.aws.amazon.com/textract/latest/dg/what-is.html) — 文件 OCR 與結構化萃取
- [Amazon Bedrock 文件](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html) — 基礎模型與 RAG 應用
- [ISO 15016](https://www.iso.org/standard/75862.html) — 船舶速力試驗修正準則
- [ISO 19030](https://www.iso.org/standard/63550.html) — 船體與螺旋槳效能監控標準
