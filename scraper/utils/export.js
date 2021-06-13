// import libraries
const tr = require('tor-request');
const cheerio = require('cheerio');

// import utils
const functions = require('./functions');
const mongo = require('./db-actions');
mongo.connect();

// get buttons url
module.exports.savePagePastes = async ($, firstScrape) => {
  const lastPasteDate = firstScrape ? undefined : await mongo.latestPaste();

  const pastesLinks = [];
  $('.col-sm-7 > a').each((i, elem) => {
    const link = $(elem).attr('href');
    pastesLinks.push(link);
  });

  for (const link of pastesLinks) {
    const shouldExit = new Promise((resolve, reject) => {
      tr.request(link, async (err, res, html) => {
        if (!(!err && res.statusCode == 200)) {
          console.log('Could not access tor');
          return;
        }
        const $paste = cheerio.load(html);
        // title
        const title = functions.getTitle($paste('.col-sm-5 h4').text());
        // author
        // prettier-ignore
        const author = functions.getAuthor($paste('.col-sm-6').first().text());
        // date
        const date = functions.getDate($paste('.col-sm-6').first().text());
        // content
        const content = functions.getContent($, $paste);

        const paste = { author, date: date.date, title, content };

        if (!lastPasteDate || paste.date >= lastPasteDate) {
          await mongo.add(paste);
          console.log(await mongo.collectionLength());
          return resolve(false);
        } else {
          console.log('DateBase is up to date');
          console.log(await mongo.collectionLength());
          return resolve(true);
        }
      });
    });
    // finished adding new pastes
    if (await shouldExit) break;
  }
};
