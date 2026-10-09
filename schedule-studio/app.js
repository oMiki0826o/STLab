/*
 * File: app.js
 * Modification: 2026-10-10 - Schedule Studio v0.1，課程編輯、本機儲存、PNG 與 JSON 匯入匯出。
 */
'use strict';

// ── 常數與範例資料 ──
const STORAGE_KEY = 'schedule-studio-v1';
const WEEKDAYS = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const CATEGORY_COLORS = {
  course: { background: '#e0f1e6', text: '#2e5544' },
  activity: { background: '#fff0e4', text: '#9d674c' },
  self: { background: '#efedfb', text: '#7767a0' },
  highlight: { background: '#faf0d4', text: '#8b742e' },
};
const THEMES = {
  sage: { head: '#e5f1e9', accent: '#347c64' },
  rose: { head: '#fff1eb', accent: '#ac756e' },
  blue: { head: '#e9f4fe', accent: '#477eac' },
};
const $ = (selector) => document.querySelector(selector);
function sample() {
  const plan = {
    title: '我的每週課表', note: '2026 學年度 · 第一學期', days: 5, periods: 8,
    start: '08:10', duration: 50, breakMinutes: 10, theme: 'sage', cells: {},
  };
  const subjects = [
    ['國文', '英文', '數學', '物理', '英文'],
    ['數學', '物理', '國文', '英文', '化學'],
    ['歷史', '數學', '英文', '國文', '體育'],
    ['英文', '地理', '化學', '數學', '國文'],
    ['午休', '午休', '午休', '午休', '午休'],
    ['生物', '國文', '公民', '生物', '數學'],
    ['體育', '資訊', '地理', '自主學習', '社團活動'],
    ['班會', '資訊', '自主學習', '歷史', '社團活動'],
  ];
  subjects.forEach((row, p) => row.forEach((name, d) => {
    plan.cells[`${d}-${p}`] = {
      name,
      room: p === 5 && d === 0 ? '實驗室' : '',
      teacher: '',
      category: name === '自主學習' || name === '午休' ? 'self' :
        ['班會', '社團活動', '體育'].includes(name) ? 'activity' : 'course',
    };
  }));
  return plan;
}

