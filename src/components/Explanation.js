import React, { useState } from "react";
const classNames = require("classnames");

function truncate(str, num) {
  if (str && str[num]) {
    for (let i = num; i < str.length; i++) {
      if (/\W/.test(str[i]) && str[i + 1]) {
        str = str.slice(0, i) + "...";
        break;
      }
    }
  }
  return str;
}

function Explanation({ explanation }) {
  const [isTruncated, setTruncated] = useState(true);
  const classes = classNames("explanation", { overlay: !isTruncated });
  return (
    <div className={classes} onClick={() => setTruncated(!isTruncated)}>
      <p>{isTruncated ? truncate(explanation, 200) : explanation}</p>
    </div>
  );
}

export default Explanation;
