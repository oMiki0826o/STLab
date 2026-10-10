# Small Things Lab Roadmap

這份文件只記錄目前程式碼已能驗證的狀態，以及下一批明確的工作；不把構想寫成已完成功能。

## 已完成

- Schedule Studio：A／B 週、點選交換、桌面拖曳交換、JSON／PNG、瀏覽器本機儲存與列印／另存 PDF。
- Table Studio：資料列／欄編輯、CSV／JSON 匯入匯出、X／Y 軸與資料點編輯、SVG 預覽、PNG 匯出與輸入驗證。
- Exam Planner：考試倒數、準備度、任務、優先程度、備註、JSON 匯入匯出與列印版面。
- 共同基礎：深淺主題、離線 App Shell、Static Export、TypeScript、單元測試與靜態路由檢查。
- 靜態內容契約：建置後會檢查三個工具的主要操作入口，不讓頁面退化成只有標題的空殼。

## 目前限制

- PDF 是瀏覽器列印流程，不是伺服器產生的 PDF 檔案。
- Table Studio 尚未支援 XLSX、合併儲存格與欄寬／列高拖曳。
- 目前沒有 Playwright 瀏覽器 E2E；`npm run check` 會驗證單元測試、型別、建置與輸出路由。

## 下一階段

1. 補 Table Studio 的樣式預設與高解析度匯出。
2. 視需求加入 XLSX，並把檔案格式驗證納入測試。
3. 對 Schedule、Table、Exam 增加瀏覽器 E2E，覆蓋匯入、輸出、手機寬度與本機儲存。

## 驗證

```bash
npm run check
```
