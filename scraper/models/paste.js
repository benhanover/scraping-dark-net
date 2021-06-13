const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pasteSchema = new Schema({
  author: {
    type: String,
  },
  date: {
    type: Date,
  },
  title: {
    type: String,
  },
  content: {
    type: Array,
  },
  afinnScore: {
    type: Number,
    default: null,
  },
});

module.exports = mongoose.model('Paste', pasteSchema);
