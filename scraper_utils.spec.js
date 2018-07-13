const puppeteer = require('puppeteer');

const scraperFunctions = require('./main_scraper_utils.js');

const { toArr, zipWith } = scraperFunctions;

describe('toArr', () => {
  test('works on string', () => {
    expect(toArr('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
  });
});

describe('zipWith', () => {
  test('works with two arrays', () => {
    const first = ['a', 'b', 'c', 'd'];
    const second = ['l', 'm', 'n', 'o'];

    const result = second.reduce(zipWith(first), {});
    expect(result).toEqual({
      a: 'l',
      b: 'm',
      c: 'n',
      d: 'o',
    });
  });
});
