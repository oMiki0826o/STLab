/*
 * File: app.js
 * Modification: 2026-10-10 - AstroCatalog v0.1：本機查詢、收藏、天體高度與視野試算。
 */
'use strict';

// ── 星表對照 ──
const OBJECTS = window.ASTRO_OBJECTS;
const $ = (selector) => document.querySelector(selector);
const TYPE = {
  SN: ['星雲', 'nebula'], DN: ['星雲', 'nebula'], PN: ['行星狀星雲', 'nebula'],
  GC: ['球狀星團', 'cluster'], OC: ['疏散星團', 'cluster'],
  SG: ['螺旋星系', 'galaxy'], IG: ['不規則星系', 'galaxy'],
  EG: ['橢圓星系', 'galaxy'], BG: ['棒旋星系', 'galaxy'], LG: ['透鏡星系', 'galaxy'],
};
const CONSTELLATIONS = {
  Tau: '金牛座', Sco: '天蠍座', Sgr: '人馬座', Sct: '盾牌座', Her: '武仙座',
  Peg: '飛馬座', Ser: '巨蛇座', Vul: '狐狸座', And: '仙女座', Tri: '三角座',
  Gem: '雙子座', Ori: '獵戶座', Cnc: '巨蟹座', CVn: '獵犬座', Lyr: '天琴座',
  Com: '后髮座', Leo: '獅子座', Psc: '雙魚座', UMa: '大熊座', Vir: '室女座',
};
const FAVORITES_KEY = 'astro-catalog-favorites-v1';
let favorites = [];
try {
  const restored = JSON.parse(localStorage.getItem(FAVORITES_KEY));
  if (Array.isArray(restored)) favorites = restored.filter((id) => OBJECTS.some((object) => object.id === id));
} catch { favorites = []; }
let activeId = 'M42';
let toastTimer;
function notify(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2700);
}
function create(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}
function category(object) { return TYPE[object.type]?.[1] || 'nebula'; }
function typeName(object) { return TYPE[object.type]?.[0] || object.type; }

// ── 搜尋與收藏 ──
function filtered() {
  const query = $('#searchBox').value.trim().toLowerCase().replace(/\s/g, '');
  const filter = $('#typeFilter').value;
  return OBJECTS.filter((object) => {
    if (filter !== 'all' && category(object) !== filter) return false;
    if ($('#favoritesOnly').checked && !favorites.includes(object.id)) return false;
    const haystack = [object.id, object.ngc && `NGC${object.ngc}`, object.english,
      object.chinese, object.con, CONSTELLATIONS[object.con], typeName(object)].join('|').toLowerCase().replace(/\s/g, '');
    return haystack.includes(query);
  });
}
function renderList() {
  const results = filtered();
  $('#resultCount').textContent = `${results.length} RESULTS`;
  const list = $('#resultList'); list.replaceChildren();
  if (!results.length) { list.append(create('p', 'source-small', '找不到符合條件的天體。試試 M42、星系或星座名稱。')); return; }
  results.forEach((object) => {
    const button = create('button', `result-item ${activeId === object.id ? 'active' : ''}`);
    button.type = 'button'; button.setAttribute('aria-pressed', String(activeId === object.id));
    const left = create('div', 'item-left'); const icon = create('span', `item-symbol ${category(object)}`,
      category(object) === 'galaxy' ? '◎' : category(object) === 'cluster' ? '✣' : '✧');
    const text = create('div'); text.append(create('strong', null, `${object.id}${favorites.includes(object.id) ? ' ★' : ''}`));
    text.append(create('small', null, object.chinese)); left.append(icon, text);
    button.append(left, create('span', 'item-mag', `${object.mag.toFixed(1)} mag`));
    button.addEventListener('click', () => { activeId = object.id; renderList(); renderDetail(); });
    list.append(button);
  });
}
function saveFavorites() {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }
  catch { notify('瀏覽器儲存空間不可用'); }
}
$('#searchBox').addEventListener('input', renderList);
$('#typeFilter').addEventListener('change', renderList);
$('#favoritesOnly').addEventListener('change', renderList);
$('#favoriteButton').addEventListener('click', () => {
  if (favorites.includes(activeId)) favorites = favorites.filter((id) => id !== activeId);
  else favorites.push(activeId);
  saveFavorites(); renderList(); renderDetail();
  notify(favorites.includes(activeId) ? '已加入收藏' : '已移除收藏');
});

