import Link from "next/link";
import ThemeToggle from "../components/theme-toggle";

export default function NotFound() {
  return <main className="app not-found"><div className="app-header"><div><span className="eyebrow">SMALL THINGS LAB</span><h1>這一頁沒有排進課表。</h1><p className="muted">網址可能寫錯了，或這個小工具還沒被做出來。</p></div><ThemeToggle /></div><section className="panel not-found-panel"><span className="not-found-code">404</span><p>先回到工具桌，再挑一個真的能用的東西。</p><Link className="button primary" href="/">回到 STLab</Link></section></main>;
}
