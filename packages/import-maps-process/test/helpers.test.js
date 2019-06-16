import chai from 'chai';
import { parseUrl } from '../src/helpers.js';

const { expect } = chai;

describe('Relative URL-like addresses', () => {
  it.only('should accept strings prefixed with ./, ../, or /', () => {
    const baseUrl = 'https://base.example/path1/path2/path3';
    expect(parseUrl('./foo', baseUrl).href).to.equal('https://base.example/path1/path2/foo');
    // expect(parseUrl('../foo', baseUrl)).to.equal('https://base.example/path1/foo');
    // expect(parseUrl('/foo', baseUrl)).to.equal('https://base.example/foo');
  });

  it('should accept the literal strings ./, ../, or / with no suffix', () => {
    const baseUrl = 'https://base.example/path1/path2/path3';
    expect(parseUrl('./', baseUrl)).to.equal('https://base.example/path1/path2/');
    expect(parseUrl('../', baseUrl)).to.equal('https://base.example/path1/');
    expect(parseUrl('/', baseUrl)).to.equal('https://base.example/');
  });

  it('should ignore percent-encoded variants of ./, ../, or /', () => {
    const baseUrl = 'https://base.example/path1/path2/path3';
    expect(parseUrl('%2E/', baseUrl)).to.equal(baseUrl);
    expect(parseUrl('%2E%2E/', baseUrl)).to.equal(baseUrl);
    expect(parseUrl('.%2F', baseUrl)).to.equal(baseUrl);
    expect(parseUrl('..%2F', baseUrl)).to.equal(baseUrl);
    expect(parseUrl('%2F', baseUrl)).to.equal(baseUrl);
    expect(parseUrl('%2E%2F', baseUrl)).to.equal(baseUrl);
    expect(parseUrl('%2E%2E%2F', baseUrl)).to.equal(baseUrl);
  });
});

describe('Built-in module addresses', () => {
  it('should accept URLs using the built-in module scheme', () => {
    const baseUrl = 'https://base.example/path1/path2/path3';
    expect(parseUrl('std:foo', baseUrl)).to.equal('std:foo');
  });

  it('should ignore percent-encoded variants of the built-in module scheme', () => {
    const baseUrl = 'https://base.example/path1/path2/path3';
    expect(parseUrl(`${encodeURIComponent('std:')}foo`, baseUrl)).to.equal(baseUrl);
  });

  it('should ignore and warn on built-in module URLs that contain "/"', () => {
    const baseUrl = 'https://base.example/path1/path2/path3';
    expect(parseUrl('std:foo/', baseUrl)).to.throw(
      'Invalid target address "std:foo/". Built-in module URLs must not contain "/".',
    );
    expect(parseUrl('std:foo/bar', baseUrl)).to.throw(
      'Invalid target address "std:foo/". Built-in module URLs must not contain "/".',
    );
    expect(parseUrl('std:foo\\\\baz', baseUrl)).to.equal('std:foo\\baz');
  });
});

