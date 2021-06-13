// import libraries
const mongoose = require('mongoose');
// import models
const Paste = require('../models/paste');
// import from index.js
const index = require('../index');

module.exports.connect = () => {
  mongoose
    .connect('mongodb://mongo:27017/insight', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully Connected :)');
      index.startScraping();
    })
    .catch((e) => console.log(e));
};

module.exports.add = (paste) => {
  const newPaste = new Paste(paste);
  newPaste
    .save()
    // .then((res) => console.log('Added Successfully To The Database'))
    .catch((e) => console.log(e));
};

module.exports.latestPaste = () => {
  return Paste.find({})
    .sort({ date: -1 })
    .limit(1)
    .then((paste) => {
      if (paste.length > 0) {
        return paste[0].date;
      }
    });
};

module.exports.collectionLength = () => {
  return Paste.find({}).then((paste) => paste.length);
};
