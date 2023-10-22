import React, { useEffect } from 'react';

import './App.css';

function App() {

  useEffect(() => {
    const eventStore = new EventSource('http://localhost:3000/stream')
    eventStore.onmessage = ({ data }) => {
      console.log(JSON.parse(data));

    }
  })
  return (
    <div>hello</div>
  )
}

export default App;