describe('Absolute URL addresses', () => {
  it('should only accept absolute URL addresses with fetch schemes', () => {
    const baseUrl = 'https://base.example/path1/path2/path3';
    expect(parseUrl('about:good', baseUrl)).to.equal('about:good');
    expect(parseUrl('blob:good', baseUrl)).to.equal('blob:good');
    expect(parseUrl('data:good', baseUrl)).to.equal('data:good');
    expect(parseUrl('file:///good', baseUrl)).to.equal('file:///good');
    expect(parseUrl('filesystem:good', baseUrl)).to.equal('filesystem:good');
    expect(parseUrl('http://good/', baseUrl)).to.equal('http://good/');
    expect(parseUrl('https://good/', baseUrl)).to.equal('https://good/');
    expect(parseUrl('ftp://good/', baseUrl)).to.equal('ftp://good/');
    expect(parseUrl('import:bad', baseUrl)).to.equal(baseUrl);
    expect(parseUrl('mailto:bad', baseUrl)).to.equal(baseUrl);
    // eslint-disable-next-line no-script-url
    expect(parseUrl('javascript:bad', baseUrl)).to.equal(baseUrl);
    expect(parseUrl('wss:bad', baseUrl)).to.equal(baseUrl);
  });

  // it('should parse absolute URLs, ignoring unparseable ones', () => {
  //   expectSpecifierMap(
  //     `{
  //       "unparseable1": "https://ex ample.org/",
  //       "unparseable2": "https://example.com:demo",
  //       "unparseable3": "http://[www.example.com]/",
  //       "invalidButParseable1": "https:example.org",
  //       "invalidButParseable2": "https://///example.com///",
  //       "prettyNormal": "https://example.net",
  //       "percentDecoding": "https://ex%41mple.com/",
  //       "noPercentDecoding": "https://example.com/%41"
  //     }`,
  //     'https://base.example/path1/path2/path3',
  //     {
  //       unparseable1: [],
  //       unparseable2: [],
  //       unparseable3: [],
  //       invalidButParseable1: [expect.toMatchURL('https://example.org/')],
  //       invalidButParseable2: [expect.toMatchURL('https://example.com///')],
  //       prettyNormal: [expect.toMatchURL('https://example.net/')],
  //       percentDecoding: [expect.toMatchURL('https://example.com/')],
  //       noPercentDecoding: [expect.toMatchURL('https://example.com/%41')],
  //     },
  //   );
  // });

  // it('should parse absolute URLs, ignoring unparseable ones inside arrays', () => {
  //   expectSpecifierMap(
  //     `{
  //       "unparseable1": ["https://ex ample.org/"],
  //       "unparseable2": ["https://example.com:demo"],
  //       "unparseable3": ["http://[www.example.com]/"],
  //       "invalidButParseable1": ["https:example.org"],
  //       "invalidButParseable2": ["https://///example.com///"],
  //       "prettyNormal": ["https://example.net"],
  //       "percentDecoding": ["https://ex%41mple.com/"],
  //       "noPercentDecoding": ["https://example.com/%41"]
  //     }`,
  //     'https://base.example/path1/path2/path3',
  //     {
  //       unparseable1: [],
  //       unparseable2: [],
  //       unparseable3: [],
  //       invalidButParseable1: [expect.toMatchURL('https://example.org/')],
  //       invalidButParseable2: [expect.toMatchURL('https://example.com///')],
  //       prettyNormal: [expect.toMatchURL('https://example.net/')],
  //       percentDecoding: [expect.toMatchURL('https://example.com/')],
  //       noPercentDecoding: [expect.toMatchURL('https://example.com/%41')],
  //     },
  //   );
  // });

  // describe('Failing addresses: mismatched trailing slashes', () => {
  //   it('should warn for the simple case', () => {
  //     expectSpecifierMap(
  //       `{
  //         "trailer/": "/notrailer"
  //       }`,
  //       'https://base.example/path1/path2/path3',
  //       {
  //         'trailer/': [],
  //       },
  //       [
  //         `Invalid target address "https://base.example/notrailer" for package specifier "trailer/". Package address targets must end with "/".`,
  //       ],
  //     );
  //   });

  //   it('should warn for a mismatch alone in an array', () => {
  //     expectSpecifierMap(
  //       `{
  //         "trailer/": ["/notrailer"]
  //       }`,
  //       'https://base.example/path1/path2/path3',
  //       {
  //         'trailer/': [],
  //       },
  //       [
  //         `Invalid target address "https://base.example/notrailer" for package specifier "trailer/". Package address targets must end with "/".`,
  //       ],
  //     );
  //   });

  //   it('should warn for a mismatch alongside non-mismatches in an array', () => {
  //     expectSpecifierMap(
  //       `{
  //         "trailer/": ["/atrailer/", "/notrailer"]
  //       }`,
  //       'https://base.example/path1/path2/path3',
  //       {
  //         'trailer/': [expect.toMatchURL('https://base.example/atrailer/')],
  //       },
  //       [
  //         `Invalid target address "https://base.example/notrailer" for package specifier "trailer/". Package address targets must end with "/".`,
  //       ],
  //     );
  //   });
  // });
});

// describe('Other invalid addresses', () => {
//   it('should ignore unprefixed strings that are not absolute URLs', () => {
//     for (const bad of ['bar', '\\bar', '~bar', '#bar', '?bar']) {
//       expectSpecifierMap(
//         `{
//           "foo": "${bad}"
//         }`,
//         'https://base.example/path1/path2/path3',
//         {
//           foo: [],
//         },
//       );
//     }
//   });
// });
