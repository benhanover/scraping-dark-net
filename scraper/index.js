// import libraries
const cheerio = require('cheerio');
const tr = require('tor-request');
// setting tor proxy by the container
tr.setTorAddress('tor');

// utils
const utils = require('./utils/export');

// execute when the data base connects utils/db-actions.js
module.exports.startScraping = () => {
  console.log('First Scrape');
  // true - first Scrape
  scrape(true);
  // Scrape every 2 minutes
  // setInterval(() => {
  //   console.log('Starting to scrape', new Date());
  //   // false - not first scrape
  //   scrape(false);
  // }, 1000 * 120);
};

// case its the first scrape
async function scrape(firstScrape) {
  // prettier-ignore
  console.log('----------------  index: start first page scrape --------------------');
  await new Promise((resolve, reject) => {
    tr.request(
      'http://nzxj65x32vh2fkhk.onion/all?page=1',
      async (err, res, html) => {
        if (!(!err && res.statusCode == 200)) {
          console.log('Could not access tor');
          resolve();
          return;
        }
        const $ = cheerio.load(html);

        await utils.savePagePastes($, firstScrape);
        resolve();
      }
    );
  });
  // prettier-ignore
  console.log('---------------- index: end first page scrape --------------------');

  if (firstScrape) {
    // prettier-ignore
    console.log('----------------  index: start pages scrape --------------------');

    let pageExist = true,
      currentPage = 2;
    while (pageExist) {
      console.log(`-----------current page ${currentPage} ----------------`);
      pageExist = await new Promise((resolve, reject) => {
        // prettier-ignore
        tr.request(`http://nzxj65x32vh2fkhk.onion/all?page=${currentPage}`, async (err, res, html) => {
          if (!(!err && res.statusCode == 200)) {
            console.log('index: Could Not Load Page');
            resolve(false);
          }
          const $page = cheerio.load(html);
          await utils.savePagePastes($page, firstScrape);
          currentPage++;
          resolve(true);
        })
      });
    }
    // prettier-ignore
    console.log('---------------- index: end pages scrape --------------------');
    setInterval(() => {
      // prettier-ignore
      console.log('----------- Starting to scrape', new Date(), '-----------------------');
      // false - not first scrape
      scrape(false);
    }, 1000 * 120);
  }
}
