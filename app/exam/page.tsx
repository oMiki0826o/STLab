"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "../../components/theme-toggle";
import { download, load, save } from "../../lib/storage";

type Exam = { id: string; subject: string; date: string; progress: number };
const key = "stlab.exams";
const initial: Exam[] = [];
function daysUntil(date: string) { return Math.ceil((new Date(`${date}T00:00:00`).getTime() - new Date(new Date().toDateString()).getTime()) / 86400000); }

export default function ExamPlanner() {
  const [exams, setExams] = useState<Exam[]>(initial);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => setExams(load(key, initial)), []);
  function update(next: Exam[]) { setExams(next); save(key, next); }
  function add() { if (!subject.trim() || !date) return; update([...exams, { id: crypto.randomUUID(), subject: subject.trim(), date, progress: 0 }].sort((a, b) => a.date.localeCompare(b.date))); setSubject(""); setDate(""); }
  function remove(id: string) { update(exams.filter((exam) => exam.id !== id)); }
  function changeProgress(id: string, progress: number) { update(exams.map((exam) => exam.id === id ? { ...exam, progress } : exam)); }
  const average = useMemo(() => exams.length ? Math.round(exams.reduce((sum, exam) => sum + exam.progress, 0) / exams.length) : 0, [exams]);
  return <main className="app"><div className="app-header"><div><Link className="back" href="/">← STLab</Link><h1>Exam Planner</h1><p className="muted">把考試日期、倒數與準備進度放在同一頁。</p></div><ThemeToggle /></div><section className="panel exam-form"><label>科目<input className="field" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="例如：物理" /></label><label>考試日期<input className="field" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><button className="button primary" onClick={add}>＋加入考試</button></section><section className="panel exam-summary"><strong>{exams.length}</strong><span>場考試</span><strong>{average}%</strong><span>平均準備度</span><button className="button" onClick={() => download("exam-plan.json", JSON.stringify(exams, null, 2), "application/json")}>匯出 JSON</button></section>{exams.length === 0 ? <p className="empty-state">還沒有考試，先加入一個科目與日期。</p> : <section className="exam-list">{exams.map((exam) => { const days = daysUntil(exam.date); return <article className="exam-card" key={exam.id}><div className="exam-card-head"><div><h2>{exam.subject}</h2><time dateTime={exam.date}>{exam.date}</time></div><strong className={days < 0 ? "overdue" : "countdown"}>{days < 0 ? "已結束" : days === 0 ? "今天" : `${days} 天`}</strong></div><label className="progress-label">準備度 {exam.progress}%<input type="range" min="0" max="100" value={exam.progress} onChange={(event) => changeProgress(exam.id, Number(event.target.value))} /></label><button className="button danger" onClick={() => remove(exam.id)}>移除</button></article>; })}</section>}</main>;
}