// ── 驗證與狀態 ──
function bounded(value, min, max, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.round(n))) : fallback;
}
function sanitize(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('JSON 內容不是有效課表');
  const template = sample();
  const plan = {
    title: String(raw.title ?? template.title).slice(0, 45),
    note: String(raw.note ?? template.note).slice(0, 75),
    days: bounded(raw.days, 5, 7, 5),
    periods: bounded(raw.periods, 4, 12, 8),
    start: typeof raw.start === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(raw.start) ? raw.start : '08:10',
    duration: bounded(raw.duration, 20, 120, 50),
    breakMinutes: bounded(raw.breakMinutes, 0, 60, 10),
    theme: Object.hasOwn(THEMES, raw.theme) ? raw.theme : 'sage',
    cells: {},
  };
  if (raw.cells && typeof raw.cells === 'object') {
    Object.entries(raw.cells).slice(0, 120).forEach(([key, value]) => {
      const match = /^(\d+)-(\d+)$/.exec(key);
      if (!match || Number(match[1]) >= 7 || Number(match[2]) >= 12 || !value || typeof value !== 'object') return;
      const name = String(value.name ?? '').trim().slice(0, 28);
      if (!name) return;
      plan.cells[key] = {
        name, room: String(value.room ?? '').slice(0, 24), teacher: String(value.teacher ?? '').slice(0, 24),
        category: Object.hasOwn(CATEGORY_COLORS, value.category) ? value.category : 'course',
      };
    });
  }
  return plan;
}
let state;
try { state = sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
catch { state = sample(); }
let editingKey = null;
let toastTimer;
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { notify('本機儲存空間不可用；請用 JSON 匯出備份'); }
}
function notify(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
function periodTime(p) {
  const [h, m] = state.start.split(':').map(Number);
  const minutes = h * 60 + m + p * (state.duration + state.breakMinutes);
  return `${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}
function addText(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  node.textContent = text;
  return node;
}

// ── 課表渲染 ──
function render() {
  $('#scheduleTitle').value = state.title;
  $('#scheduleNote').value = state.note;
  $('#dayCount').value = String(state.days);
  $('#periodCount').value = state.periods;
  $('#startTime').value = state.start;
  $('#duration').value = state.duration;
  $('#breakMinutes').value = state.breakMinutes;
  $('#theme').value = state.theme;
  $('#paperTitle').textContent = state.title || '未命名課表';
  $('#paperNote').textContent = state.note;
  $('#paper').className = `paper theme-${state.theme}`;
  const thead = $('#scheduleGrid thead'); const tbody = $('#scheduleGrid tbody');
  thead.replaceChildren(); tbody.replaceChildren();
  const headRow = document.createElement('tr');
  headRow.append(addText('th', null, '節次'));
  for (let d = 0; d < state.days; d++) headRow.append(addText('th', null, WEEKDAYS[d]));
  thead.append(headRow);
  for (let p = 0; p < state.periods; p++) {
    const tr = document.createElement('tr'); const time = document.createElement('td');
    const timeBox = addText('div', 'period-meta', '');
    timeBox.append(addText('strong', null, `${p + 1} 節`), addText('small', null, periodTime(p)));
    time.append(timeBox); tr.append(time);
    for (let d = 0; d < state.days; d++) {
      const key = `${d}-${p}`; const entry = state.cells[key];
      const td = document.createElement('td'); const btn = addText('button', 'slot', '');
      btn.type = 'button'; btn.dataset.key = key;
      btn.setAttribute('aria-label', `${WEEKDAYS[d]}第 ${p + 1} 節，${entry ? entry.name : '新增課程'}`);
      if (entry) {
        btn.classList.add('filled', entry.category);
        btn.append(addText('strong', null, entry.name));
        const info = [entry.room, entry.teacher].filter(Boolean).join(' · ');
        if (info) btn.append(addText('small', null, info));
      } else {
        btn.append(addText('span', 'add', '+'), addText('span', 'slot-label', '加入課程'));
      }
      btn.addEventListener('click', () => openEditor(key));
      td.append(btn); tr.append(td);
    }
    tbody.append(tr);
  }
}

// ── 編輯對話框 ──
function openEditor(key) {
  editingKey = key;
  const [day, period] = key.split('-').map(Number); const entry = state.cells[key] || {};
  $('#slotLabel').textContent = `${WEEKDAYS[day]} · 第 ${period + 1} 節 (${periodTime(period)})`;
  $('#dialogTitle').textContent = entry.name ? '修改課程' : '新增課程';
  $('#courseName').value = entry.name || '';
  $('#courseRoom').value = entry.room || '';
  $('#courseTeacher').value = entry.teacher || '';
  $('#courseCategory').value = entry.category || 'course';
  $('#deleteCourse').hidden = !entry.name;
  $('#courseDialog').showModal(); $('#courseName').focus();
}
$('#courseForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('#courseName').value.trim();
  if (!name || editingKey === null) { $('#courseName').focus(); return; }
  state.cells[editingKey] = {
    name: name.slice(0, 28), room: $('#courseRoom').value.trim().slice(0, 24),
    teacher: $('#courseTeacher').value.trim().slice(0, 24), category: $('#courseCategory').value,
  };
  $('#courseDialog').close(); persist(); render(); notify('課程已儲存');
});
$('#deleteCourse').addEventListener('click', () => {
  if (editingKey !== null) delete state.cells[editingKey];
  $('#courseDialog').close(); persist(); render(); notify('已清除此格');
});
$('#closeDialog').addEventListener('click', () => $('#courseDialog').close());
$('#cancelDialog').addEventListener('click', () => $('#courseDialog').close());

// ── 設定表單 ──
const CONFIG = {
  scheduleTitle: ['title', (value) => value.slice(0, 45)],
  scheduleNote: ['note', (value) => value.slice(0, 75)],
  dayCount: ['days', (value) => bounded(value, 5, 7, 5)],
  periodCount: ['periods', (value) => bounded(value, 4, 12, 8)],
  startTime: ['start', (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : '08:10'],
  duration: ['duration', (value) => bounded(value, 20, 120, 50)],
  breakMinutes: ['breakMinutes', (value) => bounded(value, 0, 60, 10)],
  theme: ['theme', (value) => Object.hasOwn(THEMES, value) ? value : 'sage'],
};
Object.entries(CONFIG).forEach(([id, [key, parse]]) => {
  const node = $(`#${id}`);
  node.addEventListener(['scheduleTitle', 'scheduleNote'].includes(id) ? 'input' : 'change', () => {
    state[key] = parse(node.value); persist();
    // 文字編輯不要重新建立目前有焦點的輸入框。
    if (id === 'scheduleTitle') $('#paperTitle').textContent = state.title || '未命名課表';
    else if (id === 'scheduleNote') $('#paperNote').textContent = state.note;
    else render();
  });
});

