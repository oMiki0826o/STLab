# Small Things Lab

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tech](https://img.shields.io/badge/stack-Next.js-lightgrey)

[中文](#中文) | [English](#english)

---

## 中文

### 目錄

- [關於](#關於)
- [功能](#功能)
- [安裝](#安裝)
- [使用方式](#使用方式)
- [授權](#授權)

### 關於

Small Things Lab 是一組放在瀏覽器裡就能用的小工具。每個工具只處理一件事，資料也留在自己的裝置上。

本專案使用 Next.js、React 與 TypeScript，部署在 GitHub Pages。沒有登入、後端或資料庫；課表、圖表設定與考試資料都保存在瀏覽器本機。天文工具已拆分至獨立的 AstroLab 倉庫。

目前版本為 `v0.1.0`, 包含三個工具與基礎離線 App Shell. 原始 HTML prototype 仍保留在專案中, 用於比較與回歸檢查.

本專案依循 AI Development Governance: 修改前理解既有功能, 控制變更範圍, 保留可追蹤的版本歷史, 修改後執行測試與建置驗證, 並清楚區分已完成項目與未來規劃.

### 功能

- Schedule Studio: 編輯每週課表, 匯入或匯出 JSON 專案, 並將資料保存在瀏覽器本機.
- Table Studio: 編輯資料表、CSV/JSON 匯入匯出；輸入 X/Y 座標, 設定軸名稱, 單位, 最大值與刻度間距, 即時產生 SVG 折線圖並可下載 PNG.
- Local storage: 不需帳號即可保存課表, 圖表設定與收藏.
- Static export: 產生可部署到 GitHub Pages 的靜態網站.
- Offline app shell: 使用 manifest 與 Service Worker 快取主要頁面.

### 安裝

需求:

- Node.js 22 或更新版本
- npm

安裝依賴:

```bash
npm install
```

### 使用方式

啟動本機開發伺服器:

```bash
npm run dev
```

開啟 `http://localhost:3000`.

執行測試與驗證:

```bash
npm test
npm run typecheck
npm run build
python3 tools/check_static.py
```

Static Export 產物會寫入 `out/`.

Pushes to `main` run the validation workflow and deploy the exported site to GitHub Pages. The repository Pages source must be set to `GitHub Actions`.

推送到 `main` 會執行驗證並將靜態產物部署到 GitHub Pages. Repository 的 Pages source 必須設定為 `GitHub Actions`.

若部署在 GitHub repository 子路徑, 可以設定 base path:

```bash
NEXT_PUBLIC_BASE_PATH=/STLab npm run build
```

使用者資料只保存在瀏覽器. 清除網站資料可能會刪除本機內容, 請在需要時建立 JSON 備份.

### 授權

本專案採用 MIT License，詳見 [LICENSE](./LICENSE)。第三方資料來源與個別 attribution 見 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

---

## English

### Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

### About

Small Things Lab is a collection of beautiful, practical, and offline-friendly single-purpose web apps.

The project is built with Next.js, React, and TypeScript, and is deployed to GitHub Pages through Static Export. It requires no account, backend, database, or API key. Schedules, chart settings, and exam plans remain in the browser. Astronomy tools now live in the independent AstroLab repository.

The current version is `v0.1.0`. It includes three tools and a basic offline app shell. The original HTML prototype is kept in the repository for comparison and regression checks.

The project follows AI Development Governance: understand existing behavior before changing it, control scope, keep changes traceable in Git, verify changes with tests and builds, and distinguish implemented behavior from planned work.

### Features

- Schedule Studio: edit a weekly schedule, import or export a JSON project, and keep it in browser storage.
- Table Studio: edit tabular data with CSV/JSON import/export, enter X/Y coordinates, configure labels, units, limits, and tick spacing, and generate a live SVG line chart or PNG.
- Local storage: save schedules, chart settings, and favorites without an account.
- Static export: generate a site that can be deployed to GitHub Pages.
- Offline app shell: cache the main pages with a web manifest and Service Worker.

### Installation

Requirements:

- Node.js 22 or later
- npm

Install dependencies:

```bash
npm install
```

### Usage

Start the local development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Run tests and verification:

```bash
npm test
npm run typecheck
npm run build
python3 tools/check_static.py
```

The Static Export output is written to `out/`.

Pushes to `main` run validation and deploy the exported site to GitHub Pages. Set the repository Pages source to `GitHub Actions`.

The expected project URL is `https://omiki0826o.github.io/STLab/`.

When deploying under a GitHub repository path, set the base path during the build:

```bash
NEXT_PUBLIC_BASE_PATH=/STLab npm run build
```

User data remains in the browser. Clearing site data may remove local content, so create a JSON backup when needed.

### License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
