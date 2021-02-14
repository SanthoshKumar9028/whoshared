import React, { useState, useEffect } from "react";

import { useUserAuth } from "../../lib/hooks";

export function TypingUsers(props) {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(true);
  const [users, setUsers] = useState([]);
  const { user: currentUser = {} } = useUserAuth();
  const {
    className = "",
    userTypingStarted,
    userTypingStoped,
    ...rest
  } = props;

  useEffect(() => {
    const controller = new AbortController();

    async function getUserStates() {
      try {
        const res = await fetch("/user/user-states", {
          signal: controller.signal,
        });
        if (res.ok) {
          const u = await res.json();
          // console.log(u);
          setUsers(u);
        }
        setLoading(false);
        setHasError(false);
      } catch (e) {
        console.log(e);
        if (e.name !== "AbortError") {
          setHasError(true);
          setLoading(false);
        }
      }
    }
    getUserStates();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    // changing the user typing state based on the props
    let newUserState = users.map((user) => {
      if (user.username === userTypingStarted.username)
        return {
          ...user,
          isTyping: true,
        };
      return user;
    });
    setUsers(newUserState);
  }, [userTypingStarted]);

  useEffect(() => {
    // changing the user typing state based on the props
    let newUserState = users.map((user) => {
      if (user.username === userTypingStoped.username)
        return {
          ...user,
          isTyping: false,
        };
      return user;
    });

    setUsers(newUserState);
  }, [userTypingStoped]);

  if (loading)
    return (
      <div className={className}>
        <h2>Loading...</h2>
      </div>
    );

  if (hasError)
    return (
      <div className={className}>
        <h2>Something went wrong.</h2>
      </div>
    );

  return (
    <div className={className} {...rest}>
      <h2>Friends</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) =>
            user.username === currentUser.username ? null : (
              <li
                key={user.username}
                className={`chat-room__user-item ${
                  user.isTyping ? "chat-room__user-item--typing" : ""
                } ${
                  user.logedin
                    ? "chat-room__user-item--online"
                    : "chat-room__user-item--offline"
                }`}
              >
                <span>o</span>
                {user.username}
              </li>
            )
          )}
        </ul>
      ) : null}
    </div>
  );
}
