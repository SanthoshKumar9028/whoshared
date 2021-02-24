import React, { useCallback, useState } from "react";

import "./reports.scss";
import GridLayout from "../components/layouts/grid-layout";
import withUserAutentication from "../components/withUserAuthentication";
import { TakeActionDialog } from "../components/dialogs";
import { useUserAuth } from "../lib/hooks";

function Reasons({ username, reasons, ...rest }) {
  return (
    <div {...rest}>
      <h3>Reported by {username}</h3>
      <ul>
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
    </div>
  );
}

const ReportContainer = function (props) {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { user } = useUserAuth();

  let {
    _id,
    reports,
    className = "",
    children,
    takeAction,
    removeRequestById,
    ...rest
  } = props;
  useState(() => {
    async function fetchUserInfo() {
      setLoading(true);
      try {
        const url = `/user/user-info-by?type=_id&value=${_id}`;
        const res = await fetch(url);
        const data = await res.json();

        // console.log(data.user);
        setUserInfo(data.user);
      } catch (e) {
        console.log(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, [_id]);

  if (loading) className += ` ring-loader`;

  if (error) return null;

  const handleDeleteReport = async function () {
    const permission = prompt(`Type ${userInfo.username} to remove`);
    if (permission !== userInfo.username) return;
    let message = "";
    try {
      const url = `/admin/reports/${_id}`;
      const res = await fetch(url, { method: "delete" });

      if (res.ok) {
        message = "Removed sucessfully";
        removeRequestById(_id);
      } else message = "Something went wrong";
    } catch (e) {
      console.log(e);
      message = "Server error, try again later";
    } finally {
      alert(message);
    }
  };

  const handleCloseReport = () => removeRequestById(_id);

  return (
    <section className={`${className} report`} {...rest}>
      <div className="report__header">
        <img
          src="/images/user_profile.png"
          alt={`${userInfo.username} profile`}
          className="report__profile-img"
        />
        <h2 className="report__username">{userInfo.username}</h2>
        <button className="report__close-btn" onClick={handleCloseReport}>
          X
        </button>
      </div>
      {reports.map((report) => (
        <Reasons
          key={report._id}
          username={report.username}
          reasons={report.reasons}
        />
      ))}
      <div className="report__btn-container">
        <button
          className="report__delete-report-btn"
          onClick={handleDeleteReport}
        >
          delete
        </button>
        {userInfo.username === user.username ? null : (
          <button
            className="report__take-action-btn"
            onClick={() =>
              takeAction({ id: userInfo._id, username: userInfo.username })
            }
          >
            take action
          </button>
        )}
      </div>
    </section>
  );
};

export function Reports() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const [userForAction, setUserForAction] = useState({});

  useState(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const res = await fetch("/admin/all-reports");
        const data = await res.json();
        // console.log(data);
        setRequests(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const close = useCallback(() => setDialogVisibility(false), []);

  const takeAction = useCallback((user) => {
    setDialogVisibility(true);
    setUserForAction(user);
  }, []);

  const removeRequestById = useCallback(
    (id) => {
      setRequests(requests.filter((req) => req._id !== id));
    },
    [requests]
  );

  if (loading)
    return (
      <main
        className="ring-loader ring-loader--tp-bg"
        style={{ minHeight: "100vh" }}
      ></main>
    );

  return (
    <GridLayout>
      <TakeActionDialog
        {...userForAction}
        visible={dialogVisibility}
        close={close}
      />
      <main className="reports">
        <div className="reports__content">
          <h1>Reports</h1>
          {requests.map((req) => {
            // console.log(req._id);
            return (
              <ReportContainer
                removeRequestById={removeRequestById}
                takeAction={takeAction}
                {...req}
                key={req._id}
              />
            );
          })}
        </div>
      </main>
    </GridLayout>
  );
}

export default React.memo(withUserAutentication(Reports));
