const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://admin:admin228@cluster0.izfij.mongodb.net/custom-mern-app?retryWrites=true&w=majority';
const bcrypt = require('bcrypt');
const Question = require(path.join(__dirname, './models/Question'));
const Answer = require(path.join(__dirname, './models/Answer'));
const Admin = require(path.join(__dirname, './models/Admin'));

const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((data) => {
  console.log('MongoDb Atlas connected');

  app.listen(port || 5000, () => {
    console.log(`Server listening on port ${port ? port : 5000}`);
  })

  app.get('/', (req, res) => {
    Question.find()
      .then((data) => {
        res.send(data);
      })
  })

  app.get('/get-answers', (req, res) => {
    Answer.find()
      .then((data) => {
        res.send(data);
      })
  })

  app.post('/create-question', (req, res) => {

    let question = new Question({
      imgUrl: req.body.imgUrl,
      title: req.body.title,
      answers: req.body.answers,
      rightAnswer: req.body.rightAnswer,
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo
    })

    Question.find({
      title: req.body.title

    }, (err, docs) => {
      if (docs.length) {
        console.log('Question is in database');
      } else {
        question.save()
          .then((data) => {
            res.send(data);
            console.log('Question is posted', data);
          })
          .catch((err) => console.log('error', err))
      }
    })

  })

  app.post('/post-answer', (req, res) => {
    let answer = new Answer({
      questionId: req.body._id,
      phoneNumber: req.body.phoneNumber,
      chosenRightAnswer: req.body.chosenRightAnswer,
    })

    Answer.find({
      questionId: req.body._id,
      phoneNumber: req.body.phoneNumber
    }, (err, docs) => {
      if (docs.length) {
        console.log('Answer is in database');
      } else {
        answer.save()
          .then((data) => {
            res.send(data);
            console.log('Answer is posted', data);
          })
          .catch((err) => console.log('error', err))
      }
    })

  })

  let admin = false;

  app.post('/admin-panel', (req, res) => {
    let { login, password } = req.body;
    Admin.find({ login, password }, (err, docs) => {
      if (docs.length) {
        admin = true;
      }
    })
  })

  app.get('/authorize', (req, res) => {
    res.send(admin);
  })


}).catch((err) => {
  console.log('Error', err);
})