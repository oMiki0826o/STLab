"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import ThemeToggle from "../../components/theme-toggle";
import { download, load, save } from "../../lib/storage";
import { parseScheduleProject, SchedulePlan, swapScheduleCells } from "../../lib/schedule";

const days = ["一", "二", "三", "四", "五"];
const periods = ["第一節", "第二節", "第三節", "第四節", "午休", "第五節", "第六節", "第七節", "第八節"];
const blank = (): SchedulePlan => Object.fromEntries(periods.flatMap(period => days.map(day => [`${period}-${day}`, ""])));

export default function SchedulePage() {
  const [plan, setPlan] = useState<SchedulePlan>(blank);
  const [week, setWeek] = useState<"A" | "B">("A");
  const [title, setTitle] = useState("我的一週課表");
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => { const stored = load("stlab.schedule", blank()); const hasWeeks = Object.keys(stored).some(key => key.startsWith("A-")); setPlan(hasWeeks ? stored : Object.fromEntries(Object.entries(stored).map(([key, value]) => [`A-${key}`, value]))); setTitle(load("stlab.schedule.title", "我的一週課表")); }, []);
  const keyFor = (key: string) => `${week}-${key}`;
  const valueFor = (key: string) => plan[keyFor(key)] ?? plan[key] ?? "";
  const update = (key: string, value: string) => { const next = { ...plan, [keyFor(key)]: value }; setPlan(next); save("stlab.schedule", next); };
  const choose = (key: string) => { if (!selected) { setSelected(key); setNotice("已選取第一格，請再選一格交換課程"); return; } if (selected === key) { setSelected(null); setNotice("已取消選取"); return; } const next = swapScheduleCells(plan, keyFor(selected), keyFor(key)); setPlan(next); save("stlab.schedule", next); setSelected(null); setNotice("已交換兩格課程"); };
  const importFile = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; file.text().then(text => { const result = parseScheduleProject(text, blank()); const imported = Object.keys(result.plan).some(key => key.startsWith("A-")) ? result.plan : Object.fromEntries(Object.entries(result.plan).map(([key, value]) => [`A-${key}`, value])); setPlan(imported); save("stlab.schedule", imported); if (result.title) { setTitle(result.title); save("stlab.schedule.title", result.title); } setNotice("已匯入課表"); }).catch(() => setNotice("檔案格式無法讀取")); event.target.value = ""; };
  const clear = () => { const empty = blank(); const next = Object.fromEntries(["A", "B"].flatMap(letter => Object.entries(empty).map(([key, value]) => [`${letter}-${key}`, value]))); setPlan(next); save("stlab.schedule", next); setNotice("已清空 A／B 週課表"); };
  const downloadPng = () => { const canvas = document.createElement("canvas"); canvas.width = 1400; canvas.height = 900; const context = canvas.getContext("2d"); if (!context) return; context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height); context.fillStyle = "#17212b"; context.font = "bold 32px sans-serif"; context.fillText(title, 36, 52); context.font = "18px sans-serif"; periods.forEach((period, row) => { const y = 96 + row * 82; context.fillText(period, 24, y); days.forEach((day, column) => context.fillText(valueFor(`${period}-${day}`), 180 + column * 240, y)); }); canvas.toBlob(blob => blob && download("schedule.png", blob, "image/png")); };
  return <main className="app">
    <div className="app-header"><div><Link className="back" href="/">← STLab</Link><h1>Schedule Studio</h1><p className="muted">上午四節、午休、下午四節，像真正的學校課表一樣安排一週。</p></div><ThemeToggle /></div>
    <div className="actions"><button className={`button ${week === "A" ? "primary" : ""}`} onClick={() => setWeek("A")}>A 週</button><button className={`button ${week === "B" ? "primary" : ""}`} onClick={() => setWeek("B")}>B 週</button><button className="button" onClick={() => download("schedule.json", JSON.stringify({ title, plan }, null, 2), "application/json")}>匯出 JSON</button><button className="button" onClick={downloadPng}>下載 PNG</button><label className="button">匯入 JSON<input hidden type="file" accept="application/json,.json" onChange={importFile} /></label><button className="button danger" onClick={clear}>清空</button>{notice && <span className="notice" role="status">{notice}</span>}</div>
    <section className="panel"><label className="field-label" htmlFor="schedule-title">課表名稱</label><input id="schedule-title" className="field title-field" value={title} onChange={event => { setTitle(event.target.value); save("stlab.schedule.title", event.target.value); }} /><p className="muted">交換課程：點選第一格，再點選第二格即可互換內容。</p></section>
    <section className="panel"><div className="schedule-grid"><div className="schedule-cell schedule-head">時段</div>{days.map(day => <div className="schedule-cell schedule-head" key={day}>週{day}</div>)}{periods.flatMap(period => [<div className="schedule-cell schedule-head" key={period}>{period}</div>, ...days.map(day => { const key = `${period}-${day}`; return <div className={`schedule-cell ${period === "午休" ? "break-cell" : ""} ${selected === key ? "selected-cell" : ""}`} key={key} onClick={() => choose(key)}><input value={valueFor(key)} onChange={event => update(key, event.target.value)} onClick={event => event.stopPropagation()} placeholder={period === "午休" ? "午休" : "輸入課程"} /></div>; })])}</div></section>
  </main>;
}
