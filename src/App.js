import React, { useEffect, useState } from "react";
import axios from "axios";
import NASA_API_KEY from "./config";
import "./App.scss";

function App() {
  const [data, setData] = useState({});
  const [selectedDate, selectDate] = useState(new Date());

  const formatDate = d => d.toISOString().match(/[^T]*/);

  useEffect(() => {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${formatDate(
      selectedDate
    )}`;
    axios.get(url).then(({ data }) => {
      console.log(data);
      setData(data);
    });
  }, [selectedDate]);

  useEffect(() => {
    document.onkeydown = handleKeyDown;
    return () => (document.onkeydown = null);
  }, [selectedDate]);

  function handleKeyDown(e) {
    switch (e.which) {
      case 37:
        selectDate(new Date(selectedDate.valueOf() - 86400000));
        break;
      case 39:
        let t = selectedDate.valueOf() + 86400000;
        if (t > Date.now()) return;
        selectDate(new Date(t));
        break;
    }
  }

  const { date, explanation, hdurl, title } = data;

  return (
    <div className="app">
      <h1>{title}</h1>
      <img className="hd-image" src={hdurl} />
      <p>{explanation}</p>
    </div>
  );
}

export default App;
