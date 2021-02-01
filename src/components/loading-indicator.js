import React from "react";

import "./loading-indicator.scss";

export default function Indicator(props) {
  let { className, ...rest } = props;

  if (className) className += " loading-indicator";
  else className = "loading-indicator";

  return (
    <div className={className} {...rest}>
      <div className="loading-indicator__content">
        <div className="loading-indicator__ball"></div>
        <div className="loading-indicator__shadow"></div>
      </div>
    </div>
  );
}
