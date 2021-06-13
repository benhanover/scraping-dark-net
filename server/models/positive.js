const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positiveWords = new Schema({
  word: String,
  count: Number,
});

const positiveSchema = new Schema({
  positiveWords: {
    type: Array,
    of: positiveWords,
  },
});

module.exports = mongoose.model('PositiveWords', positiveSchema);
