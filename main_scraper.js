const csvStringify = require('csv-stringify');
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://datatables.net');

  const dataOutputObject = await page.evaluate(() => {
    const toArr = nodeList => Array.prototype.slice.call(nodeList);

    const rows = document.querySelectorAll('tr[role=row]');
    const rowsArr = toArr(rows);

    const headerRow = rowsArr[0].children;
    const headerLabels = toArr(headerRow).map(each => each.innerText);

    const bodyRows = rowsArr.slice(1);
    const bodyRowInnertexts = bodyRows.map(toChildrenInnertext);
    const bodyRowObjects = bodyRowInnertexts.map(toObjectWithHeadingsAsKey);

    function toChildrenInnertext(eachBodyRow) {
      return toArr(eachBodyRow.children).map(toInnerText);
    }

    function toInnerText(eachChild) {
      return eachChild.innerText;
    }

    function toObjectWithHeadingsAsKey(eachInnertextArr) {
      return eachInnertextArr.reduce(zipWithHeadings, {});
    }

    function zipWithHeadings(acc, eachInnertext, index) {
      acc[headerLabels[index]] = eachInnertext;
      return acc;
    }

    return bodyRowObjects;
  });

  csvStringify(dataOutputObject, (err, output) => {
    fs.writeFileSync('./main.csv', output);
  });

  await browser.close();
})();
