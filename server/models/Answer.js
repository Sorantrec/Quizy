const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answer = new Schema({
  questionId: String,
  phoneNumber: Number,
  chosenRightAnswer: Boolean,
  repeatingAnswer: Boolean
})

const Answer = mongoose.model('Answer', answer);

module.exports = Answer;