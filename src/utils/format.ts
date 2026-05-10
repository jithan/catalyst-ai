export const pct = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
export const fmtPct = (value: number) => `${value.toFixed(1)}%`;
export const f1 = (value: number) => Number(value).toFixed(1);
export const todayISO = (date?: Date) => {
  const dt = date || new Date();
  return dt.toISOString().slice(0, 10);
};
export const addDays = (isoDate: string, days: number) => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
export const diffDays = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
export const weekStartISO = (dateString?: string) => {
  const dt = dateString ? new Date(`${dateString}T00:00:00Z`) : new Date();
  const dow = dt.getUTCDay();
  const back = (dow + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - back);
  dt.setUTCHours(0, 0, 0, 0);
  return dt.toISOString().slice(0, 10);
};
