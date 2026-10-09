# AstroCatalog

純前端梅西爾天體查詢工具。所有天體資料隨網站靜態發布，不需要 API 金鑰。

### 已實作

- 精選 35 個梅西爾天體，支援中文、英文、M 編號、NGC 編號、星座搜尋。
- 星雲／星團／星系篩選、收藏清單（localStorage）。
- J2000 赤經、赤緯、星等、角直徑與星座資訊。
- 輸入緯度、經度和裝置當地時間後，試算地平高度角及前後 6 小時曲線。
- 焦距與感光元件組合的近似視野大小與目標尺寸示意圖。

### 計算邊界

觀測高度以近似恆星時與 J2000 固定座標計算，沒有考慮精密歲差、章動、折射、地形與天氣。時間欄以**使用者裝置的時區**解讀，與輸入的觀測地點沒有自動綁定時區。視野圖不是實際星空影像。

### 資料授權

由 [Yale Bright Star Catalog（Bretton Wade）](https://github.com/brettonw/YaleBrightStarCatalog) 的 `messier.json`（MIT）摘選整理，中文顯示名稱由本專案補充。原始資料以 J2000 座標為基準。

### 部署

將此資料夾的檔案放在 GitHub Repository 根目錄，啟用 GitHub Pages `main / root`。
