import {
  tryURLParse,
  isJSONObject,
  longerLengthThenCodeUnitOrder,
  hasFetchScheme,
} from './helpers';
import { sortAndNormalizeSpecifierMap } from './sortAndNormalizeSpecifierMap';

/* eslint-disable no-restricted-syntax */

export function sortAndNormalizeScopes(obj, baseURL) {
  const normalized = {};
  for (const [scopePrefix, potentialSpecifierMap] of Object.entries(obj)) {
    if (!isJSONObject(potentialSpecifierMap)) {
      throw new TypeError(`The value for the "${scopePrefix}" scope prefix must be an object.`);
    }

    const scopePrefixURL = tryURLParse(scopePrefix, baseURL);
    if (scopePrefixURL === null) {
      continue;
    }

    if (!hasFetchScheme(scopePrefixURL)) {
      console.warn(`Invalid scope "${scopePrefixURL}". Scope URLs must have a fetch scheme.`);
      continue;
    }

    const normalizedScopePrefix = scopePrefixURL.href;
    normalized[normalizedScopePrefix] = sortAndNormalizeSpecifierMap(
      potentialSpecifierMap,
      baseURL,
    );
  }

  const sortedAndNormalized = {};
  const sortedKeys = Object.keys(normalized).sort(longerLengthThenCodeUnitOrder);
  for (const key of sortedKeys) {
    sortedAndNormalized[key] = normalized[key];
  }

  return sortedAndNormalized;
}
