import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "./login.scss";
import Layout from "../components/layout";

export default function Login({ setUser }) {
  const [userName, setUserName] = useState("test");
  const [password, setPassword] = useState("test");
  const history = useHistory();

  const updateUserName = (e) => {
    setUserName(e.target.value);
  };
  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    console.log(userName, password);
    e.preventDefault();
    setUser({ isLogedIn: true, name: "null", logout: () => {} });
    history.replace("/");
    return false;
  };

  return (
    <Layout>
      <div className="login">
        <form className="login__form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            required
            className="login__username"
            value={userName}
            onChange={updateUserName}
          />
          <p className="login__error login__error--username">username error</p>
          <input
            type="password"
            placeholder="password"
            required
            className="login__password"
            value={password}
            onChange={updatePassword}
          />
          <p className="login__error login__error--password">username error</p>

          <input
            value="log in"
            id="but"
            type="submit"
            className="login__submit"
          />
        </form>
      </div>
    </Layout>
  );
}
