const csvStringify = require('csv-stringify');
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://datatables.net');

  const dataOutputObject = await page.evaluate(() => {
    // Helper function for converting from nodelist to ES array so we can map
    const toArr = nodeList => Array.prototype.slice.call(nodeList);

    // Grab the table rows from the webpage
    const rows = document.querySelectorAll('tr[role=row]');
    const rowsArr = toArr(rows);

    // Turn the first row into an array of strings, to be used as headers
    const headerRow = rowsArr[0].children;
    const headerLabels = toArr(headerRow).map(each => each.innerText);

    // Apply transforms to the rest of the data to get each cell in
    // each row and zip the cell to the appropriate header
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

  // Stringify the object and output it to a file.
  // Could hand-roll the CSV stringify
  // but that doesn't seem like how I'd do it in production.
  csvStringify(dataOutputObject, (err, output) => {
    fs.writeFileSync('./main.csv', output);
  });

  await browser.close();
})();
