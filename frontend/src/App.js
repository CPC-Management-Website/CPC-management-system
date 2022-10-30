import './App.css';
import React,{ useState, useEffect }  from 'react';
import Login from './pages/Login/Login.js'
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
    <div className="App">
      {data.x}
    </div>
  );
}

export default App;
