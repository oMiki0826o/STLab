/*
 * File: app.js
 * Modification: 2026-10-10 - Table Studio v0.1，動態表格、CSV 匯入、貼上、Markdown/PNG/JSON 匯出。
 */
'use strict';

// ── 狀態與約束 ──
const STORE = 'table-studio-v1';
const MAX_ROWS = 200;
const MAX_COLS = 20;
const $ = (selector) => document.querySelector(selector);
const PALETTES = {
  indigo: { main: '#5e79d6', head: '#e8ecfc', odd: '#f7f9ff', dark: '#32446f' },
  mint: { main: '#398f7c', head: '#e1f5ec', odd: '#f4fbf7', dark: '#295d52' },
  peach: { main: '#bc806c', head: '#fff0e7', odd: '#fff9f3', dark: '#84503d' },
  mono: { main: '#2f3b4b', head: '#e9ebed', odd: '#f7f7f7', dark: '#303944' },
};
function sample() {
  return {
    title: '學期成績紀錄', subtitle: '2026 年度 · 資料總覽', theme: 'indigo', align: 'left', zebra: true,
    headers: ['科目', '第一次段考', '第二次段考', '第三次段考'],
    rows: [
      ['國文', '85', '87', '90'], ['英文', '92', '90', '94'], ['數學', '78', '83', '88'],
      ['物理', '91', '93', '95'], ['化學', '89', '88', '92'],
    ],
  };
}
function sanitize(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.headers) || !Array.isArray(raw.rows)) {
    throw Error('內容不是有效的 Table Studio 專案');
  }
  const headers = raw.headers.slice(0, MAX_COLS).map((value) => String(value ?? '').slice(0, 80));
  if (!headers.length) throw Error('缺少欄位');
  const rows = raw.rows.slice(0, MAX_ROWS).map((row) => headers.map((_, index) => String(Array.isArray(row) ? (row[index] ?? '') : '').slice(0, 1000)));
  if (!rows.length) rows.push(headers.map(() => ''));
  return {
    title: String(raw.title ?? '未命名表格').slice(0, 60),
    subtitle: String(raw.subtitle ?? '').slice(0, 100),
    theme: Object.hasOwn(PALETTES, raw.theme) ? raw.theme : 'indigo',
    align: ['left', 'center', 'right'].includes(raw.align) ? raw.align : 'left',
    zebra: raw.zebra !== false, headers, rows,
  };
}
let state;
try { state = sanitize(JSON.parse(localStorage.getItem(STORE))); }
catch { state = sample(); }
let toastTimer;
function toast(message) {
  const node = $('#toast'); node.textContent = message; node.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('show'), 3000);
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(state)); }
  catch { toast('儲存空間不足，請匯出 JSON 備份'); }
}
function make(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

// ── 表格渲染與編輯 ──
function render() {
  $('#tableTitle').value = state.title;
  $('#tableSubtitle').value = state.subtitle;
  $('#tableTheme').value = state.theme;
  $('#tableAlign').value = state.align;
  $('#zebra').checked = state.zebra;
  $('#previewTitle').textContent = state.title || '未命名表格';
  $('#previewSubtitle').textContent = state.subtitle;
  $('#rowCount').textContent = `${state.rows.length} 列`;
  $('#colCount').textContent = `${state.headers.length} 欄`;
  $('#tablePage').dataset.theme = state.theme;
  $('#dataGrid').dataset.align = state.align;
  $('#dataGrid').dataset.zebra = String(state.zebra);
  const head = $('#dataGrid thead'); const body = $('#dataGrid tbody');
  head.replaceChildren(); body.replaceChildren();
  const headRow = make('tr');
  state.headers.forEach((value, c) => {
    const th = make('th'); const input = make('input');
    input.type = 'text'; input.value = value; input.maxLength = 80;
    input.dataset.column = String(c); input.setAttribute('aria-label', `第 ${c + 1} 欄標題`);
    input.placeholder = `欄位 ${c + 1}`;
    th.append(input); headRow.append(th);
  });
  head.append(headRow);
  state.rows.forEach((row, r) => {
    const tr = make('tr');
    row.forEach((value, c) => {
      const td = make('td'); const input = make('input');
      input.type = 'text'; input.maxLength = 1000; input.value = value;
      input.dataset.row = String(r); input.dataset.col = String(c);
      input.setAttribute('aria-label', `第 ${r + 1} 列第 ${c + 1} 欄`);
      td.append(input); tr.append(td);
    });
    body.append(tr);
  });
}
$('#dataGrid').addEventListener('input', (event) => {
  const node = event.target;
  if (!(node instanceof HTMLInputElement)) return;
  if (node.dataset.column !== undefined) state.headers[Number(node.dataset.column)] = node.value;
  else if (node.dataset.row !== undefined) state.rows[Number(node.dataset.row)][Number(node.dataset.col)] = node.value;
  save();
});
function grow(rowsNeeded, colsNeeded) {
  const cols = Math.max(state.headers.length, Math.min(MAX_COLS, colsNeeded));
  while (state.headers.length < cols) {
    state.headers.push(`欄位 ${state.headers.length + 1}`);
    state.rows.forEach((row) => row.push(''));
  }
  while (state.rows.length < Math.min(MAX_ROWS, rowsNeeded)) state.rows.push(Array(cols).fill(''));
}
$('#addRow').addEventListener('click', () => {
  if (state.rows.length >= MAX_ROWS) { toast(`最多 ${MAX_ROWS} 列`); return; }
  state.rows.push(state.headers.map(() => '')); save(); render(); toast('已新增一列');
});
$('#addColumn').addEventListener('click', () => {
  if (state.headers.length >= MAX_COLS) { toast(`最多 ${MAX_COLS} 欄`); return; }
  grow(state.rows.length, state.headers.length + 1); save(); render(); toast('已新增一欄');
});
$('#removeRow').addEventListener('click', () => {
  if (state.rows.length <= 1) { toast('至少保留一列'); return; }
  state.rows.pop(); save(); render(); toast('已刪除最末列');
});
$('#removeColumn').addEventListener('click', () => {
  if (state.headers.length <= 1) { toast('至少保留一欄'); return; }
  state.headers.pop(); state.rows.forEach((row) => row.pop()); save(); render(); toast('已刪除最末欄');
});
$('#tableTitle').addEventListener('input', (event) => {
  state.title = event.target.value.slice(0, 60); $('#previewTitle').textContent = state.title || '未命名表格'; save();
});
$('#tableSubtitle').addEventListener('input', (event) => {
  state.subtitle = event.target.value.slice(0, 100); $('#previewSubtitle').textContent = state.subtitle; save();
});
$('#tableTheme').addEventListener('change', (event) => {
  state.theme = event.target.value; $('#tablePage').dataset.theme = state.theme; save();
});
$('#tableAlign').addEventListener('change', (event) => {
  state.align = event.target.value; $('#dataGrid').dataset.align = state.align; save();
});
$('#zebra').addEventListener('change', (event) => {
  state.zebra = event.target.checked; $('#dataGrid').dataset.zebra = String(state.zebra); save();
});

// ── 分隔資料解析：支援雙引號轉義與換行 ──
function parseDelimited(text, delimiter = ',') {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else if (quoted) quoted = false;
      else if (cell.length === 0) quoted = true;
      else cell += char;
    } else if (!quoted && char === delimiter) { row.push(cell); cell = ''; }
    else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += char;
  }
  if (quoted) throw Error('資料有未關閉的引號');
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
$('#dataGrid').addEventListener('paste', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const pasted = event.clipboardData?.getData('text/plain') || '';
  if (!pasted.includes('\t') && !pasted.includes('\n') && !pasted.includes('\r')) return;
  event.preventDefault();
  try {
    const parsed = parseDelimited(pasted, '\t');
    const startCol = Number(target.dataset.column ?? target.dataset.col ?? 0);
    const startRow = target.dataset.column !== undefined ? -1 : Number(target.dataset.row ?? 0);
    grow(Math.max(1, startRow + parsed.length), startCol + Math.max(...parsed.map((r) => r.length)));
    parsed.forEach((line, index) => line.forEach((value, colOffset) => {
      const row = startRow + index; const col = startCol + colOffset;
      if (col >= MAX_COLS || row >= MAX_ROWS) return;
      if (row === -1) state.headers[col] = value.slice(0, 80);
      else if (row >= 0) state.rows[row][col] = value.slice(0, 1000);
    }));
    save(); render(); toast('已貼上多格資料');
  } catch (error) { toast(`貼上失敗：${error.message}`); }
});

