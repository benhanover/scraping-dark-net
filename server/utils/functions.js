// Sentiment
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

module.exports.getAfinnScore = (str) => {
  const result = sentiment.analyze(str);
  return result.score;
};

module.exports.scanWords = (str) => {
  const result = sentiment.analyze(str);
  return { positiveArr: result.positive, negativeArr: result.negative };
};

module.exports.updateWordsArr = (fetchedArray, wordsArray) => {
  wordsArray.forEach((word) => {
    const object = fetchedArray.find((obj) => obj.word === word);
    if (object) {
      object.count++;
    } else {
      fetchedArray.push({ word: word, count: 1 });
    }
  });
  return fetchedArray;
};

module.exports.sortWordsArr = (wordsArr) => {
  wordsArr.sort((a, b) => (a.count > b.count ? -1 : b.count > a.count ? 1 : 0));
};

module.exports.mergeWords = (goodObject, badObject) => {
  const bigger = goodObject.length > badObject.length ? goodObject : badObject;
  return bigger.map((obj, i) => {
    return {
      goodWord: goodObject[i] && goodObject[i].word,
      goodCount: goodObject[i] && goodObject[i].count,
      badWord: badObject[i] && badObject[i].word,
      badCount: badObject[i] && badObject[i].count,
    };
  });
};

module.exports.saveWordsToDB = (model, id, wordsArr, arrayType) => {
  arrayType
    ? model.findOneAndUpdate(
        { _id: id },
        // model name same as the column in the DB
        { positiveWords: wordsArr },
        (error, data) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Changed Words In The DB Successfully');
          }
        }
      )
    : model.findOneAndUpdate(
        { _id: id },
        // model name same as the column in the DB
        { negativeWords: wordsArr },
        (error, data) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Changed Words In The DB Successfully');
          }
        }
      );
};
