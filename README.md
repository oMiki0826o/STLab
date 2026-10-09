# Small Things Lab (STLab)

Small Things Lab is a collection of focused, offline-friendly web tools built with Next.js and TypeScript.

Small Things Lab 是一系列專注、離線友善的單一用途 Web App，使用 Next.js 與 TypeScript 開發。

## Current status / 目前狀態

`v0.1.0` is an initial foundation release. The application is exported as static HTML and is designed for GitHub Pages. User data is kept in the browser unless the user explicitly exports it.

`v0.1.0` 是初始基礎版本。目前使用 Static Export 產生靜態網站，適合部署到 GitHub Pages。除非使用者主動匯出，資料會保留在瀏覽器本機。

## Tools / 工具

| Tool / 工具 | Route / 路由 | Implemented / 已實作 |
| --- | --- | --- |
| Schedule Studio | `/schedule/` | Weekly schedule cells, local persistence, JSON export / 每週課表編輯、本機儲存、JSON 匯出 |
| Table Studio | `/table/` | Experimental chart mode, axis labels and units, scale limits, coordinate input, live SVG line chart / 實驗圖表模式、軸名稱與單位、最大值、刻度間距、座標輸入、SVG 折線圖 |
| AstroCatalog | `/astro/` | Search, type filter, curated catalog, local favorites / 搜尋、類型篩選、精選天體資料、收藏 |

The repository also keeps the original static prototype under `schedule-studio/`, `table-studio/`, and `astro-catalog/` for comparison and regression checks. The active Next.js application lives under `app/` and `lib/`.

本倉庫仍保留 `schedule-studio/`、`table-studio/`、`astro-catalog/` 原生靜態原型，用於比對與回歸檢查。目前使用中的 Next.js 應用程式位於 `app/` 與 `lib/`。

## Requirements / 環境需求

- Node.js 22 or later / Node.js 22 或更新版本
- npm

## Local development / 本機開發

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser. / 請在瀏覽器開啟 `http://localhost:3000`。

## Verification / 驗證

```bash
npm test
npm run typecheck
npm run build
python3 tools/check_static.py
```

The build uses `output: "export"` and writes the static site to `out/`. The legacy checker intentionally validates only the original static prototype and does not scan generated Next.js output.

建置使用 `output: "export"`，靜態網站會輸出到 `out/`。舊版靜態檢查器刻意只檢查原生靜態原型，不會掃描 Next.js 產生的輸出內容。

## GitHub Pages / GitHub Pages 部署

The project is compatible with GitHub Pages as a static export. Configure the repository Pages source according to the deployment method used by the repository. If the project is served below a repository path, set the corresponding base path when building, for example:

本專案可用 Static Export 部署到 GitHub Pages。請依倉庫採用的部署方式設定 Pages 來源。若網站位於 repository 子路徑，建置時設定對應的 base path，例如：

```bash
NEXT_PUBLIC_BASE_PATH=/STLab npm run build
```

The generated `out/` directory is the deployment artifact. / 產生的 `out/` 目錄就是部署產物。

## Privacy and offline approach / 隱私與離線方向

- No account, backend, database, or API key is required. / 不需要帳號、後端、資料庫或 API 金鑰。
- Schedule, chart settings, and Astro favorites use browser `localStorage`. / 課表、圖表設定與天體收藏使用瀏覽器 `localStorage`。
- Exported files are generated in the browser. / 匯出檔案在瀏覽器本機產生。
- Clearing browser site data can remove local projects. Export JSON backups when needed. / 清除網站資料可能會刪除本機專案，請視需要匯出 JSON 備份。
- A basic manifest and service-worker app-shell cache are included. Install prompts, update UX, icons, and broad browser verification remain future work. / 目前已加入基礎 manifest 與 Service Worker app-shell 快取；安裝提示、更新體驗、圖示與完整瀏覽器驗證仍列入後續工作。

## Roadmap / 後續規劃

1. Schedule Studio: drag-and-drop editing, themes, print layout, PNG export / 拖曳編輯、主題、列印版面、PNG 匯出。
2. Table Studio: richer table editing, CSV import/export, chart export, experiment record templates / 完整表格編輯、CSV 匯入匯出、圖表匯出、實驗紀錄模板。
3. AstroCatalog: expanded catalog metadata, observation lists, telescope field-of-view tools / 擴充天體資料、觀測清單、望遠鏡視野工具。
4. Shared offline capabilities: PWA cache, project backup, common export components / 共用離線能力、PWA 快取、專案備份與輸出元件。

Roadmap items are proposals, not current functionality. / Roadmap 項目是規劃，不代表目前已完成的功能。

## Governance / 開發治理

Changes follow the repository's AI Development Governance principles: understand existing behavior before changing it, keep scope controlled, preserve the static prototype, verify after modification, and distinguish verified behavior from planned behavior.

本專案依循 AI Development Governance：修改前先理解既有行為、控制範圍、保留原生靜態原型、修改後執行驗證，並清楚區分已驗證功能與規劃功能。

Local workflow records are stored under `data/`, which is intentionally ignored by Git.

本機工作流程紀錄放在 `data/`，該目錄已刻意加入 `.gitignore`，不會提交到 Git。

### Governance evidence / 治理證據對照

| Principle / 原則 | Repository evidence / 專案證據 |
| --- | --- |
| Understand before modify / 修改前理解 | The original static prototype remains in its own directories and is covered by `tools/check_static.py`. / 原生靜態原型保留在原目錄，並由 `tools/check_static.py` 檢查。 |
| Control scope / 控制範圍 | The current release is limited to three client-side tools and static export; backend sync and accounts are not included. / 本版本限定三個前端工具與靜態輸出，不包含後端同步與帳號。 |
| Verify after changes / 修改後驗證 | `npm test`, `npm run typecheck`, `npm run build`, and `python3 tools/check_static.py` are run locally and in GitHub Actions. / 本機與 GitHub Actions 都執行測試、型別檢查、建置與靜態檢查。 |
| Evidence before claims / 先證據後宣稱 | The Current status and Roadmap sections separate implemented behavior from proposals. / Current status 與 Roadmap 明確區分已實作與規劃。 |
| Protect user data / 保護使用者資料 | Browser storage and export behavior are documented; no server upload is implemented. / 已說明瀏覽器儲存與匯出行為，未實作伺服器上傳。 |
| Reversible workflow records / 可保留的工作紀錄 | Local workflow records remain under ignored `data/`; source changes remain reviewable through Git history. / 本機工作紀錄保留在被忽略的 `data/`，程式變更透過 Git 歷史追蹤。 |

## License / 授權

See [LICENSE](LICENSE). Astro data attribution and source notes are kept with the relevant prototype data files.

請參閱 [LICENSE](LICENSE)。天文資料的出處與授權說明會保留在相關原型資料檔案中。
