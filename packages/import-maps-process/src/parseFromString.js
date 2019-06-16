/* eslint-disable no-restricted-syntax */

import { isJSONObject } from './helpers';
import { sortAndNormalizeSpecifierMap } from './sortAndNormalizeSpecifierMap';
import { sortAndNormalizeScopes } from './sortAndNormalizeScopes';

export function parseFromString(input, baseUrl) {
  const parsed = JSON.parse(input);

  if (!isJSONObject(parsed)) {
    throw new TypeError('Import map JSON must be an object.');
  }

  let sortedAndNormalizedImports = {};
  if ('imports' in parsed) {
    if (!isJSONObject(parsed.imports)) {
      throw new TypeError("Import map's imports value must be an object.");
    }
    sortedAndNormalizedImports = sortAndNormalizeSpecifierMap(parsed.imports, baseUrl);
  }

  let sortedAndNormalizedScopes = {};
  if ('scopes' in parsed) {
    if (!isJSONObject(parsed.scopes)) {
      throw new TypeError("Import map's scopes value must be an object.");
    }
    sortedAndNormalizedScopes = sortAndNormalizeScopes(parsed.scopes, baseUrl);
  }

  // Always have these two keys, and exactly these two keys, in the result.
  return {
    imports: sortedAndNormalizedImports,
    scopes: sortedAndNormalizedScopes,
  };
}
