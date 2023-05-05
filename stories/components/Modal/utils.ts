export const parseValue = (v) => {
  if (v === null) return undefined;
  if (v === 'True') return true;
  if (v === 'False') return false;
  if (Array.isArray(v)) return v.map(parseValue);
  if (isObject(v)) return parseObject(v);
  try {
    v = JSON.parse(v);
    return isObject(v) ? parseObject(v) : v;
  } catch (e) {
    return v;
  }
};

const parseObject = (v) =>
  Object.keys(v).reduce((acc, k) => {
    acc[k] = parseValue(v[k]);
    return acc;
  }, {});

export const round = (n) => Math.round(n * 10) / 10;

export const loop = (n, i) => ((+i % +n) + +n) % +n;

export const toPairs = (obj) =>
  Object.entries(obj)
    .flat()
    .map((x) => (Array.isArray(x) ? x.join(',') : x));

export const isObject = (o) =>
  Object.prototype.toString.call(o) === '[object Object]';

export const isPromise = (p) => !!p && typeof p.then === 'function';

export const compose =
  (first, ...fns) =>
  (...args) =>
    fns.reduce(
      (res, fn) => (isPromise(res) ? res.then(fn) : fn(res)),
      first(...args)
    );

export const tap = (fn) => (data) => {
  fn(data);
  return data;
};

export const once = (fn) => {
  let called = false;
  return (...args) => {
    if (called) throw new Error(`Cannot call ${fn.name} more than once`);
    called = true;
    return fn(...args);
  };
};

export const uniq = (arr) => [...new Set(arr)];

export const flat = (o) =>
  [].concat(...Object.entries(o).map(([k, v]) => [k, JSON.stringify(v)]));

export const rearrange = (arr, from_val, to_val) => {
  const _arr = [...arr];
  const from = arr.indexOf(from_val);
  const to = arr.indexOf(to_val);
  _arr.splice(to, 0, _arr.splice(from, 1)[0]);
  return _arr.filter((x) => x !== undefined);
};

export const move = (arr, oldIndex, newIndex) => {
  if (oldIndex == null || newIndex == null) return;

  const _arr = [...arr];

  _arr.splice(newIndex, 0, ..._arr.splice(oldIndex, 1));

  return _arr;
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const tryUntil = async (fn, condition, timeout = 10000) => {
  const startTime = Date.now();
  try {
    const result = await fn();
    if (!condition(result)) throw new Error('Condition not met');
    return result;
  } catch (e) {
    await delay(10);
    timeout -= Date.now() - startTime;
    return timeout < 0
      ? Promise.reject(e) // TODO: Create new error classes to wrap errors
      : tryUntil(fn, condition, timeout);
  }
};

export const asyncForEach = (fn, array) => Promise.all(array.map(fn));

const upperCase = (str) => str.toUpperCase();
const capitalise = (str) => str.replace(str.charAt(0), upperCase);
const clean = (s) => s.replace(/[\W_]+/g, '');

const createCaseFn =
  (transform: any, delimiter = '') =>
  (s = '') => {
    const words = [];
    const components = s.split(/(?=[A-Z0-9_\-\.\s])/).map(clean);
    let i = -1;
    while (++i < components.length) {
      let word = components[i];
      if (word.length === 1)
        while (components[i + 1] && components[i + 1].length === 1)
          word += components[++i];
      if (word) words.push(transform(word, words.length));
    }
    return words.join(delimiter);
  };

export const titleCase = createCaseFn(capitalise, ' ');

const sortProp = (p) => (a, b) => a[p] > b[p] ? 1 : -1;

const sortProps = (p1, p2) => (a, b) =>
  a[p1] === b[p1] ? sortProp(p2)(a, b) : sortProp(p1)(a, b);

export const sortByProp = (p) => (arr) => arr.sort(sortProp(p));
export const sortByProps = (p1, p2) => (arr) => arr.sort(sortProps(p1, p2));

export const without = (k) => (o) =>
  Object.entries(o).reduce((acc, [key, value]) => {
    if (key !== k) acc[key] = value;
    return acc;
  }, {});

export const parseModel = (str = '') =>
  str
    .replace(
      /Cat|CAT|P&H|Hitachi|HITACHI|Liebherr|Komatsu|KOM|Kenworth|Terex O&K|Marion|BE|Volvo|Toyota|Isuzu|KIA|Ford|Coaster|Mazda|tech|Sandvik|Ingersoll Rand|Pit Viper|4x4|Dual-Cab|Service Truck|Truck|Haul/g,
      ''
    )
    .trim();
