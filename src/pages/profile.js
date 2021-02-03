import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./profile.scss";
import Layout from "../components/layout";
import { useUserAuth } from "../lib/hooks";

function InfoForm(props) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useUserAuth();

  useEffect(() => {
    setUsername(user.username);
    setLoading(false);
  }, []);

  if (loading) return <h2>loading...</h2>;

  return (
    <div {...props}>
      <h2 className="profile__form-title">info</h2>
      <label>original name</label>
      <input value="temprator" disabled />
      <label>fake name</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <span className="profile__form-error"></span>
      <button disabled={username === user.username}>save</button>
    </div>
  );
}

function PasswordForm(props) {
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const { user } = useUserAuth();

  return (
    <div {...props}>
      <h2 className="profile__form-title">change password</h2>
      <label>new password</label>
      <input value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
      <label>confirm password</label>
      <input
        value={confirmPwd}
        onChange={(e) => setConfirmPwd(e.target.value)}
      />
      <span className="profile__form-error"></span>
      <button disabled={!newPwd || newPwd !== confirmPwd}>save</button>
    </div>
  );
}

function AccoundDeleteBtn(props) {
  const [agreed, setAggred] = useState(false);
  return (
    <div {...props}>
      <button disabled={!agreed}>delete my accound</button>
      <label>
        <input type="checkbox" onChange={() => setAggred((bool) => !bool)} /> I
        agree to delete my accound
      </label>
    </div>
  );
}

export default function Profile() {
  const { isUser, toRedirectPath, user } = useUserAuth();
  const history = useHistory();
  if (!isUser) {
    history.replace(toRedirectPath);
    return null;
  }
  return (
    <Layout>
      <main className="profile">
        <div className="profile__intro">
          <div className="profile__section">
            <div className="profile__pic-container">
              <img
                src="/images/user_profile.png"
                className="profile__pic-img"
                alt="user profile"
              />
            </div>
          </div>
        </div>
        <div className="profile__section">
          <h1 className="profile__username">Wellcome {user.username}</h1>
        </div>
        <div className="profile__info profile__section">
          <InfoForm className="profile__form" />
        </div>
        <div className="profile__pwd-info profile__section">
          <PasswordForm className="profile__form" />
        </div>
        <AccoundDeleteBtn className="profile__section profile__account-deletion-content" />
      </main>
    </Layout>
  );
}
