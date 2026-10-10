# STLab Next.js 基礎移植計畫

## 目標

將 `small-things-lab-v0.1` 的三個原生 HTML/JavaScript 工具移植為獨立的 Next.js + TypeScript 專案，使用 App Router 與 Static Export，維持可部署到 GitHub Pages 的離線友善架構。

## 範圍

- 首頁：三個工具的導覽與專案說明。
- Schedule Studio：課表資料編輯、瀏覽器本機儲存與 JSON 匯入／匯出。
- Table Studio：表格資料編輯、欄列增刪、CSV/JSON 匯入／匯出與 PNG 輸出。
- Astro Catalog：天體資料搜尋、分類篩選、收藏與簡單計算結果。
- 共用：TypeScript 型別、localStorage 安全包裝、離線友善的靜態輸出設定。

## 非範圍

- 本階段不改動既有 `HTML/` 個人網站。
- 不在本階段加入後端、登入、雲端同步或資料庫。
- 實驗紀錄折方圖表先保留為下一階段功能，不混入本次基礎移植。

## 驗證

1. 純函式單元測試。
2. TypeScript 型別檢查。
3. Next.js production build / static export。
4. 原有靜態檢查器與基本頁面 smoke check。

## 發布

完成上述驗證後，在此目錄初始化 Git，建立 `main` 初始 commit，設定 `https://github.com/oMiki0826o/STLab.git`，再推送。

## 基礎版本完成狀態

- [x] Schedule Studio：週一至週五、上午四節／午休／下午四節、JSON 匯入匯出、PNG 匯出、本機保存。
- [x] Table Studio：資料列與欄位編輯、CSV／JSON 匯入匯出、座標點編輯、X／Y 軸獨立設定、SVG／PNG 圖表。
- [x] Astro Catalog：名稱／別名／星座搜尋、類型篩選、收藏與天體基本資料。
- [x] 共用視覺：深淺主題、手機響應式、焦點狀態、離線 Service Worker 快取版本。
- [x] 驗證流程：Vitest、TypeScript、Static Export、靜態 HTML 檢查。
- [x] 輸入驗證：表格欄位與圖表設定有共用的純函式驗證規則與測試。

## 下一階段候選項目

- [ ] Schedule Studio：自訂節次、課程顏色與 A／B 週。
- [ ] Table Studio：欄位排序、篩選、刪除欄位與樣式模板。
- [ ] Astro Catalog：觀測清單匯出與望遠鏡視野計算。
- [ ] 新增獨立工具前，先確認工具具備輸入、即時預覽與可下載成果三個條件。