// ── 匯入與匯出 ──
function download(blob, filename) {
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
const filename = (ext) => `table-studio.${ext}`;
function quoteCSV(text) {
  // 防止試算表把使用者輸入的文字當成公式執行；不影響純數值儲存格。
  const safe = /^\s*[=+@-]/.test(text) && !/^-\d+(?:\.\d+)?$/.test(text.trim()) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}
$('#exportCsv').addEventListener('click', () => {
  const lines = [state.headers, ...state.rows].map((row) => row.map(quoteCSV).join(','));
  download(new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }), filename('csv'));
  toast('CSV 已下載');
});
function markdownCell(text) { return text.replaceAll('\\', '\\\\').replaceAll('|', '\\|').replaceAll(/\r?\n/g, '<br>'); }
$('#exportMd').addEventListener('click', () => {
  const line = (values) => `| ${values.map(markdownCell).join(' | ')} |`;
  const rows = [line(state.headers), `| ${state.headers.map(() => '---').join(' | ')} |`, ...state.rows.map(line)];
  const md = `# ${state.title}\n\n${state.subtitle}\n\n${rows.join('\n')}\n`;
  download(new Blob([md], { type: 'text/markdown;charset=utf-8' }), filename('md'));
  toast('Markdown 已下載');
});
$('#exportJson').addEventListener('click', () => {
  download(new Blob([JSON.stringify({ version: 1, ...state }, null, 2)], { type: 'application/json' }), filename('json'));
  toast('專案 JSON 已下載');
});
$('#importCsv').addEventListener('click', () => $('#csvFile').click());
$('#importJson').addEventListener('click', () => $('#jsonFile').click());
$('#csvFile').addEventListener('change', async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    if (file.size > 2_000_000) throw Error('CSV 上限 2 MB');
    const lines = parseDelimited((await file.text()).replace(/^\ufeff/, ''));
    if (!lines.length || !lines[0].length) throw Error('CSV 是空的');
    if (lines.length > MAX_ROWS + 1 || lines.some((row) => row.length > MAX_COLS)) throw Error(`最多 ${MAX_ROWS} 列、${MAX_COLS} 欄`);
    state = sanitize({ ...state, headers: lines[0], rows: lines.slice(1) });
    save(); render(); toast('CSV 匯入完成');
  } catch (error) { toast(`匯入失敗：${error.message}`); }
  event.target.value = '';
});
$('#jsonFile').addEventListener('change', async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    if (file.size > 2_000_000) throw Error('JSON 上限 2 MB');
    const parsed = JSON.parse(await file.text());
    if (parsed.headers?.length > MAX_COLS || parsed.rows?.length > MAX_ROWS) throw Error(`最多 ${MAX_ROWS} 列、${MAX_COLS} 欄`);
    state = sanitize(parsed); save(); render(); toast('專案已載入');
  } catch (error) { toast(`匯入失敗：${error.message}`); }
  event.target.value = '';
});
$('#resetTable').addEventListener('click', () => {
  if (!confirm('確定要用範例資料取代目前的表格嗎？')) return;
  state = sample(); save(); render(); toast('已載入範例表格');
});

