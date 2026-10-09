# Table Studio

在瀏覽器製作精緻資料表格的小工具。直接部署 GitHub Pages，不需要後端。

### 已實作

- 編輯表頭和表格內容，最多 200 列與 20 欄。
- 新增／刪除最末列與最末欄、Excel 多格貼上。
- 匯入 CSV、專案 JSON；匯出 CSV、Markdown、PNG、專案 JSON。
- 四種外觀主題、對齊、交錯列底色。
- 自動儲存於 localStorage。

### 注意

PNG 匯出限制為最多 60 列、12 欄以避免瀏覽器建立過大畫布；其餘完整資料請用 CSV 或 JSON。初版不支援公式、合併儲存格、Excel XLSX。

### 部署

將這個資料夾的檔案放進 GitHub Repository 根目錄，啟用 GitHub Pages `main / root` 即可。
