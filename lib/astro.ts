export type AstroObject = { id: string; name: string; aliases: string[]; type: string; constellation: string; ra: string; dec: string; angularSize: string; distance: string; magnitude: number; note: string };
export const catalog: AstroObject[] = [
  {id:"m31",name:"仙女座星系 M31",aliases:["NGC 224","Andromeda Galaxy"],type:"星系",constellation:"仙女座",ra:"00h 42m 44s",dec:"+41° 16′",angularSize:"3.2° × 1.0°",distance:"254 萬光年",magnitude:3.44,note:"肉眼可見的鄰近大型星系。"},
  {id:"m42",name:"獵戶座大星雲 M42",aliases:["NGC 1976","Orion Nebula"],type:"星雲",constellation:"獵戶座",ra:"05h 35m 17s",dec:"−05° 23′",angularSize:"1.1°",distance:"1,340 光年",magnitude:4.0,note:"活躍的恆星形成區。"},
  {id:"m45",name:"昴宿星團 M45",aliases:["Pleiades","七姊妹星團"],type:"星團",constellation:"金牛座",ra:"03h 47m 24s",dec:"+24° 07′",angularSize:"1.8°",distance:"444 光年",magnitude:1.6,note:"冬季天空中容易辨認的藍色星團。"},
  {id:"jupiter",name:"木星",aliases:["Jupiter"],type:"行星",constellation:"依日期變化",ra:"—",dec:"—",angularSize:"約 30–50″",distance:"約 6 億公里",magnitude:-2.7,note:"太陽系最大的行星。"},
  {id:"saturn",name:"土星",aliases:["Saturn"],type:"行星",constellation:"依日期變化",ra:"—",dec:"—",angularSize:"約 15–20″",distance:"約 13 億公里",magnitude:0.7,note:"以壯觀的環系統聞名。"},
];
export function visibleCatalog(query: string, type: string) { const q = query.trim().toLowerCase(); return catalog.filter(item => (!type || item.type === type) && (!q || `${item.name} ${item.aliases.join(" ")} ${item.constellation} ${item.note}`.toLowerCase().includes(q))); }
