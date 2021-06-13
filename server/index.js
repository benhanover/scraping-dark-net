require('dotenv').config();
const app = require('express')();

// mongo functions
const mongoose = require('mongoose');
const mongo = require('./utils/mongo');

// functions
const functions = require('./utils/functions');

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Successfully Connected :)');
    await mongo.createWordsDB();
    app.listen(PORT, () => {
      console.log('Server is listening on PORT: ', PORT);
    });
    // make sure the hole data base has afinn score
    setInterval(async () => {
      const pastesFromDb = await mongo.getPastes();
      // prettier-ignore
      const missingAfinnScorePastes = pastesFromDb.filter(paste => paste.afinnScore === null);
      await mongo.putPastesWithAfinn(missingAfinnScorePastes);
      await mongo.updateWordsDBs(missingAfinnScorePastes);
    }, 1000 * 35);
  })
  .catch((e) => console.log(e));

app.get('/get-pastes', async (req, res) => {
  // has __v and _id
  const pastesFromDb = await mongo.getPastes();
  // format the pastes structure
  const pastes = pastesFromDb.map((paste) => {
    return {
      title: paste.title,
      date: paste.date,
      author: paste.author,
      content: paste.content,
      // first 120 seconds of the running container paste.afinnScore is null
      // prettier-ignore
      afinnScore:  paste.afinnScore === null ? paste.afinnScore : functions.getAfinnScore(paste.content.toString()),
    };
  });
  res.send(pastes);
});

app.get('/get-words-statistics', async (req, res) => {
  // prettier-ignore
  const { fetchedPositiveWords, fetchedNegativeWords } = await mongo.getWordsStatistics();
  const mergedWords = functions.mergeWords(
    fetchedPositiveWords[0].positiveWords,
    fetchedNegativeWords[0].negativeWords
  );
  res.send(mergedWords);
});
