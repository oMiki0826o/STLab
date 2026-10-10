"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "../../components/theme-toggle";
import { download, load, save } from "../../lib/storage";

type Exam = { id: string; subject: string; date: string; progress: number };
const storageKey = "stlab.exams";

function sortExams(items: Exam[]) { return [...items].sort((a, b) => a.date.localeCompare(b.date)); }
function daysUntil(date: string) { return Math.ceil((new Date(`${date}T00:00:00`).getTime() - new Date(new Date().toDateString()).getTime()) / 86400000); }
function parseExamFile(value: unknown): Exam[] {
  if (!Array.isArray(value)) throw new Error("檔案格式不是考試清單。");
  return sortExams(value.map((item, index) => {
    if (!item || typeof item !== "object") throw new Error(`第 ${index + 1} 筆資料無效。`);
    const exam = item as Partial<Exam>;
    if (typeof exam.subject !== "string" || !exam.subject.trim() || typeof exam.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(exam.date)) throw new Error(`第 ${index + 1} 筆缺少有效科目或日期。`);
    return { id: typeof exam.id === "string" ? exam.id : crypto.randomUUID(), subject: exam.subject.trim(), date: exam.date, progress: Math.min(100, Math.max(0, Number(exam.progress) || 0)) };
  }));
}

export default function ExamPlanner() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => setExams(sortExams(load(storageKey, []))), []);
  function update(next: Exam[]) { const sorted = sortExams(next); setExams(sorted); save(storageKey, sorted); }
  function add() { if (!subject.trim() || !date) { setMessage(!subject.trim() && !date ? "請填寫科目與考試日期。" : !subject.trim() ? "請先填寫科目。" : "請選擇考試日期。"); return; } setMessage(""); update([...exams, { id: crypto.randomUUID(), subject: subject.trim(), date, progress: 0 }]); setSubject(""); setDate(""); }
  function importFile(file: File) { file.text().then(text => { try { update(parseExamFile(JSON.parse(text))); setMessage("已匯入考試清單。"); } catch (error) { setMessage(error instanceof Error ? error.message : "無法讀取考試清單。"); } }).catch(() => setMessage("無法讀取檔案。")); }
  function changeProgress(id: string, progress: number) { update(exams.map(exam => exam.id === id ? { ...exam, progress } : exam)); }
  const average = useMemo(() => exams.length ? Math.round(exams.reduce((sum, exam) => sum + exam.progress, 0) / exams.length) : 0, [exams]);
  return <main className="app"><div className="app-header"><div><Link className="back" href="/">← STLab</Link><h1>Exam Planner</h1><p className="muted">記下考試日期，看看還剩多少時間準備。</p></div><ThemeToggle /></div><section className="panel exam-form"><label>科目<input className="field" required aria-required="true" value={subject} onChange={event => { setSubject(event.target.value); setMessage(""); }} placeholder="例如：物理" /></label><label>考試日期<input className="field" required aria-required="true" type="date" value={date} onChange={event => { setDate(event.target.value); setMessage(""); }} /></label><button className="button primary" onClick={add}>＋加入考試</button>{message && <p className="form-error" role="alert">{message}</p>}</section><section className="panel exam-summary"><strong>{exams.length}</strong><span>場考試</span><strong>{average}%</strong><span>平均準備度</span><button className="button" onClick={() => download("exam-plan.json", JSON.stringify(exams, null, 2), "application/json")}>匯出 JSON</button><label className="button">匯入 JSON<input hidden type="file" accept="application/json,.json" onChange={event => { const file = event.target.files?.[0]; if (file) importFile(file); event.target.value = ""; }} /></label></section>{!exams.length ? <p className="empty-state">還沒有考試，先加入一個科目與日期。</p> : <section className="exam-list">{exams.map(exam => { const days = daysUntil(exam.date); return <article className="exam-card" key={exam.id}><div className="exam-card-head"><div><h2>{exam.subject}</h2><time dateTime={exam.date}>{exam.date}</time></div><strong className={days < 0 ? "overdue" : "countdown"}>{days < 0 ? "已結束" : days === 0 ? "今天" : `${days} 天`}</strong></div><label className="progress-label">準備度 {exam.progress}%<input type="range" min="0" max="100" value={exam.progress} onChange={event => changeProgress(exam.id, Number(event.target.value))} /></label><button className="button danger" onClick={() => update(exams.filter(item => item.id !== exam.id))}>移除</button></article>; })}</section>}</main>;
}
