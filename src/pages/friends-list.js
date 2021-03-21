import React, { useCallback, useEffect, useState } from "react";

import "./friends-list.scss";
import GridLayout from "../components/layouts/grid-layout";
import { useUserAuth } from "../lib/hooks";
import { ReportDialog } from "../components/dialogs";
import withUserAutentication from "../components/withUserAuthentication";
import { ProfileImg } from "../components/profile-img";

function UserCard(props) {
  let { username, profileImgPath, reportUser, className = "", ...rest } = props;
  className += " user-card";
  return (
    <div className={className} {...rest}>
      <ProfileImg
        className="user-card__img"
        src={profileImgPath}
        username={username}
      />
      <h2 className="user-card__username">{username}</h2>
      <button
        className="user-card__report-btn"
        onClick={() => reportUser(username)}
      >
        report
      </button>
    </div>
  );
}

export function FriendsList() {
  const [loading, setLoading] = useState(false);
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const [reportableUser, setReportableUser] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useUserAuth();

  const toggleDialogVisibility = useCallback(() => {
    setDialogVisibility((prv) => !prv);
  }, []);
  const chooseReportUser = useCallback((username) => {
    setDialogVisibility(true);
    setReportableUser(username);
  }, []);

  //fething the user
  useEffect(() => {
    setLoading(true);
    async function fetchUsers() {
      try {
        const res = await fetch("/user/users-info");
        if (res.ok === false) throw Error("response is not ok");
        let allusers = await res.json();
        // removeing the current user
        allusers = allusers.filter((u) => u.username !== user.username);
        setUsers(
          allusers.map((user) => ({
            id: user._id,
            username: user.username,
            profileImgPath: user.profileImgPath,
          }))
        );
      } catch (e) {
        console.log(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [user.username]);

  return (
    <GridLayout>
      <div className="friends-list">
        <ReportDialog
          visible={dialogVisibility}
          close={toggleDialogVisibility}
          reportUsername={reportableUser}
        />
        <div
          className={
            loading
              ? "friends-list__users ring-loader ring-loader--tp-bg"
              : "friends-list__users"
          }
        >
          {error ? (
            <h2 className="friends-list__error">something went wrong</h2>
          ) : (
            users.map((user) => (
              <UserCard
                key={user.id}
                username={user.username}
                profileImgPath={user.profileImgPath}
                reportUser={chooseReportUser}
              />
            ))
          )}
        </div>
      </div>
    </GridLayout>
  );
}

export default withUserAutentication(FriendsList);
