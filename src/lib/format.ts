const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });
const peso2 = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const num = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const fmtPeso = (v: number) => peso.format(v);
export const fmtPeso2 = (v: number) => peso2.format(v);
export const fmtPesoCompact = (v: number) => `${v < 0 ? '−' : ''}₱${compact.format(Math.abs(v))}`;
export const fmtNum = (v: number) => num.format(v);
export const fmtCompact = (v: number) => compact.format(v);
export const fmtPct = (v: number, dp = 1) => `${v.toFixed(dp)}%`;
export const fmtSignedPct = (v: number, dp = 1) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v).toFixed(dp)}%`;
export const fmtRatio = (v: number, dp = 2) => `${v.toFixed(dp)}×`;

/** Months between two YYYY-MM strings, inclusive of the start month. */
export function durationLabel(start: string, end: string | 'present') {
  const [sy, sm] = start.split('-').map(Number);
  const now = new Date();
  const [ey, em] = end === 'present' ? [now.getFullYear(), now.getMonth() + 1] : end.split('-').map(Number);
  const months = Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr${y > 1 ? 's' : ''}` : '', m ? `${m} mo${m > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ');
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function monthLabel(ym: string | 'present') {
  if (ym === 'present') return 'Present';
  const [y, m] = ym.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}
