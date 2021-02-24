import React, { useCallback, useEffect, useState } from "react";

import "./notifications.scss";
import GridLayout from "../components/layouts/grid-layout";
import withUserAutentication from "../components/withUserAuthentication";

const symbols = {
  warning: () => <span>&#9888;</span>,
  general: () => <span>&#9872;</span>,
};

const Notification = React.memo(function (props) {
  let {
    _id,
    body,
    deleteNotificationById,
    type,
    className = "",
    ...rest
  } = props;
  className += " notifications__notification";
  const Symbol = symbols[type];
  return (
    <div key={_id} className={className} {...rest}>
      <h2 className="symbol">
        <Symbol />
        <button
          className="close-btn"
          onClick={() => deleteNotificationById(_id)}
        >
          X
        </button>
      </h2>
      <p className="text">{body}</p>
    </div>
  );
});

export function Notifications() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  //fething the notification
  useEffect(() => {
    setLoading(true);
    async function fetchNotification() {
      try {
        const res = await fetch("/user/notifications");
        if (res.ok === false) throw Error("response is not ok");
        let data = await res.json();
        setNotifications(data.notifications);
      } catch (e) {
        console.log(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchNotification();
  }, []);

  const deleteNotificationById = useCallback(async (id) => {
    try {
      const res = await fetch(`/user/notification/${id}`, { method: "delete" });
      setNotifications((prvNotifications) =>
        prvNotifications.filter((notity) => notity._id !== id)
      );
      if (res.ok === false) throw Error("response is not ok");
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <GridLayout>
      <div className="notifications">
        <h1>Notifications</h1>
        <div
          className={
            loading
              ? "notifications__content ring-loader ring-loader--tp-bg"
              : "notifications__content"
          }
        >
          {error ? (
            <h2 className="friends-list__error">
              &#9785; <br /> something went wrong
            </h2>
          ) : (
            notifications.map((notification) => {
              let className = "notifications__notification--general";

              if (notification.type === "warning")
                className = "notifications__notification--warning";

              return (
                <Notification
                  key={notification._id}
                  className={className}
                  {...notification}
                  deleteNotificationById={deleteNotificationById}
                />
              );
            })
          )}
        </div>
      </div>
    </GridLayout>
  );
}

export default React.memo(withUserAutentication(Notifications));
