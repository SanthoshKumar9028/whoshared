import React, { useState, useCallback, useContext } from "react";
import { Link } from "react-router-dom";

import "./menu.scss";
import { userContext } from "../lib/contexts";

function GuestMenu() {
  return (
    <section className="guest-menu" style={{ visibility: "hidden" }}>
      <nav className="nav">
        <ul className="nav__list">
          <li className="nav__item">
            <a href="/login" className="nav__link">
              log in
            </a>
          </li>
        </ul>
      </nav>
    </section>
  );
}

function UserMenu(props) {
  const [open, setOpen] = useState(false);
  const { logout, imgUrl } = useContext(userContext);
  const { style, ...rest } = props;

  const close = useCallback(() => {
    setOpen((prv) => !prv);
  }, []);
  const keyhandler = useCallback((e) => {
    if (e.keyCode === 13) {
      setOpen((prv) => !prv);
    }
  }, []);

  return (
    <section className="user-menu" style={style} {...rest}>
      <div
        onClick={close}
        onKeyUp={keyhandler}
        tabIndex="0"
        aria-label="open navigaiton"
      >
        <summary>
          {imgUrl ? (
            <img className="profile-img" src={imgUrl} alt="user profile" />
          ) : (
            <img
              className="profile-img"
              src="/images/user_profile.png"
              alt="user profile"
            />
          )}
        </summary>
        <nav className="nav" style={{ display: open ? "block" : "none" }}>
          <ul className="nav__list">
            <li className="nav__item">
              <Link to="/profile" className="nav__link">
                my profile
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/group-chat" className="nav__link">
                chat room
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/friends" className="nav__link">
                friends
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/register" className="nav__link">
                register
              </Link>
            </li>
            <li className="nav__item">
              <a
                href="/log-out"
                className="nav__link"
                onClick={(e) => {
                  e.preventDefault();
                  if (logout) logout();
                }}
              >
                logout
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}

const GuestMenuMemo = React.memo(GuestMenu);

export default function Menu() {
  const { isLogedIn } = useContext(userContext);

  //if user loged in
  if (isLogedIn) {
    return <UserMenu />;
  }
  return <GuestMenuMemo />;
}