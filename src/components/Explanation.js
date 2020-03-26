import React from "react";
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

function Explanation(props) {
  const { explanation, handleText } = props;
  const [fullText, setFullText] = handleText;
  const classes = classNames("explanation", { overlay: fullText });
  return (
    <div className={classes} onClick={() => setFullText(!fullText)}>
      <p>{fullText ? explanation : truncate(explanation, 200)}</p>
    </div>
  );
}

export default Explanation;
