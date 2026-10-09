export type ChartPoint = { x: number; y: number };
export type ChartSettings = { title: string; xLabel: string; yLabel: string; xUnit: string; yUnit: string; xMax: number; yMax: number; xStep: number; yStep: number; points: ChartPoint[] };
export const defaultChart: ChartSettings = { title: "實驗紀錄", xLabel: "X", yLabel: "Y", xUnit: "單位", yUnit: "單位", xMax: 40, yMax: 100, xStep: 10, yStep: 25, points: [{x:0,y:0},{x:10,y:20},{x:20,y:55},{x:30,y:72},{x:40,y:90}] };
export function parsePoints(text: string): ChartPoint[] { return text.split(/\r?\n/).map(line => line.split(/[,\s]+/).map(Number)).filter(pair => pair.length >= 2 && pair.every(Number.isFinite)).map(([x,y]) => ({x,y})); }
export function pointsText(points: ChartPoint[]): string { return points.map(({x,y}) => `${x}, ${y}`).join("\n"); }
