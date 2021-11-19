const DOMHelper = require('../../service/DOMHelper');

const plugin = function (event) {
  console.log('DOMContentLoaded');

  const children1 = getChildren(document.body, 1);
  console.log(children1);

  const elements = DOMHelper.elementsFromXpath(children1.xpath);

  const elementsWithText = elements.map((el) => {
    return Array.from(el.querySelectorAll('*'))
      .filter((v) => DOMHelper.visibleAndHasTextNode(v, true))
      .map((child) => {
        const xpath = DOMHelper.createXPathFromElement(child);
        return { xpath, child };
      });
  });
  console.log(elementsWithText);

  let id = 0;
  elements.forEach((el) => {
    const xpath = DOMHelper.createXPathFromElement(el);

    const elementsWithText = Array.from(el.querySelectorAll('*')).filter((v) =>
      DOMHelper.visibleAndHasTextNode(v, true),
    );

    id = id + 1;
    let id2 = 0;
    elementsWithText.forEach((elt) =>  {
        id2 = id2 + 1;
        elt.style.backgroundColor = '#cfe1ff';
        elt.dataset.test = id + '-' + id2;
    });
  });

  const xPaths = DOMHelper.visibleElementsWithText.map((el) => {
    return DOMHelper.createXPathFromElement(el);
  });

  console.log(xPaths);
};

//ipcRenderer.send('invokeAction', 'someData2');

function getChildren(element, elsAvg) {
  console.log('BEFPRE: ChildNodes: %o', element.childNodes);
  const test = Array.from(element.childNodes)
    .map((el) => {
      let width = el.offsetWidth || 0;
      let height = el.offsetHeight || 0;
      let elArea = width * height || 0;
      const xpath = DOMHelper.createXPathFromElement(el);
      let style = '';
      let rect = '';
      if (DOMHelper.isElement(el)) {
        style = window.getComputedStyle(el);
        rect = el.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        elArea = width * height;
      }
      return { el, elArea, width, height, xpath, style, rect };
    })
    .filter(function (e) {
      // console.log(e.el);
      // console.log(e.el.className);
      // console.log(e.rect);
      // console.log("area: " + e.elArea);
      // console.log("area: " + e.width);
      // console.log("area: " + e.height);
      // console.log("style: %o", e.style);
      return e.width > 0 || e.height > 0;
    })
    .sort(function (a, b) {
      return b.elArea - a.elArea;
    });

  let curEls = test.length;

  console.log('curEls: ' + curEls);
  console.log('elsAvg: ' + elsAvg * 1.5);
  if (curEls > elsAvg * 1.2) {
    test.forEach(function (el, index, arr) {
      const xpath = el.xpath;
      const count = arr.reduce(
        (acc, cur) => (cur.xpath === xpath ? ++acc : acc),
        0,
      );
      el.count = count;
    });

    console.log('Checkpoint check: ' + curEls / 1.5);
    console.log('Point: ' + test[0].count);
    if (test[0].count > curEls / 1.5) {
      return test[0];
    }
  }

  let newElsAvg = (elsAvg + curEls) / 2;

  console.log('Round: ');
  console.log(test);
  return getChildren(test[0].el, newElsAvg);
}

module.exports = plugin;
