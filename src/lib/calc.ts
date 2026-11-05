/**
 * Pure business-logic functions used by the simulators. Kept free of UI so
 * the formulas are easy to read and verify.
 */

export type RoasMode = 'funnel' | 'direct';

export type RoasInput = {
  mode: RoasMode;
  spend: number;
  clicks: number;
  /** Conversion rate in percent (orders ÷ clicks × 100). Used in funnel mode. */
  cvr: number;
  aov: number;
  /** Attributed advertising revenue. Used in direct mode. */
  revenue: number;
  /** Gross margin in percent, used for profitability. */
  margin: number;
};

export type RoasOutput = {
  revenue: number;
  orders: number;
  cvr: number;
  roas: number | null;
  acos: number | null;
  cpa: number | null;
  cpc: number | null;
  grossProfit: number;
  contribution: number;
  breakEvenRoas: number | null;
};

export function computeRoas(i: RoasInput): RoasOutput {
  const spend = Math.max(0, i.spend);
  const clicks = Math.max(0, i.clicks);
  const aov = Math.max(0, i.aov);
  let orders: number;
  let revenue: number;
  if (i.mode === 'funnel') {
    orders = clicks * (Math.max(0, i.cvr) / 100);
    revenue = orders * aov;
  } else {
    revenue = Math.max(0, i.revenue);
    orders = aov > 0 ? revenue / aov : 0;
  }
  const cvr = clicks > 0 ? (orders / clicks) * 100 : 0;
  const grossProfit = revenue * (Math.max(0, i.margin) / 100);
  return {
    revenue,
    orders,
    cvr,
    roas: spend > 0 ? revenue / spend : null,
    acos: revenue > 0 ? (spend / revenue) * 100 : null,
    cpa: orders > 0 ? spend / orders : null,
    cpc: clicks > 0 ? spend / clicks : null,
    grossProfit,
    contribution: grossProfit - spend,
    breakEvenRoas: i.margin > 0 ? 100 / i.margin : null,
  };
}

export type CompliancePolicy = 'below' | 'both';
export type ComplianceStatus = 'compliant' | 'below' | 'above';

export type ComplianceResult =
  | { ok: false; error: string }
  | {
      ok: true;
      variance: number;
      variancePct: number;
      tolerance: number;
      status: ComplianceStatus;
      compliant: boolean;
      explanation: string;
    };

/**
 * Compare an observed selling price against the authorized price.
 * - 'below' policy: only prices under (authorized − tolerance) are non-compliant.
 * - 'both' policy: prices outside ±tolerance in either direction are flagged.
 */
export function checkCompliance(authorized: number, observed: number, tolerancePct = 0, policy: CompliancePolicy = 'below'): ComplianceResult {
  if (!Number.isFinite(authorized) || authorized <= 0) return { ok: false, error: 'Enter an authorized price greater than zero.' };
  if (!Number.isFinite(observed) || observed < 0) return { ok: false, error: 'Enter an observed price of zero or more.' };
  const tolerance = Math.max(0, Number.isFinite(tolerancePct) ? tolerancePct : 0);
  const variance = observed - authorized;
  const variancePct = (variance / authorized) * 100;
  const eps = 1e-9;
  const isBelow = variancePct < -tolerance - eps;
  const isAbove = variancePct > tolerance + eps;
  let status: ComplianceStatus = 'compliant';
  if (isBelow) status = 'below';
  else if (isAbove && policy === 'both') status = 'above';
  const compliant = status === 'compliant';
  const absPct = Math.abs(variancePct).toFixed(1);
  const tolText = tolerance > 0 ? `the ${tolerance}% tolerance` : 'a zero tolerance';
  let explanation: string;
  if (variance === 0) explanation = 'The observed price matches the authorized price exactly.';
  else if (status === 'below') explanation = `The observed price is ${absPct}% below the authorized price — beyond ${tolText}. This would appear on the exception report for review.`;
  else if (status === 'above') explanation = `The observed price is ${absPct}% above the authorized price — beyond ${tolText} under a two-sided policy. Flagged for review.`;
  else if (variance < 0) explanation = `The observed price is ${absPct}% below the authorized price, which is within ${tolText}.`;
  else if (policy === 'below') explanation = `The observed price is ${absPct}% above the authorized price. Under a below-price policy, selling above the authorized price is not flagged.`;
  else explanation = `The observed price is ${absPct}% above the authorized price, which is within ${tolText}.`;
  return { ok: true, variance, variancePct, tolerance, status, compliant, explanation };
}
