import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import moduleStyles from './CreateQuestion.module.scss';
import MainContext from '../hoc/Context';

const CreateQuestion = () => {
  const admin = useContext(MainContext);
  const [answersCount, setAnswersCount] = useState(1);
  const [imgUrl, setImgUrl] = useState("");
  const [title, setTitle] = useState("");
  const [answers, setAnswers] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [rightAnswer, setRightAnswer] = useState("");
  const [error, setError] = useState(false);

  const createAnswer = (e) => {
    e.preventDefault();
    setAnswersCount((answersCount) => answersCount + 1);
  }

  const getAnswers = (index, e) => {
    let data = [...answers];
    data[index] = e.target.value;
    setAnswers(data);
  }

  const createQuestion = (e) => {
    e.preventDefault();
    if (title && answers && dateFrom && dateTo && rightAnswer) {
      axios.get('http://localhost:5000/')
        .then((res) => {
          const data = res.data;
          for (let item of data) {
            if (item.title === title) {
              setError(true);
              infoRef.current.textContent = 'Sorry, the question is in database';
              return;
            }
          }
          axios.post('http://localhost:5000/create-question', { imgUrl, title, answers, rightAnswer, dateFrom, dateTo })
          setError(false);
          infoRef.current.textContent = 'Question is added, thank you';
        })
    }
    else {
      setError(true);
      infoRef.current.textContent = 'Please correct the form';
    }
  }

  const infoRef = useRef();

  return (
    admin ? <form onSubmit={(e) => createQuestion(e)}>
      <div className={moduleStyles.row}>
        <input type="text" name="title" className={`${moduleStyles.textInput} textInput`} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" name="rightAnswer" className={`${moduleStyles.textInput} textInput`} placeholder="Right answer" value={rightAnswer} onChange={(e) => setRightAnswer(e.target.value)} />
        <input type="text" name="imgUrl" className={`${moduleStyles.textInput} textInput`} placeholder="Image link" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
      </div>
      <div className={moduleStyles.answersContainer}>
        {[...Array(answersCount)].map((key, index) => <input key={`answer-${index}`} type="text" name={`answer-${index + 1}`} className="textInput" placeholder={`Answer ${index + 1}`} defaultValue="" onChange={(e) => getAnswers(index, e)} />)}
        <button className="button" onClick={(e) => createAnswer(e)}>+</button>
      </div>
      <div className={moduleStyles.row}>
        <label className="label">
          <span className={moduleStyles.title}>Quiz date from</span>
          <input type="date" name="dateFrom" className="textInput" onChange={(e) => setDateFrom(e.target.value)} />
        </label>
        <label className="label">
          <span className={moduleStyles.title}>Quiz date to</span>
          <input type="date" name="dateTo" className="textInput" onChange={(e) => setDateTo(e.target.value)} />
        </label>
      </div>
      <input type="submit" className="button" value="Create question" />
      <p ref={infoRef} className={`${error ? 'error' : 'success'}`}></p>
    </form> : <p>Sorry but you need to be admin</p>
  )
}

export default CreateQuestion;