import React, { useEffect, useState } from "react";
import Explanation from "./components/Explanation";
import Img from "react-image";
import { Spinner } from "reactstrap";
import axios from "axios";
import NASA_API_KEY from "./config";
import "./App.scss";

const classNames = require("classnames");
let timer;

function App() {
  const [data, setData] = useState({});
  const [selectedDate, selectDate] = useState(new Date());
  const [isTextHidden, setTextHidden] = useState(false);

  const formatDate = d => d.toISOString().match(/[^T]*/)[0];

  useEffect(() => {
    console.log("axios useEffect");
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${formatDate(
      selectedDate
    )}`;

    axios
      .get(url)
      .then(({ data }) => {
        setTextHidden(false);
        setData(data);
      })
      .catch(err => console.dir(err));
  }, [selectedDate]);

  useEffect(() => {
    console.log("handleKeyUp useEffect");
    document.onkeyup = handleKeyUp;
  }, [data]);

  useEffect(() => {
    console.log("onmousemove useEffect");
    document.onmousemove = function(e) {
      console.log(e);
      if (isTextHidden) {
        setTextHidden(false);
        handleTimer();
      }
    };
  }, [isTextHidden]);

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
  const classes = classNames("app", { "text-hidden": isTextHidden });

  return (
    <div className={classes}>
      <h1>{title}</h1>
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
      <Explanation explanation={explanation} />
      <time>{date}</time>
    </div>
  );
}

export default App;
