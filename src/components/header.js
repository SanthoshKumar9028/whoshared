import React, { useContext } from "react";

import "./header.scss";
import { GuestMenu, UserMenu } from "./menu";
import { useUserAuth } from "../lib/hooks";

export default function Header(props) {
  const { isUser } = useUserAuth();
  let { className, guestmenu, ...rest } = props;
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
        {guestmenu || !isUser ? <GuestMenu /> : <UserMenu />}
      </div>
    </header>
  );
}
