import React, { useEffect, useState } from "react";
import Explanation from "./components/Explanation";
import Img from "react-image";
import { Spinner } from "reactstrap";
import axios from "axios";
import NASA_API_KEY from "./config";
import "./App.scss";

const classNames = require("classnames");
let timer;
const cache = {};

function App() {
  const [data, setData] = useState({});
  const [selectedDate, selectDate] = useState(new Date());
  const [isTextHidden, setTextHidden] = useState(false);
  const [fullText, setFullText] = useState(false);

  const formatDate = d => d.toISOString().match(/[^T]*/)[0];

  function fetchImageData(dateString) {
    const baseUrl = `https://api.nasa.gov/planetary/apod`;
    const options = `?api_key=${NASA_API_KEY}&date=${dateString}`;
    axios
      .get(baseUrl + options)
      .then(({ data }) => {
        cache[dateString] = data;
        setTextHidden(false);
        setData(data);
      })
      .catch(err => {
        console.dir(err);
      });
  }

  useEffect(() => {
    console.log("axios useEffect");
    const dateString = formatDate(selectedDate);
    console.log(cache);

    if (cache[dateString]) {
      setTextHidden(false);
      setData(cache[dateString]);
    } else {
      fetchImageData(dateString);
    }
  }, [selectedDate]);

  useEffect(() => {
    console.log("handleKeyUp useEffect");
    document.onkeyup = handleKeyUp;
  }, [data]);

  useEffect(() => {
    console.log("onmousemove useEffect");
    document.onmousemove = function(e) {
      // console.log(e);
      if (isTextHidden) {
        setTextHidden(false);
        handleTimer();
      }
    };
  }, [isTextHidden]);

  useEffect(() => {
    setTimeout(() => {
      document.querySelector(".tip").classList.add("fade-out");
    }, 2500);
  }, []);

  function handleKeyUp(e) {
    const d = new Date(selectedDate);
    switch (e.which) {
      case 37:
        d.setDate(d.getDate() - 1);
        selectDate(d);
        break;
      case 39:
        d.setDate(d.getDate() + 1);
        if (d <= Date.now()) {
          selectDate(d);
        }
        break;
      default:
        break;
    }
  }

  function handleTimer() {
    clearInterval(timer);
    timer = setTimeout(() => setTextHidden(true), 3000);
  }

  const { date, explanation, hdurl, title } = data;
  const classes = classNames("fader", {
    "text-hidden": isTextHidden && !fullText
  });

  return (
    <div className="app">
      <Img
        className="hd-image"
        src={hdurl}
        onLoad={handleTimer}
        loader={
          <Spinner
            type="grow"
            style={{ color: "#fff", width: "3rem", height: "3rem" }}
          />
        }
      />
      <div className={classes}>
        <h1>{title}</h1>
        <Explanation
          explanation={explanation}
          handleText={[fullText, setFullText]}
        />
        <time>{date}</time>
      </div>
      <div className="tip">Use ← or → keys to navigate</div>
    </div>
  );
}

export default App;
