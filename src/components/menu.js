import React, { useState, useCallback, useContext } from "react";
import { Link } from "react-router-dom";

import "./menu.scss";
import { userContext } from "../lib/contexts";

export function GuestMenu() {
  return (
    <section className="guest-menu">
      <nav className="nav">
        <ul className="nav__list">
          <li className="nav__item">
            <Link to="/" className="nav__link">
              home
            </Link>
          </li>
          <li className="nav__item">
            <Link to="/login" className="nav__link nav__link--login">
              log in
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}

export function UserMenu(props) {
  const [open, setOpen] = useState(false);
  const { logout, imgUrl, username, isAdmin } = useContext(userContext);
  const { style, ...rest } = props;

  const close = useCallback(() => {
    setOpen((prv) => !prv);
  }, []);

  return (
    <section className="user-menu" style={style} {...rest}>
      <div className="user-menu__name">{username}</div>
      <button
        className="user-menu__ninedot-btn"
        onClick={close}
        aria-label="open navigaiton"
      >
        <img src="/images/nine-dots-in-a-square.svg" alt="user menu" />
      </button>
      <div>
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
              <Link to="/chat-room" className="nav__link">
                chat room
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/friends" className="nav__link">
                friends
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/notifications" className="nav__link">
                notifications
              </Link>
            </li>

            {isAdmin ? (
              <li className="nav__item">
                <Link to="/reports" className="nav__link">
                  reports
                </Link>
              </li>
            ) : null}

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

export const GuestMenuMemo = React.memo(GuestMenu);
