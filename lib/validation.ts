import type { ChartSettings } from "./chart";
import type { TableData } from "./table";

export function validateTable(data: TableData): string[] {
  const errors: string[] = [];
  if (!data.headers.length) errors.push("至少需要一個欄位。");
  if (data.headers.some((header) => !header.trim())) errors.push("欄位名稱不能留白。");
  if (data.rows.some((row) => row.length !== data.headers.length)) errors.push("資料列欄數與標題不一致。");
  return errors;
}

export function validateChart(chart: ChartSettings): string[] {
  const errors: string[] = [];
  if (!chart.title.trim()) errors.push("請填寫圖表標題。");
  if (!chart.xLabel.trim() || !chart.yLabel.trim()) errors.push("請填寫 X 軸與 Y 軸名稱。");
  if (!Number.isFinite(chart.xMax) || chart.xMax <= 0) errors.push("X 軸最大值必須大於 0。");
  if (!Number.isFinite(chart.yMax) || chart.yMax <= 0) errors.push("Y 軸最大值必須大於 0。");
  if (!Number.isFinite(chart.xStep) || chart.xStep <= 0) errors.push("X 軸刻度間距必須大於 0。");
  if (!Number.isFinite(chart.yStep) || chart.yStep <= 0) errors.push("Y 軸刻度間距必須大於 0。");
  if (chart.points.some((point) => point.x < 0 || point.y < 0 || point.x > chart.xMax || point.y > chart.yMax)) errors.push("資料點必須落在目前設定的座標範圍內。");
  return errors;
}
