import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

axios.interceptors.request.use(function(config) {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ` + accessToken
  }
  return config
})

axios.interceptors.response.use(
  response => {
    return response
  },
  async error =>{
    let {data,config} = error.response;
    if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
        
      const res = await refreshToken();

      if(res.status === 200) {
        return axios(config);
      } else {
        throw res.data
      }
        
    } else {
      return error.response;
    }
  }
)
async function refreshToken() {
  const res = await axios.get('http://localhost:3000/user/refresh', {
      params: {
        refresh_token: localStorage.getItem('refresh_token')
      }
  });
  localStorage.setItem('access_token', res.data.access_token);
  localStorage.setItem('refresh_token', res.data.refresh_token);
  return res;
}


function App() {
  const [aaa,setAaa] = useState()
  const [bbb,setBbb] = useState()

async function login() {
  const res = await axios.post('http://localhost:3000/user/login',{
    username:"admin",
    password:"123456"
  })
  localStorage.setItem('access_token',res.data.access_token);
  localStorage.setItem('refresh_token',res.data.refresh_token)
}
  async function query() {
    if(!localStorage.getItem('access_token')) {
      await login();
    }

    const { data: aaaData } = await axios.get('http://localhost:3000/aaa');
    const { data: bbbData } = await axios.get('http://localhost:3000/bbb')
    

    setAaa(aaaData);
    setBbb(bbbData);
  }

  useEffect(() => {
    query()
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
