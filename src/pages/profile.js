import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./profile.scss";
import GridLayout from "../components/layouts/grid-layout";
import { UploadImg } from "../components/dialogs";
import { ProfileImg } from "../components/profile-img";
import { useUserAuth } from "../lib/hooks";
import { assignUserProps } from "../lib/assignProps";
import withUserAutentication from "../components/withUserAuthentication";

function InfoForm(props) {
  const [username, setUsername] = useState("");
  const [originalname, setOriginalname] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { user } = useUserAuth();

  useEffect(() => {
    setUsername(user.username);
    setOriginalname(user.originalname);
  }, [user.username, user.originalname]);

  if (!user) return null;

  async function changeUserName() {
    try {
      setLoading(true);
      const res = await fetch("/user/update-username", {
        method: "POST",
        body: JSON.stringify({ username }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log(user);
      if (data.errors) {
        setErrors(data.errors);
      }
      if (data.user) {
        //reset the errors
        setErrors({});
        //update the user
        assignUserProps(data.user, user.changeUser);
        user.changeUser(data.user);
      }
    } catch (e) {
      console.log(e);
      alert("something went wrong, try again later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div {...props}>
      <h2 className="profile__form-title">info</h2>
      <label>original name</label>
      <input value={originalname} disabled />
      <label>fake name</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <span className="profile__form-error">{errors.username}</span>
      <button
        onClick={changeUserName}
        disabled={username === user.username || loading}
        className={loading ? "ring-loader ring-loader--x-small" : ""}
      >
        save
      </button>
    </div>
  );
}

function PasswordForm(props) {
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  async function changePassword() {
    if (newPwd !== confirmPwd) {
      setErrors({
        password: "confirm password should match with new password",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/user/update-password", {
        method: "POST",
        body: JSON.stringify({ password: newPwd }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log(data);
      if (data.errors) {
        setErrors(data.errors);
      }
      if (data.user) {
        setErrors({});
        setNewPwd("");
        setConfirmPwd("");
        setTimeout(() => alert("password changed sucessfully"), 10);
      }
    } catch (e) {
      console.log(e);
      alert("something went wrong, try again later");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div {...props}>
      <h2 className="profile__form-title">change password</h2>
      <label>new password</label>
      <input
        type="password"
        value={newPwd}
        onChange={(e) => setNewPwd(e.target.value)}
      />
      <label>confirm password</label>
      <input
        value={confirmPwd}
        onChange={(e) => setConfirmPwd(e.target.value)}
      />
      <span className="profile__form-error">{errors.password}</span>
      <button
        onClick={changePassword}
        disabled={loading}
        className={loading ? "ring-loader ring-loader--x-small" : ""}
      >
        save
      </button>
    </div>
  );
}

function AccoundDeleteBtn(props) {
  const [agreed, setAggred] = useState(false);
  const history = useHistory();
  async function deleteUser() {
    await fetch("/user/remove-user");
    history.push("/");
  }
  return (
    <div {...props}>
      <button onClick={deleteUser} disabled={!agreed}>
        delete my accound
      </button>
      <label>
        <input type="checkbox" onChange={() => setAggred((bool) => !bool)} /> I
        agree to delete my accound
      </label>
    </div>
  );
}

const ProfileImgContainer = function ({ user }) {
  const [visible, setVisible] = useState(false);

  const { profileImgPath, username, changeUser } = user;
  return (
    <>
      <UploadImg
        visible={visible}
        setVisible={setVisible}
        changeUser={changeUser}
      />
      <div className="profile__pic-container">
        <ProfileImg
          src={profileImgPath}
          className="profile__pic"
          username={username}
        />
        <button
          className="profile__upload-btn"
          onClick={() => setVisible(true)}
        >
          &#9998;
        </button>
      </div>
    </>
  );
};

export function Profile() {
  const { user } = useUserAuth();
  return (
    <GridLayout>
      <main className="profile">
        <div className="profile__intro">
          <div className="profile__section">
            <ProfileImgContainer user={user} />
          </div>
        </div>
        <div className="profile__section">
          <h1 className="profile__username">Wellcome {user.username}</h1>
        </div>
        <div className="profile__form-container profile__form-container--info">
          <div className="profile__form-content">
            <InfoForm className="profile__form profile__form--info" />
          </div>
        </div>
        <div className="profile__form-container profile__form-container--pwd">
          <div className="profile__form-content">
            <PasswordForm className="profile__form profile__form--pwd" />
          </div>
        </div>
        <AccoundDeleteBtn className="profile__section profile__account-deletion-content" />
      </main>
    </GridLayout>
  );
}

export default withUserAutentication(Profile);
