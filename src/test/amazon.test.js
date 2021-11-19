const path = require('path');
const timeout = process.env.SLOWMO ? 30000 : 1000000;
const preload = path.join(__dirname, '../../dist/preload.js');
const puppeteer = require('puppeteer');

const DETECTED_BG_COLOR = 'rgb(207, 225, 255)';

describe(
  'Test detected data on amazon.pl',
  () => {
    beforeAll(async () => {
      try {
        browser = await puppeteer.launch({ headless: true, devtools: true });
        page = await browser.newPage();
        await page.goto('https://www.amazon.pl/s?k=geforce&__mk_pl_PL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss_2', {
          waitUntil: 'domcontentloaded',
        });
        await page.addScriptTag({ path: preload });
      } catch (error) {
        process.exit(1);
      }
    }, timeout);

    afterAll(async () => {
      await browser.close();
    });

    test(
      'Background color of a first text element of a first repeatable element',
      async () => {
        const test = await page.$('[data-test="1-1"]');
        const bgColor = await page.evaluate(
          (test) => window.getComputedStyle(test).backgroundColor,
          test,
        );
        expect(bgColor).toBe(DETECTED_BG_COLOR);
      },
      timeout,
    );

    test(
      'Number of text elements in a repeatable data element',
      async () => {
        const elements = await page.evaluate(() => {
          var nodeList = document.querySelectorAll('[data-test^="1-"]');
          console.log(nodeList);
          return nodeList.length;
        });
        expect(elements).toBe(7);
      },
      timeout,
    );
  },
  timeout,
);
