import { URL } from 'url';

// https://fetch.spec.whatwg.org/#fetch-scheme
const FETCH_SCHEMES = new Set([
  'http',
  'https',
  'ftp',
  'about',
  'blob',
  'data',
  'file',
  'filesystem',
]);

export function tryURLParse(string, baseURL) {
  try {
    return new URL(string, baseURL);
  } catch (e) {
    // TODO remove useless binding when ESLint and Jest support that
    return null;
  }
}

export function hasFetchScheme(url) {
  return FETCH_SCHEMES.has(url.protocol.slice(0, -1));
}

export function parseUrl(url, baseURL) {
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return new URL(url, baseURL);
  }

  const urlObj = tryURLParse(url);

  if (urlObj === null) {
    return null;
  }

  if (hasFetchScheme(urlObj) || urlObj.protocol === 'std:') {
    return urlObj;
  }

  return null;
}

export function isJSONObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function compare(a, b) {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
  return 0;
}

export function longerLengthThenCodeUnitOrder(a, b) {
  return compare(b.length, a.length) || compare(a, b);
}
