import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "./login.scss";
import Layout from "../components/layout";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("batmannew");
  const [password, setPassword] = useState("arun567");
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: "",
  });
  const history = useHistory();

  const updateUserName = (e) => {
    setUsername(e.target.value);
  };
  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetch("/auth/login-user", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      if (data.errors) {
        setValidationErrors(data.errors);
      }
      if (data.user) {
        data.user.isLogedIn = true;
        data.user.logout = async function () {
          try {
            await fetch("/auth/logout-user");
          } finally {
            setUser({ isLogedIn: false });
          }
        };
        setUser(data.user);
        history.replace("/profile");
      }
    } catch (e) {
      alert("try again later.");
    }
  };

  return (
    <Layout>
      <div className="login">
        <form className="login__form" onSubmit={handleSubmit}>
          <div>
            <h2 className="login__title">login form</h2>
          </div>
          <div>
            <input
              type="text"
              placeholder="username"
              required
              className="login__username"
              value={username}
              onChange={updateUserName}
            />
            <p className="login__error login__error--username">
              {validationErrors.username}
            </p>
            <input
              type="password"
              placeholder="password"
              required
              className="login__password"
              value={password}
              onChange={updatePassword}
            />
            <p className="login__error login__error--password">
              {validationErrors.password}
            </p>

            <input
              value="log in"
              id="but"
              type="submit"
              className="login__submit"
            />
          </div>
        </form>
      </div>
    </Layout>
  );
}
