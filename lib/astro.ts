export type AstroObject = { id: string; name: string; type: string; distance: string; magnitude: number; note: string };
export const catalog: AstroObject[] = [
  {id:"m31",name:"仙女座星系 M31",type:"星系",distance:"254 萬光年",magnitude:3.44,note:"肉眼可見的鄰近大型星系。"},
  {id:"m42",name:"獵戶座大星雲 M42",type:"星雲",distance:"1,340 光年",magnitude:4.0,note:"活躍的恆星形成區。"},
  {id:"m45",name:"昴宿星團 M45",type:"星團",distance:"444 光年",magnitude:1.6,note:"冬季天空中容易辨認的藍色星團。"},
  {id:"jupiter",name:"木星",type:"行星",distance:"約 6 億公里",magnitude:-2.7,note:"太陽系最大的行星。"},
  {id:"saturn",name:"土星",type:"行星",distance:"約 13 億公里",magnitude:0.7,note:"以壯觀的環系統聞名。"},
];
export function visibleCatalog(query: string, type: string) { const q = query.trim().toLowerCase(); return catalog.filter(item => (!type || item.type === type) && (!q || `${item.name} ${item.note}`.toLowerCase().includes(q))); }
