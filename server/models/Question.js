const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  imgUrl: String,
  title: String,
  answers: Array,
  rightAnswer: String,
  dateFrom: Date,
  dateTo: Date
})

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;