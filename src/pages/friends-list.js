import React, { useCallback, useEffect, useState } from "react";

import "./friends-list.scss";
import Layout from "../components/layouts/layout";
import { useUserAuth } from "../lib/hooks";
import { ReportDialog } from "../components/dialogs";
import withUserAutentication from "../components/withUserAuthentication";

function UserCard(props) {
  let { username, reportUser, className = "", ...rest } = props;
  className += " user-card";
  return (
    <div className={className} {...rest}>
      <img
        className="user-card__img"
        src="/images/user_profile.png"
        alt={`${username}`}
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
        let allusers = await res.json();
        // removeing the current user
        allusers = allusers.filter((u) => u.username !== user.username);
        setUsers(
          allusers.map((user) => ({ id: user._id, username: user.username }))
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
    <Layout>
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
            <h2 className="friends-list__error">something went wron</h2>
          ) : (
            users.map((user) => (
              <UserCard
                key={user.id}
                username={user.username}
                reportUser={chooseReportUser}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default withUserAutentication(FriendsList);
