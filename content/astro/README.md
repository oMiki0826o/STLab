# 觀星目錄內容格式

`common.md` 是 Astro Catalog 的內容來源。每個天體以 `##` 開始，接著使用固定欄位；建置時由 `tools/generate_astro_catalog.mjs` 轉成 TypeScript 資料。

```md
## M42｜獵戶座大星雲
id: m42-markdown
aliases: NGC 1976, Orion Nebula
type: 星雲
constellation: 獵戶座
ra: 05h 35m 17s
dec: −05° 23′
angularSize: 1.1°
distance: 1,340 光年
magnitude: 4.0
note: 活躍的恆星形成區。
nearbyStars: 參宿四 Betelgeuse, 參宿七 Rigel
searchGuide: 先找獵戶座腰帶，再依提示確認位置。
```

## 欄位說明

- `id`：小寫、使用連字號，必須唯一；它會成為詳細頁網址的一部分。
- `aliases`：以逗號分隔的別名，可放 NGC、IC、英文名稱或常用中文名。
- `type`、`constellation`：用於篩選與星座探索頁。
- `ra`、`dec`：保留來源採用的赤經、赤緯表示法；目前只作目錄與定位提示。
- `angularSize`、`distance`、`magnitude`：以方便閱讀的單位填寫；數值是整理用資料，不代表即時星曆。
- `note`：一句觀測或攝影摘要。
- `nearbyStars`：以逗號列出附近亮星或可用來跳轉的參考目標。
- `searchGuide`：用肉眼可理解的方式描述如何在星圖中找到目標。

資料缺少精確值時，請明確寫在 `note` 或 `searchGuide`，不要用看似精準的數字填補空白。新增內容後執行 `npm run build`，建置流程會重新產生 `lib/astro-markdown.generated.ts`。