// ── Canvas 圖片輸出 ──
function shortText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  const chars = Array.from(text); while (chars.length && ctx.measureText(chars.join('') + '…').width > maxWidth) chars.pop();
  return chars.join('') + '…';
}
$('#exportPng').addEventListener('click', () => {
  if (state.rows.length > 60 || state.headers.length > 12) {
    toast('PNG 最多 60 列／12 欄，完整資料請用 CSV 匯出'); return;
  }
  const cw = 180; const gap = 45; const top = 210; const rh = 57;
  const width = Math.max(700, state.headers.length * cw + gap * 2);
  const height = top + (state.rows.length + 1) * rh + 72;
  const canvas = document.createElement('canvas'); canvas.width = width * 2; canvas.height = height * 2;
  const ctx = canvas.getContext('2d'); if (!ctx) { toast('瀏覽器無法輸出圖片'); return; }
  ctx.scale(2, 2); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height);
  const p = PALETTES[state.theme];
  ctx.fillStyle = p.main; ctx.font = '800 14px system-ui'; ctx.fillText('TABLE STUDIO  /  DATA SHEET', gap, 54);
  ctx.fillStyle = '#2f374a'; ctx.font = '800 38px system-ui';
  ctx.fillText(shortText(ctx, state.title || '未命名表格', width - 2 * gap), gap, 117);
  ctx.fillStyle = '#8a94a6'; ctx.font = '18px system-ui';
  ctx.fillText(shortText(ctx, state.subtitle, width - 2 * gap), gap, 157);
  function cell(value, c, r, header) {
    const x = gap + c * cw; const y = top + r * rh;
    ctx.fillStyle = header ? p.head : state.zebra && r % 2 === 0 ? p.odd : '#fff';
    ctx.fillRect(x, y, cw, rh); ctx.strokeStyle = '#e1e6f0'; ctx.strokeRect(x, y, cw, rh);
    ctx.font = `${header ? 800 : 500} 18px system-ui`;
    ctx.fillStyle = header ? p.dark : '#49556b';
    ctx.textBaseline = 'middle'; ctx.textAlign = state.align;
    const textX = x + (state.align === 'center' ? cw / 2 : state.align === 'right' ? cw - 14 : 14);
    ctx.fillText(shortText(ctx, value, cw - 28), textX, y + rh / 2);
  }
  state.headers.forEach((head, c) => cell(head, c, 0, true));
  state.rows.forEach((row, r) => row.forEach((value, c) => cell(value, c, r + 1, false)));
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = '#abb5c4';
  ctx.font = '700 13px system-ui'; ctx.fillText('TABLE STUDIO · CRAFTED WITH CARE', gap, height - 23);
  canvas.toBlob((blob) => blob ? (download(blob, filename('png')), toast('PNG 已下載')) : toast('圖片輸出失敗'), 'image/png');
});
$('#documentStamp').textContent = String(new Date().getFullYear());
render();
