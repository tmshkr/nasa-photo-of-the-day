import React, { useEffect, useState } from "react";
import Explanation from "./components/Explanation";
import Img from "react-image";
import { Spinner } from "reactstrap";
import axios from "axios";
import NASA_API_KEY from "./config";
import "./App.scss";

function App() {
  const [data, setData] = useState({});
  const [selectedDate, selectDate] = useState(new Date());

  const formatDate = d => d.toISOString().match(/[^T]*/)[0];

  useEffect(() => {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${formatDate(
      selectedDate
    )}`;

    axios
      .get(url)
      .then(({ data }) => {
        console.log(data);
        setData(data);
      })
      .catch(err => console.dir(err));
  }, [selectedDate]);

  useEffect(
    function() {
      document.onkeyup = handleKeyUp;
    },
    [selectedDate]
  );

  function handleKeyUp(e) {
    let d;
    switch (e.which) {
      case 37:
        d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        selectDate(d);
        break;
      case 39:
        d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        if (d <= Date.now()) {
          selectDate(d);
        }
        break;
      default:
        break;
    }
  }

  const { date, explanation, hdurl, title } = data;

  return (
    <div className="app">
      <h1>{title}</h1>
      <Img
        className="hd-image"
        src={hdurl}
        loader={
          <Spinner
            type="grow"
            style={{ color: "#fff", width: "3rem", height: "3rem" }}
          />
        }
      />
      <Explanation explanation={explanation} />
    </div>
  );
}

export default App;
