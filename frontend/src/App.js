import './App.css';
import Login from './pages/Login/Login.js'
import UserEntry from './pages/UserEntry/UserEntry.js'
import Home from './pages/Home/Home';

import React,{ useState, useEffect }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



function App() {

  const [data, setdata] = useState({
    x : ""
  });

  useEffect(() => {
    // Fetching the API endpoint from the flask server
    fetch("http://127.0.0.1:5000/data",{
      'methods':'GET',
      headers : {
        'Content-Type':'application/json'
      }
    })
    .then(function (res){
      res.json()
      .then(function (data) {
        setdata({
          x : data.X
        });
      });
    });
  }, []);

  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/userentry" element={<UserEntry />} />
          <Route path="/homepage" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
