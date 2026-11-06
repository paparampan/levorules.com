const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { lrMagicParse, lrMagicCalculate } = require('../site/_magic-math.js');

let checks = 0;
function check(name, run) {
  try {
    run();
    checks += 1;
  } catch (error) {
    error.message = `${name}: ${error.message}`;
    throw error;
  }
}

function near(actual, expected, relative = 1e-12, absolute = 1e-15) {
  assert.ok(Number.isFinite(actual), `Expected a finite value, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= Math.max(absolute, Math.abs(expected) * relative),
    `${actual} is not close to ${expected}`);
}

const base = { P: 0.5, G: 0.8, L: 0.7, A: 0.3, R: 0.2 };

check('Strict finite decimal parsing', () => {
  for (const [input, expected] of [
    [0, 0], [-0.25, -0.25], [Number.MIN_VALUE, Number.MIN_VALUE],
    [' 0,25 ', 0.25], ['0.25', 0.25], [',5', 0.5], ['.5', 0.5],
    ['+1', 1], ['-0,2', -0.2], ['1e-3', 0.001], ['2,5E-2', 0.025],
  ]) assert.equal(lrMagicParse(input), expected);

  for (const input of [
    '', ' ', '\n\t', null, undefined, true, false, [], [0.5], {},
    NaN, Infinity, -Infinity, 'NaN', 'Infinity', '-Infinity', '1e309',
    '1,2.3', '1.2,3', '1,2,3', '1..2', '1 000', '0x10', '0b10',
    '25%', '1/2', '0.5abc', '1e', '.', ',', '+', '-', '1.', '1,',
  ]) assert.ok(Number.isNaN(lrMagicParse(input)), `Must reject ${String(input)}`);
});

check('Invalid arguments and domain boundaries', () => {
  const invalid = [undefined, null, [], {}, '0.5', { ...base, P: 0 }, { ...base, P: -0 },
    { ...base, P: -0.01 }, { ...base, P: 1.01 }];
  for (const key of ['P', 'G', 'L', 'A', 'R']) {
    for (const value of [NaN, Infinity, '', null, 'bad']) invalid.push({ ...base, [key]: value });
  }
  for (const key of ['G', 'L', 'A', 'R']) {
    for (const value of [-0.01, 1.01]) invalid.push({ ...base, [key]: value });
  }
  for (const input of invalid) {
    const result = lrMagicCalculate(input);
    assert.equal(result.valid, false);
    assert.ok(typeof result.error === 'string' && result.error.length > 0);
    for (const key of ['M', 'Pm', 'delta', 'logDelta']) assert.ok(Number.isNaN(result[key]));
  }
  assert.match(lrMagicCalculate({ ...base, P: 0 }).error, /не определена/);
});

check('Independent exact fixtures', () => {
  // Hand-calculable powers: 1/2 squared, 1/2 to the fourth, and (1/16)^(5/4).
  for (const [P, G, M, delta, Pm] of [
    [0.5, 0.5, 0.5, 0.125, 0.625],
    [0.25, 0.5, 0.5, 0.046875, 0.296875],
    [0.8, 0.0625, 0.0625, 0.00625, 0.80625],
  ]) {
    const result = lrMagicCalculate({ P, G, L: 1, A: 0, R: 0 });
    assert.equal(result.valid, true);
    assert.equal(result.error, null);
    near(result.M, M);
    near(result.delta, delta);
    near(result.Pm, Pm);
  }

  const improved = lrMagicCalculate({ P: 0.5, G: 0.9, L: 0.9, A: 0.1, R: 0.2 });
  near(improved.M, 0.5832);
  near(improved.delta, 0.17006112);
  near(improved.Pm, 0.67006112);

  const comma = lrMagicCalculate({ P: '0,5', G: '0,5', L: '1', A: '0', R: '0' });
  assert.equal(comma.Pm, 0.625);
});

check('Zero and maximum strength, and certainty', () => {
  for (const override of [{ G: 0 }, { L: 0 }, { A: 1 }, { R: 1 }]) {
    const result = lrMagicCalculate({ ...base, ...override });
    assert.equal(result.valid, true);
    assert.equal(result.M, 0);
    assert.equal(result.Pm, base.P);
    assert.equal(result.delta, 0);
    assert.equal(result.logDelta, -Infinity);
  }
  for (const P of [Number.MIN_VALUE, 1e-100, 0.01, 0.5, 0.9999999999999999, 1]) {
    const result = lrMagicCalculate({ P, G: 1, L: 1, A: 0, R: 0 });
    assert.equal(result.valid, true);
    assert.equal(result.M, 1);
    assert.equal(result.Pm, 1);
    assert.equal(result.delta, 1 - P);
    assert.ok(!Number.isNaN(result.logDelta));
  }
  const certain = lrMagicCalculate({ ...base, P: 1 });
  assert.equal(certain.Pm, 1);
  assert.equal(certain.delta, 0);
  assert.equal(certain.logDelta, -Infinity);
});

check('Tiny increments and underflow retain useful logarithms', () => {
  // Independent 100-digit Decimal reference values, rounded here to binary64 precision.
  const original = lrMagicCalculate({ P: 0.01, G: 0.9, L: 0.5, A: 0.9, R: 0.8 });
  near(original.M, 0.009);
  near(original.delta, 2.6295784898711602e-205, 1e-12, 0);
  near(original.logDelta, -471.06312050044527);
  assert.equal(original.Pm, 0.01); // The increment is positive but smaller than one ULP of P.
  assert.ok(original.delta > 0);

  const underflow = lrMagicCalculate({ P: 0.0005, G: 0.5, L: 1, A: 0, R: 0 });
  assert.equal(underflow.valid, true);
  assert.equal(underflow.delta, 0);
  assert.equal(underflow.Pm, 0.0005);
  near(underflow.logDelta, -1386.2948612449323);

  const tinyP = lrMagicCalculate({ P: Number.MIN_VALUE, G: 0.5, L: 1, A: 0, R: 0 });
  assert.equal(tinyP.valid, true);
  assert.equal(tinyP.Pm, Number.MIN_VALUE);
  assert.equal(tinyP.delta, 0);
  assert.equal(tinyP.logDelta, -Infinity); // Even the logarithm exceeds binary64 range here.

  const nearOne = lrMagicCalculate({ P: Number.MIN_VALUE, G: 1 - Number.EPSILON, L: 1, A: 0, R: 0 });
  assert.equal(nearOne.valid, true);
  assert.ok(Number.isFinite(nearOne.logDelta)); // 1/P itself overflows; log(M)/P does not.
  assert.equal(nearOne.delta, 0);
});

check('Ranges over the whole domain, including boundaries', () => {
  const factors = [0, 0.25, 0.5, 0.75, 1];
  for (const P of [0.0005, 0.01, 0.1, 0.25, 0.5, 0.9, 1]) {
    for (const G of factors) for (const L of factors) for (const A of factors) for (const R of factors) {
      const result = lrMagicCalculate({ P, G, L, A, R });
      assert.equal(result.valid, true);
      assert.ok(result.M >= 0 && result.M <= 1);
      assert.ok(result.Pm >= P && result.Pm <= 1);
      assert.ok(result.delta >= 0 && result.delta <= 1 - P);
      if (result.M > 0 && P < 1) assert.ok(Number.isFinite(result.logDelta) && result.logDelta <= 0);
      else assert.equal(result.logDelta, -Infinity);
    }
  }
});

check('Monotonicity follows the meaning of each input', () => {
  for (const key of ['G', 'L', 'A', 'R']) {
    let previous = null;
    for (let step = 0; step <= 20; step += 1) {
      const current = lrMagicCalculate({ ...base, P: 0.35, [key]: step / 20 });
      if (previous) {
        const increases = key === 'G' || key === 'L';
        for (const field of ['M', 'Pm']) {
          assert.ok(increases ? current[field] >= previous[field] : current[field] <= previous[field]);
        }
      }
      previous = current;
    }
  }
  let previousPm = 0;
  for (const P of [1e-8, 0.001, 0.01, 0.1, 0.25, 0.5, 0.75, 0.99, 1]) {
    const current = lrMagicCalculate({ ...base, P });
    assert.ok(current.Pm >= previousPm);
    previousPm = current.Pm;
  }
});

check('Plain browser scripts expose both global functions without CommonJS', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(require.resolve('../site/_magic-math.js'), 'utf8'), context);
  assert.equal(typeof context.lrMagicParse, 'function');
  assert.equal(typeof context.lrMagicCalculate, 'function');
  assert.equal(context.lrMagicParse('0,25'), 0.25);
  assert.equal(context.lrMagicCalculate({ P: 0.5, G: 0.5, L: 1, A: 0, R: 0 }).Pm, 0.625);
});

console.log(`Magic probability: ${checks} test groups passed (including 4,375 domain samples).`);
