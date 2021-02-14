import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import MainContext from '../hoc/Context';
import moduleStyles from './AdminPanel.module.scss';
const axios = require('axios');

const AdminPanel = ({ setAdminState }) => {
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const context = React.useContext(MainContext);
  const validateUser = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/admin-panel', { login, password });
    axios.get('http://localhost:5000/authorize').then((res) => {
      setAdminState(res.data);
    })
  }

  let history = useHistory();

  useEffect(() => {
    if (context) {
      history.push('/create-question');
    }
  }, [context]);

  return (
    <div>
      <form onSubmit={(e) => validateUser(e)}>
        <p className="title">Login</p>
        <input type="text" name="login" className={`${moduleStyles.textInput} textInput`} placeholder="Your login" onChange={(e) => setLogin(e.target.value)} />
        <input type="password" name="password" className={`${moduleStyles.textInput} textInput`} placeholder="Your password" onChange={(e) => setPassword(e.target.value)} />
        <input type="submit" value="Submit" className="button" />
      </form>
    </div>
  )
}

export default AdminPanel;