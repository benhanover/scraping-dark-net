const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const negativeSchema = new Schema({
//   negativeWords: [Schema.Types.Mixed],
// });

const negativeWords = new Schema({
  word: String,
  count: Number,
});

const negativeSchema = new Schema({
  // negativeWords: [negativeWords],
  negativeWords: {
    type: Array,
    of: negativeWords,
  },
});

module.exports = mongoose.model('NegativeWords', negativeSchema);
