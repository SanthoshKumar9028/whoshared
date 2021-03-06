import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "./login.scss";
import GridLayout from "../components/layouts/grid-layout";
import { assignUserProps } from "../lib/assignProps";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("batman");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      setLoading(true);
      const data = await fetch("/auth/login-user", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setLoading(false);
      if (data.errors) {
        setValidationErrors(data.errors);
      }
      if (data.user) {
        assignUserProps(data.user, setUser);
        setUser(data.user);
        history.replace("/profile");
      }
    } catch (e) {
      setLoading(false);
      alert("try again later.");
    }
  };

  return (
    <GridLayout>
      <main className="login">
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
              type={showPassword ? "text" : "password"}
              placeholder="password"
              required
              className="login__password"
              value={password}
              onChange={updatePassword}
            />
            <p className="login__error login__error--password">
              {validationErrors.password}
            </p>

            <label className="login__toggle-password">
              <input
                type="checkbox"
                onClick={() => setShowPassword(!showPassword)}
              />
              {showPassword ? "Hide" : "Show"} passsword
            </label>

            <button
              id="but"
              type="submit"
              disabled={loading}
              className={
                loading
                  ? "login__submit ring-loader ring-loader--x-small"
                  : "login__submit"
              }
            >
              log in
            </button>
          </div>
        </form>
      </main>
    </GridLayout>
  );
}
