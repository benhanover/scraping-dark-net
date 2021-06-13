// import models
const Paste = require('../models/pastes');
const positiveWords = require('../models/positive');
const negativeWords = require('../models/negative');

// import functions
const functions = require('./functions');

module.exports.getPastes = () => {
  return Paste.find({}).then((paste) => paste);
};

module.exports.getWordsStatistics = async () => {
  const fetchedPositiveWords = await positiveWords.find({});
  const fetchedNegativeWords = await negativeWords.find({});
  return { fetchedPositiveWords, fetchedNegativeWords };
};

module.exports.createWordsDB = async () => {
  const positive = new positiveWords([]);
  positive.save();
  console.log('Added positive DB');
  const negative = new negativeWords([]);
  negative.save();
  console.log('Added negative DB');
};

// function update pastes DB with afinn score
module.exports.putPastesWithAfinn = (pastes) => {
  pastes.forEach((paste) => {
    Paste.findOneAndUpdate(
      { _id: paste._id },
      { afinnScore: functions.getAfinnScore(paste.content.toString()) },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Changed afinn score successfully');
        }
      }
    );
  });
};
// function updates word DB's
module.exports.updateWordsDBs = async (pastes) => {
  if (pastes.length === 0) return;
  // fetch words array from the db
  const fetchedPositiveWords = await positiveWords.find({});
  const fetchedNegativeWords = await negativeWords.find({});

  pastes.forEach((paste) => {
    // prettier-ignore
    const {positiveArr, negativeArr} = functions.scanWords(paste.content.toString());
    // adding words
    // prettier-ignore
    functions.updateWordsArr(fetchedPositiveWords[0].positiveWords,positiveArr);
    // prettier-ignore
    functions.updateWordsArr(fetchedNegativeWords[0].negativeWords,negativeArr);
  });
  // sorting the array
  functions.sortWordsArr(fetchedPositiveWords[0].positiveWords);
  functions.sortWordsArr(fetchedNegativeWords[0].negativeWords);

  // saving to DB

  // prettier-ignore
  await functions.saveWordsToDB(positiveWords, fetchedPositiveWords[0]._id, fetchedPositiveWords[0].positiveWords, true);
  // prettier-ignore
  await functions.saveWordsToDB(negativeWords, fetchedNegativeWords[0]._id, fetchedNegativeWords[0].negativeWords, false);
};
