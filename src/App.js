import React, { useEffect, useState } from "react";
import Explanation from "./components/Explanation";
import Img from "react-image";
import ReactPlayer from "react-player";
import { Spinner } from "reactstrap";
import axios from "axios";
// import NASA_API_KEY from "./config";
import "./App.scss";

const classNames = require("classnames");
let timer;
const cache = {};

function App() {
  const [viewing, setViewing] = useState({});
  const [selectedDate, selectDate] = useState(new Date());
  const [isTextHidden, setTextHidden] = useState(false);
  const [fullText, setFullText] = useState(false);

  const formatDate = d => d.toISOString().match(/[^T]*/)[0];

  function fetchImageData(dateString) {
    const baseUrl = `https://api.nasa.gov/planetary/apod`;
    // const options = `?api_key=${NASA_API_KEY}&date=${dateString}`;
    const options = `?date=${dateString}`;
    axios
      .get(baseUrl + options)
      .then(({ data }) => {
        console.log("data received");
        cache[dateString] = data;
        if (data.date === formatDate(selectedDate)) {
          setViewing(data);
        }
      })
      .catch(err => {
        console.dir(err);
      });
  }

  useEffect(() => {
    console.log(cache);
    // fetches and caches 5 image datasets
    for (let i = 0; i < 5; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - i);
      const dateString = formatDate(d);
      if (!cache[dateString]) {
        fetchImageData(dateString);
      } else if (i === 0) {
        setViewing(cache[dateString]);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    document.onkeyup = handleKeyUp;
  }, [viewing]);

  useEffect(() => {
    document.onmousemove = function(e) {
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
    setTextHidden(false);
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

  const { date, explanation, hdurl, title, media_type, url } = viewing;
  const classes = classNames("fader", {
    "text-hidden": isTextHidden && !fullText
  });

  return (
    <div className="app">
      {media_type === "image" && (
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
      )}
      {media_type === "video" && (
        <ReactPlayer
          id="video"
          url={url}
          width={window.innerWidth}
          height={window.innerHeight}
          playing
        />
      )}
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
