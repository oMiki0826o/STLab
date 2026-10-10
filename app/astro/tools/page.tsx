import Link from "next/link";
import ThemeToggle from "../../../components/theme-toggle";
const tools=[
  ["Astro Catalog","搜尋 Messier、NGC、IC 與常用亮星，查看定位提示。","/astro/"],
  ["Sky Tonight","輸入時間與位置，估算目標高度角與方位角。","/astro/tonight/"],
  ["Astro Planner","估算望遠鏡視野、曝光張數與月相。","/astro/planner/"],
  ["Target Comparison","把兩個天體放在一起比較觀測與拍攝條件。","/astro/compare/"],
];
export default function AstroTools(){return <main className="app"><div className="app-header"><div><Link className="back" href="/">← STLab</Link><h1>Astro Tools</h1><p className="muted">先查目標，再決定今晚要看什麼、怎麼拍。</p></div><ThemeToggle/></div><section className="astro-tools-grid">{tools.map(([title,description,href],index)=><Link className="astro-tool-card" href={href} key={title}><span className="eyebrow">0{index+1}</span><h2>{title}</h2><p>{description}</p><span className="arrow">開啟工具 →</span></Link>)}</section></main>}
