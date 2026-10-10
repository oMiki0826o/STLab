import Link from "next/link";
import ThemeToggle from "../components/theme-toggle";

const tools = [
  { href: "/schedule", icon: "▦", title: "Schedule Studio", text: "排一張自己的每週課表，存下來或帶走。" },
  { href: "/table", icon: "▤", title: "Table Studio", text: "把零散資料整理成表格，也能順手畫成圖。" },
  { href: "/exam", icon: "◷", title: "Exam Planner", text: "記下考試日期，看看還剩多少時間準備。" },
];

export default function Home() {
  return <main className="shell"><nav className="topbar" aria-label="Small Things Lab"><span className="brand">ST<span>Lab</span></span><div className="top-actions"><span className="version">v0.1</span><ThemeToggle /></div></nav><header className="hero"><p className="eyebrow">SMALL THINGS LAB · 小工具集</p><h1>想到什麼，<br /><em>就先做成一個能用的東西。</em></h1><p className="lede">課表、資料與考試倒數。沒有帳號，資料留在自己的瀏覽器裡。</p></header><section className="tool-grid" aria-label="工具列表">{tools.map((tool, index) => <Link className="tool-card" href={tool.href} key={tool.href}><span className="tool-index">0{index + 1}</span><span className="tool-icon" aria-hidden="true">{tool.icon}</span><h2>{tool.title}</h2><p>{tool.text}</p><span className="arrow">開啟工具 <span aria-hidden="true">→</span></span></Link>)}</section><footer>Small Things Lab · 資料只留在本機</footer></main>;
}
