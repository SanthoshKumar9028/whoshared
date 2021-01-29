import React from "react";
import Menu from "./menu";

import "./header.scss";

export default function Header(props) {
  let { className, ...rest } = props;
  if (className) className += " header";
  else className = "header";

  return (
    <header className={className} {...rest}>
      <div className="header__content">
        <a href="/">
          <img
            className="header__logo"
            src="/images/android-chrome-512x512.png"
            alt="who shared application logo"
          />
        </a>
        <Menu />
      </div>
    </header>
  );
}
