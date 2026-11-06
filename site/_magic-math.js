// Pure calculation helpers shared by the browser calculator and Node checks.
function lrMagicParse(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value !== 'string') return NaN;

  const text = value.trim();
  // A single decimal separator is allowed; grouping separators and partial input are not.
  if (!/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)(?:[eE][+-]?\d+)?$/.test(text)) return NaN;
  const number = Number(text.replace(',', '.'));
  return Number.isFinite(number) ? number : NaN;
}

function lrMagicCalculate(input) {
  function invalid(error) {
    return { valid: false, error, M: NaN, Pm: NaN, delta: NaN, logDelta: NaN };
  }

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return invalid('Введите все показатели числами.');
  }

  const P = lrMagicParse(input.P);
  const G = lrMagicParse(input.G);
  const L = lrMagicParse(input.L);
  const A = lrMagicParse(input.A);
  const R = lrMagicParse(input.R);
  if (![P, G, L, A, R].every(Number.isFinite)) {
    return invalid('Введите все показатели числами.');
  }
  if (P === 0) return invalid('Для P = 0 формула не определена.');
  if (P < 0 || P > 1) return invalid('P должна быть больше 0 и не больше 1.');
  if ([G, L, A, R].some(value => value < 0 || value > 1)) {
    return invalid('Показатели G, L, A и R должны быть от 0 до 1.');
  }

  const M = G * L * (1 - A) * (1 - R);
  let delta = 0;
  let logDelta = -Infinity;
  if (P < 1 && M > 0) {
    // Keep the logarithm even when the positive increment underflows to zero.
    // Division avoids overflowing 1/P before multiplying by a tiny log(M).
    logDelta = Math.log1p(-P) + Math.log(M) / P;
    // Math.pow(1, Infinity) is NaN, so handle the maximum-strength boundary directly.
    delta = M === 1 ? 1 - P : (1 - P) * Math.pow(M, 1 / P);
  }

  return { valid: true, error: null, M, Pm: Math.min(1, P + delta), delta, logDelta };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { lrMagicParse, lrMagicCalculate };
}
