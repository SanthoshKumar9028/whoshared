import React from "react";

import "./buttons.scss";

export function FabButton(props) {
  let { className = "", children, ...rest } = props;
  className += " fab-button fab-button--default right-1em";

  return (
    <button className={className} {...rest}>
      <span> {children} </span>
    </button>
  );
}