// ── 赤道座標與本機時間 ──
function parseRA(value) {
  const h = Number(value.match(/(\d+(?:\.\d+)?)h/)?.[1] || 0);
  const m = Number(value.match(/(\d+(?:\.\d+)?)m/)?.[1] || 0);
  return (h + m / 60) * 15;
}
function parseDec(value) {
  const match = value.match(/([+-])?(\d+)°\s*(\d+)/);
  if (!match) return 0;
  return (Number(match[2]) + Number(match[3]) / 60) * (match[1] === '-' ? -1 : 1);
}
function rad(deg) { return deg * Math.PI / 180; }
function deg(radValue) { return radValue * 180 / Math.PI; }
function altitude(object, latitude, longitude, date) {
  // IAU 教育用途常見的 J2000 近似恆星時公式；未加入章動、歲差與折射。
  const jd = date.getTime() / 86_400_000 + 2440587.5;
  const d = jd - 2451545.0;
  const t = d / 36525;
  const gmst = 280.46061837 + 360.98564736629 * d + 0.000387933 * t * t - t * t * t / 38710000;
  const localSidereal = gmst + longitude;
  const hourAngle = rad(((localSidereal - parseRA(object.ra) + 540) % 360) - 180);
  const dec = rad(parseDec(object.dec)); const lat = rad(latitude);
  const sine = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(hourAngle);
  return deg(Math.asin(Math.max(-1, Math.min(1, sine))));
}
function updateObservation() {
  const object = OBJECTS.find((item) => item.id === activeId);
  const lat = Number($('#latitude').value);
  const lon = Number($('#longitude').value);
  const instant = new Date($('#observationTime').value);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180 || !Number.isFinite(instant.getTime())) {
    $('#altitudeValue').textContent = '—'; $('#visibilityStatus').textContent = '請檢查輸入';
    $('#visibilityStatus').className = 'visibility low'; $('#altitudePath').setAttribute('d', '');
    $('#altitudeArea').setAttribute('d', ''); return;
  }
  const alt = altitude(object, lat, lon, instant);
  $('#altitudeValue').textContent = `${alt >= 0 ? '+' : ''}${alt.toFixed(1)}°`;
  const status = $('#visibilityStatus');
  status.textContent = alt < 0 ? '地平線下' : alt < 20 ? '接近地平線' : '地平線上';
  status.className = `visibility ${alt < 20 ? 'low' : ''}`;
  const left = 24, right = 602, top = 14, bottom = 156;
  const atY = (value) => top + (90 - Math.max(-30, Math.min(90, value))) / 120 * (bottom - top);
  const points = [];
  for (let n = 0; n <= 96; n++) {
    const hours = -6 + n * 12 / 96;
    const time = new Date(instant.getTime() + hours * 3_600_000);
    points.push([left + (right - left) * n / 96, atY(altitude(object, lat, lon, time))]);
  }
  const curve = points.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  $('#altitudePath').setAttribute('d', curve);
  $('#altitudeArea').setAttribute('d', `${curve} L ${right} ${atY(0).toFixed(1)} L ${left} ${atY(0).toFixed(1)} Z`);
  $('#currentDot').setAttribute('cx', String((left + right) / 2));
  $('#currentDot').setAttribute('cy', String(atY(alt)));
}

// ── 視野近似 ──
function updateFOV() {
  const object = OBJECTS.find((item) => item.id === activeId);
  const focal = Number($('#focalLength').value);
  const [sw, sh] = $('#sensorPreset').value.split(',').map(Number);
  if (!Number.isFinite(focal) || focal < 50 || focal > 10000) {
    $('#fovValue').textContent = '請輸入 50–10000 mm 焦距'; return;
  }
  const fovW = 2 * Math.atan(sw / (2 * focal)) * 180 / Math.PI;
  const fovH = 2 * Math.atan(sh / (2 * focal)) * 180 / Math.PI;
  $('#fovValue').textContent = `${fovW.toFixed(2)}° × ${fovH.toFixed(2)}°`;
  const parts = object.size.split('x').map(Number);
  const major = parts[0] || 1; const minor = parts[1] || major;
  const pxWidth = major / 60 / fovW * 100;
  const pxHeight = minor / 60 / fovH * 100;
  const ellipse = $('#targetEllipse');
  ellipse.style.width = `${Math.max(3, Math.min(98, pxWidth))}%`;
  ellipse.style.height = `${Math.max(3, Math.min(98, pxHeight))}%`;
  $('#fovHint').textContent = pxWidth > 100 || pxHeight > 100 ? '目標可能超出視野 · 僅尺寸示意' : '目標角直徑相對視野 · 非真實形狀';
}

// ── 詳細資料 ──
function renderDetail() {
  const object = OBJECTS.find((item) => item.id === activeId);
  if (!object) return;
  $('#detailTypeEyebrow').textContent = typeName(object).toUpperCase();
  $('#objectId').textContent = object.id;
  $('#objectName').textContent = object.chinese;
  $('#objectAlt').textContent = object.english || `${CONSTELLATIONS[object.con]} · ${object.id}`;
  $('#factMag').replaceChildren(document.createTextNode(object.mag.toFixed(1) + ' '), create('small', null, 'mag'));
  $('#factSize').textContent = object.size.replace('x', '′ × ') + '′';
  $('#factConstellation').textContent = CONSTELLATIONS[object.con] || object.con;
  $('#factRA').textContent = object.ra;
  $('#factDec').textContent = object.dec;
  $('#factNGC').textContent = object.ngc ? `NGC ${object.ngc}` : '無 NGC 編號';
  $('#factClass').textContent = typeName(object);
  const starred = favorites.includes(activeId);
  $('#favoriteButton').className = `favorite-button ${starred ? 'active' : ''}`;
  $('#favoriteButton').textContent = starred ? '★ 已收藏' : '☆ 收藏';
  $('#favoriteButton').setAttribute('aria-pressed', String(starred));
  updateObservation(); updateFOV();
}
$('#copyCoordinates').addEventListener('click', async () => {
  const object = OBJECTS.find((item) => item.id === activeId);
  const text = `${object.id} | RA ${object.ra} | Dec ${object.dec} (J2000)`;
  try { await navigator.clipboard.writeText(text); notify('座標已複製'); }
  catch { notify(`無法複製；座標為 ${object.ra} / ${object.dec}`); }
});
['latitude', 'longitude', 'observationTime'].forEach((id) => $(`#${id}`).addEventListener('change', updateObservation));
['focalLength', 'sensorPreset'].forEach((id) => $(`#${id}`).addEventListener('change', updateFOV));
function localDateInput(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
$('#observationTime').value = localDateInput(new Date());
$('#datasetCount').textContent = String(OBJECTS.length);
renderList(); renderDetail();
