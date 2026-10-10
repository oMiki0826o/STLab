export type AstroObject = { id: string; name: string; aliases: string[]; type: string; constellation: string; ra: string; dec: string; angularSize: string; distance: string; magnitude: number; note: string };
export const catalog: AstroObject[] = [
  {id:"m31",name:"仙女座星系 M31",aliases:["NGC 224","Andromeda Galaxy"],type:"星系",constellation:"仙女座",ra:"00h 42m 44s",dec:"+41° 16′",angularSize:"3.2° × 1.0°",distance:"254 萬光年",magnitude:3.44,note:"肉眼可見的鄰近大型星系。"},
  {id:"m42",name:"獵戶座大星雲 M42",aliases:["NGC 1976","Orion Nebula"],type:"星雲",constellation:"獵戶座",ra:"05h 35m 17s",dec:"−05° 23′",angularSize:"1.1°",distance:"1,340 光年",magnitude:4.0,note:"活躍的恆星形成區。"},
  {id:"m45",name:"昴宿星團 M45",aliases:["Pleiades","七姊妹星團"],type:"星團",constellation:"金牛座",ra:"03h 47m 24s",dec:"+24° 07′",angularSize:"1.8°",distance:"444 光年",magnitude:1.6,note:"冬季天空中容易辨認的藍色星團。"},
  {id:"jupiter",name:"木星",aliases:["Jupiter"],type:"行星",constellation:"依日期變化",ra:"—",dec:"—",angularSize:"約 30–50″",distance:"約 6 億公里",magnitude:-2.7,note:"太陽系最大的行星。"},
  {id:"saturn",name:"土星",aliases:["Saturn"],type:"行星",constellation:"依日期變化",ra:"—",dec:"—",angularSize:"約 15–20″",distance:"約 13 億公里",magnitude:0.7,note:"以壯觀的環系統聞名。"},
  {id:"m8",name:"礁湖星雲 M8",aliases:["NGC 6523","Lagoon Nebula"],type:"星雲",constellation:"人馬座",ra:"18h 03m 37s",dec:"−24° 23′",angularSize:"90′ × 40′",distance:"4,100 光年",magnitude:6.0,note:"夏季南方天空的大型發射星雲。"},
  {id:"m13",name:"武仙座大球狀星團 M13",aliases:["NGC 6205","Hercules Globular Cluster"],type:"星團",constellation:"武仙座",ra:"16h 41m 41s",dec:"+36° 27′",angularSize:"20′",distance:"25,000 光年",magnitude:5.8,note:"北天最容易觀察的球狀星團之一。"},
  {id:"m27",name:"啞鈴星雲 M27",aliases:["NGC 6853","Dumbbell Nebula"],type:"行星狀星雲",constellation:"狐狸座",ra:"19h 59m 37s",dec:"+22° 43′",angularSize:"8′ × 6′",distance:"1,360 光年",magnitude:7.5,note:"適合夏季用小型望遠鏡觀察的行星狀星雲。"},
  {id:"m57",name:"環狀星雲 M57",aliases:["NGC 6720","Ring Nebula"],type:"行星狀星雲",constellation:"天琴座",ra:"18h 53m 35s",dec:"+33° 02′",angularSize:"1.4′",distance:"2,300 光年",magnitude:8.8,note:"小而明亮，望遠鏡中可辨認環狀輪廓。"},
  {id:"ngc7000",name:"北美星雲 NGC 7000",aliases:["North America Nebula"],type:"星雲",constellation:"天鵝座",ra:"20h 59m 17s",dec:"+44° 31′",angularSize:"約 2.0°",distance:"2,590 光年",magnitude:4.0,note:"面積很大，適合廣角攝影與窄頻濾鏡。"},
];
export function visibleCatalog(query: string, type: string) { const q = query.trim().toLowerCase(); return catalog.filter(item => (!type || item.type === type) && (!q || `${item.name} ${item.aliases.join(" ")} ${item.constellation} ${item.note}`.toLowerCase().includes(q))); }