// ── 檔案匯入匯出 ──
function download(blob, filename) {
  const link = document.createElement('a'); const url = URL.createObjectURL(blob);
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
$('#exportJson').addEventListener('click', () => {
  download(new Blob([JSON.stringify({ version: 1, ...state }, null, 2)], { type: 'application/json' }), 'schedule-studio.json');
  notify('已匯出 JSON 備份');
});
$('#importButton').addEventListener('click', () => $('#importFile').click());
$('#importFile').addEventListener('change', async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    if (file.size > 1_000_000) throw Error('檔案過大（上限 1 MB）');
    state = sanitize(JSON.parse(await file.text())); persist(); render(); notify('已匯入課表');
  } catch (error) { notify(`無法匯入：${error.message}`); }
  event.target.value = '';
});
$('#resetButton').addEventListener('click', () => {
  if (!confirm('確定要用範例課表取代目前資料嗎？可以先匯出 JSON 備份。')) return;
  state = sample(); persist(); render(); notify('已還原範例課表');
});

// ── Canvas PNG 輸出（無須外部函式庫）──
function wrap(ctx, text, x, y, width, maxLines = 2, lineHeight = 24) {
  const chars = Array.from(text); const lines = [''];
  for (const char of chars) {
    const idx = lines.length - 1;
    if (ctx.measureText(lines[idx] + char).width > width && lines[idx]) {
      if (lines.length >= maxLines) { lines[idx] += '…'; break; }
      lines.push(char);
    } else lines[idx] += char;
  }
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
}
$('#exportPng').addEventListener('click', () => {
  const columnWidth = 232; const leftWidth = 100; const top = 205; const rowHeight = 105;
  const width = 50 * 2 + leftWidth + state.days * columnWidth;
  const height = top + state.periods * rowHeight + 90;
  const canvas = document.createElement('canvas'); canvas.width = width * 2; canvas.height = height * 2;
  const ctx = canvas.getContext('2d'); if (!ctx) { notify('瀏覽器不支援圖片匯出'); return; }
  ctx.scale(2, 2); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
  const theme = THEMES[state.theme];
  ctx.fillStyle = theme.head; ctx.fillRect(0, 0, width, top - 15);
  ctx.fillStyle = theme.accent; ctx.font = '700 17px system-ui'; ctx.fillText('WEEKLY PLANNER · SCHEDULE STUDIO', 50, 49);
  ctx.fillStyle = '#273c31'; ctx.font = '700 40px system-ui'; ctx.fillText(state.title || '未命名課表', 50, 111, width - 100);
  ctx.fillStyle = '#718578'; ctx.font = '20px system-ui'; ctx.fillText(state.note, 50, 150, width - 100);
  ctx.textAlign = 'center';
  for (let d = 0; d < state.days; d++) {
    ctx.fillStyle = theme.accent; ctx.font = '700 18px system-ui';
    ctx.fillText(WEEKDAYS[d], 50 + leftWidth + d * columnWidth + columnWidth / 2, top + 23);
  }
  for (let p = 0; p < state.periods; p++) {
    const y = top + 43 + p * rowHeight;
    ctx.fillStyle = '#f5f8f5'; ctx.fillRect(50, y, leftWidth - 8, rowHeight - 8);
    ctx.fillStyle = '#516858'; ctx.font = '700 18px system-ui'; ctx.fillText(`${p + 1} 節`, 50 + (leftWidth - 8) / 2, y + 38);
    ctx.fillStyle = '#8b9a91'; ctx.font = '15px system-ui'; ctx.fillText(periodTime(p), 50 + (leftWidth - 8) / 2, y + 63);
    for (let d = 0; d < state.days; d++) {
      const x = 50 + leftWidth + d * columnWidth + 4;
      const entry = state.cells[`${d}-${p}`];
      ctx.fillStyle = entry ? CATEGORY_COLORS[entry.category].background : '#fafcf9';
      ctx.fillRect(x, y, columnWidth - 9, rowHeight - 8);
      if (!entry) continue;
      ctx.fillStyle = CATEGORY_COLORS[entry.category].text; ctx.font = '700 21px system-ui';
      wrap(ctx, entry.name, x + (columnWidth - 9) / 2, y + 41, columnWidth - 30);
      const info = [entry.room, entry.teacher].filter(Boolean).join(' · ');
      if (info) { ctx.font = '15px system-ui'; ctx.fillText(info.slice(0, 26), x + (columnWidth - 9) / 2, y + 77, columnWidth - 20); }
    }
  }
  ctx.textAlign = 'left'; ctx.fillStyle = '#a3b0a6'; ctx.font = '700 13px system-ui';
  ctx.fillText('MAKE ROOM FOR EVERY LITTLE THING.', 50, height - 32);
  ctx.textAlign = 'right'; ctx.fillText('SCHEDULE STUDIO', width - 50, height - 32);
  canvas.toBlob((blob) => {
    if (blob) { download(blob, 'schedule-studio.png'); notify('課表圖片已下載'); }
    else notify('圖片輸出失敗，請稍後重試');
  }, 'image/png');
});
render();
