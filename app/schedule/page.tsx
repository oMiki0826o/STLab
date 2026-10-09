"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { download, load, save } from "../../lib/storage";
import { parseScheduleProject, SchedulePlan } from "../../lib/schedule";
import ThemeToggle from "../../components/theme-toggle";

const days = ["一", "二", "三", "四", "五"];
const periods = ["第一節", "第二節", "第三節", "第四節", "午休", "第五節", "第六節", "第七節", "第八節"];
const blank = (): SchedulePlan => Object.fromEntries(periods.flatMap((period) => days.map((day) => [`${period}-${day}`, ""])));

function escapeXml(value: string) { return value.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char] ?? char)); }

export default function SchedulePage() {
  const [plan, setPlan] = useState<SchedulePlan>(blank);
  const [title, setTitle] = useState("我的一週課表");
  const [notice, setNotice] = useState("");
  useEffect(() => { setPlan(load("stlab.schedule", blank())); setTitle(load("stlab.schedule.title", "我的一週課表")); }, []);
  function update(key: string, value: string) { const next = { ...plan, [key]: value }; setPlan(next); save("stlab.schedule", next); }
  function updateTitle(value: string) { setTitle(value); save("stlab.schedule.title", value); }
  function importFile(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; file.text().then((text) => { const result = parseScheduleProject(text, blank()); setPlan(result.plan); save("stlab.schedule", result.plan); if (result.title) { setTitle(result.title); save("stlab.schedule.title", result.title); } setNotice("已匯入課表"); }).catch(() => setNotice("檔案格式無法讀取")); event.target.value = ""; }
  function clear() { const next = blank(); setPlan(next); save("stlab.schedule", next); setNotice("已清空本機課表"); }
  function downloadPng() {
    const cellWidth = 210, cellHeight = 76, labelWidth = 150, top = 110, width = labelWidth + days.length * cellWidth, height = top + periods.length * cellHeight + 30;
    const shapes: string[] = [`<rect width="${width}" height="${height}" fill="#ffffff"/><text x="30" y="52" font-family="sans-serif" font-size="30" font-weight="700" fill="#17212b">${escapeXml(title)}</text>`];
    shapes.push(`<rect x="0" y="${top}" width="${width}" height="${cellHeight}" fill="#f2dfd8"/>`);
    shapes.push(`<text x="${labelWidth / 2}" y="${top + 47}" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="700" fill="#17212b">時段</text>`);
    days.forEach((day, index) => shapes.push(`<text x="${labelWidth + index * cellWidth + cellWidth / 2}" y="${top + 47}" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="700" fill="#17212b">週${day}</text>`));
    periods.forEach((period, row) => { const y = top + (row + 1) * cellHeight; shapes.push(`<rect x="0" y="${y}" width="${width}" height="${cellHeight}" fill="${period === "午休" ? "#fff4e8" : "#ffffff"}"/>`); shapes.push(`<text x="${labelWidth / 2}" y="${y + 47}" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#17212b">${escapeXml(period)}</text>`); days.forEach((day, col) => { const value = plan[`${period}-${day}`] ?? ""; shapes.push(`<text x="${labelWidth + col * cellWidth + 16}" y="${y + 44}" font-family="sans-serif" font-size="17" fill="#17212b">${escapeXml(value)}</text>`); }); });
    for (let x = 0; x <= width; x += x === 0 ? labelWidth : cellWidth) shapes.push(`<line x1="${x}" y1="${top}" x2="${x}" y2="${height - 30}" stroke="#dfe2dc"/>`);
    for (let y = top; y <= height - 30; y += cellHeight) shapes.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#dfe2dc"/>`);
    const image = new Image(); image.onload = () => { const canvas = document.createElement("canvas"); canvas.width = width * 2; canvas.height = height * 2; const context = canvas.getContext("2d"); if (!context) return; context.drawImage(image, 0, 0, canvas.width, canvas.height); canvas.toBlob((blob) => { if (blob) download("schedule.png", blob, "image/png"); }); }; image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${shapes.join("")}</svg>`)}`;
  }
  return <main className="app"><div className="app-header"><div><Link className="back" href="/">← STLab</Link><h1>Schedule Studio</h1><p className="muted">上午四節、午休、下午四節，像真正的學校課表一樣安排一週。</p></div><div className="top-actions"><ThemeToggle /></div></div><div className="actions"><button className="button" onClick={() => download("schedule.json", JSON.stringify({ title, plan }, null, 2), "application/json")}>匯出 JSON</button><button className="button" onClick={downloadPng}>下載 PNG</button><label className="button">匯入 JSON<input hidden type="file" accept="application/json,.json" onChange={importFile} /></label><button className="button danger" onClick={clear}>清空</button>{notice && <span className="notice" role="status">{notice}</span>}</div><section className="panel"><label className="field-label" htmlFor="schedule-title">課表名稱</label><input id="schedule-title" className="field title-field" value={title} onChange={(event) => updateTitle(event.target.value)} /></section><section className="panel"><div className="schedule-grid"><div className="schedule-cell schedule-head">時段</div>{days.map((day) => <div className="schedule-cell schedule-head" key={day}>週{day}</div>)}{periods.flatMap((period) => [<div className="schedule-cell schedule-head" key={period}>{period}</div>, ...days.map((day) => <div className={`schedule-cell ${period === "午休" ? "break-cell" : ""}`} key={`${period}-${day}`}><input value={plan[`${period}-${day}`]} onChange={(event) => update(`${period}-${day}`, event.target.value)} placeholder={period === "午休" ? "午休" : "輸入課程"} /></div>)])}</div></section></main>;
}
