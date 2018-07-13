module.exports = {};

// Helper function for converting from nodelist to ES array so we can map
function toArr(nodeList) {
  return Array.prototype.slice.call(nodeList);
}
module.exports.toArr = toArr;

function toChildrenInnertext(eachBodyRow) {
  return toArr(eachBodyRow.children).map(toInnerText);
}
module.exports.toChildrenInnertext = toChildrenInnertext;

function toInnerText(eachChild) {
  return eachChild.innerText;
}
module.exports.toInnerText = toInnerText;

function zipWith(zipper) {
  return function(acc, eachInnertext, index) {
    acc[zipper[index]] = eachInnertext;
    return acc;
  };
}
module.exports.zipWith = zipWith;
