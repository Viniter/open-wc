/* eslint-disable no-restricted-syntax */
import { parseUrl, isJSONObject, longerLengthThenCodeUnitOrder } from './helpers';

function normalizeSpecifierKey(specifierKey, baseURL) {
  // Ignore attempts to use the empty string as a specifier key
  if (specifierKey === '') {
    return null;
  }

  const url = parseUrl(specifierKey, baseURL);
  if (url !== null) {
    const urlString = url.href;
    if (url.protocol === 'std' && urlString.includes('/')) {
      console.warn(
        `Invalid specifier key "${urlString}". Built-in module specifiers must not contain "/".`,
      );
      return null;
    }
    return urlString;
  }

  return specifierKey;
}

export function sortAndNormalizeSpecifierMap(obj, baseUrl) {
  assert(isJSONObject(obj));

  // Normalize all entries into arrays
  const normalized = {};
  for (const [specifierKey, value] of Object.entries(obj)) {
    const normalizedSpecifierKey = normalizeSpecifierKey(specifierKey, baseUrl);
    if (normalizedSpecifierKey === null) {
      continue;
    }

    if (typeof value === 'string') {
      normalized[normalizedSpecifierKey] = [value];
    } else if (value === null) {
      normalized[normalizedSpecifierKey] = [];
    } else if (Array.isArray(value)) {
      normalized[normalizedSpecifierKey] = obj[specifierKey];
    }
  }

  // Normalize/validate each potential address in the array
  for (const [specifierKey, potentialAddresses] of Object.entries(normalized)) {
    assert(Array.isArray(potentialAddresses));

    const validNormalizedAddresses = [];
    for (const potentialAddress of potentialAddresses) {
      if (typeof potentialAddress !== 'string') {
        continue;
      }

      const addressURL = parseUrl(potentialAddress, baseUrl);
      if (addressURL === null) {
        continue;
      }

      if (specifierKey.endsWith('/') && !addressURL.href.endsWith('/')) {
        console.warn(
          `Invalid target address "${addressURL.href}" for package specifier "${specifierKey}". ` +
            `Package address targets must end with "/".`,
        );
        continue;
      }

      if (addressURL.protocol === 'std' && addressURL.href.includes('/')) {
        console.warn(
          `Invalid target address "${potentialAddress}". Built-in module URLs must not contain "/".`,
        );
        continue;
      }

      validNormalizedAddresses.push(addressURL);
    }
    normalized[specifierKey] = validNormalizedAddresses;
  }

  const sortedAndNormalized = {};
  const sortedKeys = Object.keys(normalized).sort(longerLengthThenCodeUnitOrder);
  for (const key of sortedKeys) {
    sortedAndNormalized[key] = normalized[key];
  }

  return sortedAndNormalized;
}
