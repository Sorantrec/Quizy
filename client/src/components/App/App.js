import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from "react-router-dom";
import moduleStyles from './App.module.scss';
import MainContext from '../hoc/Context';
import CreateQuestion from '../CreateQuestion/CreateQuestion';
import AdminPanel from './../AdminPanel/AdminPanel';
const axios = require('axios');

function App() {

  const [content, setContent] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [adminState, setAdminState] = useState();
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
    if (validateForm()) {
      axios.post('http://localhost:5000/post-answer', content);
    }
  }
  const handlePhoneNumber = (id, e) => {
    if (content._id === id) {
      setContent({ ...content, phoneNumber: e.target.value.replace(/\D/, '') });
    }
  }

  const validateForm = () => {
    setError(true);
    if (!content.chosenAnswer) {
      validationRef.current.textContent = 'Please choose answer';
      return false;
    }
    if ((!content.phoneNumber || content.phoneNumber.length < 11) && content.chosenAnswer) {
      setContent({ ...content, wrongPhoneNumber: true })
      validationRef.current.textContent = 'Please enter 11 numbers as your phone number';
      return false;
    }
    else if ((content.phoneNumber[0] !== '0' || content.phoneNumber[1] !== '7') && content.chosenAnswer) {
      setContent({ ...content, wrongPhoneNumber: true })
      validationRef.current.textContent = 'Please enter only British phone number';
      return false;
    }
    else if ((!content.phoneNumber || content.phoneNumber.length < 11) && !content.chosenAnswer) {
      validationRef.current.textContent = 'Please choose answer';
      return false;
    }
    else {
      setError(false);
      setContent({ ...content, wrongPhoneNumber: false })
      validationRef.current.textContent = 'Thanks for your answer, check if you are one of our winners!';
      return true;
    }
  }

  useEffect(() => {
    axios.get('http://localhost:5000/').then((res) => {
      let data = res.data;
      const currentDate = new Date;
      let currentItems = [];
      for (const item of data) {
        Object.assign(item, { chosenRightAnswer: false, chosenAnswer: false, wrongPhoneNumber: false });
        if (item.dateFrom) {
          const dateFrom = Date.parse(item.dateFrom);
          const dateTo = Date.parse(item.dateTo);
          if (currentDate.getTime() >= dateFrom && currentDate.getTime() <= dateTo) {
            currentItems.push(item);
          }
        }
      }
      setContent(currentItems[Math.floor(Math.random() * currentItems.length)]);
    })

    axios.get('http://localhost:5000/get-answers').then((res) => {
      let data = res.data;
      setAnswers(data);
    })
  }, []);

  const chooseAnswer = (id, answer) => {
    setContent((content) => {
      return { ...content, chosenAnswer: true }
    })
    if (id === content._id) {
      if (content.correctAnswer === Number(answer)) {
        setContent((content) => {
          return { ...content, chosenRightAnswer: true }
        });
      }
      else {
        setContent((content) => {
          return { ...content, chosenRightAnswer: false }
        });
      }
    }
  }

  const validationRef = useRef(null);

  return (
    <MainContext.Provider value={adminState}>
      {content && content.answers ? <div id={content._id} className={moduleStyles.container}>
        <Router>
          <Route exact path="/">
            <form onSubmit={(e) => handleSubmit(e)}>
              {content.imgUrl ? <div className={moduleStyles.imgBlock}><img src={content.imgUrl} alt="Question" /></div> : ''}
              <p className={`${moduleStyles.title} title`}>{content.title}</p>
              <div className={moduleStyles.answers}>{content.answers.map((answer, index) => <label key={`${answer}-${index}`} className="radio"><input type="radio" name="answers" onChange={() => chooseAnswer(content._id, answer)} /><div className="radioActive"></div><span>{answer}</span></label>)}</div>
              <label className={moduleStyles.phoneBlock}>
                <span className="subtitle">Your phone number</span>
                <input type="text" name="phoneNumber" value={content.phoneNumber} maxLength="11" placeholder="07123456789" className={`${moduleStyles.textInput} textInput`} onChange={(e) => handlePhoneNumber(content._id, e)} />
              </label>
              <input type="submit" value="Send" className="button" />
              <p className={error ? 'error' : 'success'} ref={validationRef}></p>
            </form>
          </Route>
          <Route path="/admin-panel" render={(props) => (<AdminPanel {...props} setAdminState={setAdminState} />)}></Route>
          <Route path="/create-question" render={(props) => (<CreateQuestion {...props} />)}></Route>
          <Link to="/" className={moduleStyles.logo}>Qui<span>zzz</span>y</Link>
          {!adminState ? <Link to="/admin-panel">Admin</Link> : null}
        </Router>
      </div> : <p>No data</p>}
    </MainContext.Provider>
  );
}

export default App;
