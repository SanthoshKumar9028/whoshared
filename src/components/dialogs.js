import React, { useRef, useState } from "react";

import "./dialogs.scss";

function Reason({ name, value }) {
  return (
    <>
      <input type="checkbox" id={name} name={name} value={value} />
      <label htmlFor={name}>{value}</label>
    </>
  );
}

export function ReportDialog(props) {
  let [loading, setLoading] = useState(false);
  let [dialogStatus, setDialogStatus] = useState("");
  let [errors, setErrors] = useState({});
  let formRef = useRef();

  let {
    className = "",
    visible,
    reportUsername,
    username,
    close = () => {},
    ...rest
  } = props;
  className += " report-dialog";

  if (visible === false) return null;

  const sendReasons = async function (e) {
    e.preventDefault();
    setLoading(true);
    let reasons = [
      formRef.current.reason1,
      formRef.current.reason2,
      formRef.current.reason3,
      formRef.current.reason4,
    ];
    reasons = reasons.filter((r) => r.checked);
    if (reasons.length === 0) {
      setLoading(false);
      return setErrors({ message: "please select atleast one reason to send" });
    }
    reasons = reasons.map((r) => r.value);
    let res = await fetch("/user/report-user", {
      method: "POST",
      body: JSON.stringify({ reasons, reportUsername }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    res = await res.json();
    if (res.ok) {
      setDialogStatus("Report send succesfully");
    } else {
      setDialogStatus("Someting went wrong try again later");
    }
    setErrors({});
    setTimeout(() => setDialogStatus(""), 1500);
    setLoading(false);
  };

  return (
    <div className="dialog-container">
      <h2 className="dialog-container__status">{dialogStatus}</h2>
      <div className={className} {...rest}>
        <button className="report-dialog__close-btn" onClick={close}>
          X
        </button>
        <h2 className="report-dialog__title">Report Dialog</h2>
        <form
          className="report-dialog__form"
          onSubmit={sendReasons}
          ref={formRef}
        >
          <fieldset className="report-dialog__reasons">
            <legend className="report-dialog__reasons-title">
              Report {reportUsername} against.
            </legend>
            <Reason name="reason1" value="Sent unwanted message" />
            <br />
            <Reason name="reason2" value="Missusing the application" />
            <br />
            <Reason name="reason3" value="I dont know the reason" />
            <br />
            <Reason name="reason4" value="Other" />
          </fieldset>
          <p className="report-dialog__error">{errors.message}</p>
          <button
            className={
              loading
                ? "report-dialog__submit-btn ring-loader ring-loader--x-small"
                : "report-dialog__submit-btn"
            }
            disabled={loading}
          >
            submit
          </button>
        </form>
      </div>
    </div>
  );
}

const RemovePermentaly = React.memo(function ({ id, username }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    className: "",
    message: "",
  });

  const handle = async function () {
    const input = prompt(`Type "${username}" to remove permentaly.`);
    if (input !== username) {
      setStatus({
        className: "take-action-dialog__action-status--wrong",
        message: "Incurrect username",
      });
      return;
    }

    setLoading(true);
    const status = {
      className: "",
      message: "",
    };
    try {
      const res = await fetch(`/admin/remove-user/${id}`, { method: "DELETE" });
      if (res.ok) {
        status.className = "take-action-dialog__action-status--ok";
        status.message = "Status: User removed sucessfully";
      } else if (res.status === 400) {
        status.className = "take-action-dialog__action-status--wrong";
        status.message = "Status: User Not found";
      } else {
        throw new Error("server error");
      }
    } catch (e) {
      if (e.message === "server error") {
        status.className = "take-action-dialog__action-status--wrong";
        status.message = "Status: Someting went wrong";
      } else throw e;
    } finally {
      setStatus(status);
      setLoading(false);
    }
  };
  return (
    <details className="take-action-dialog__action">
      <summary className="take-action-dialog__action-title">
        Remove {username} Permentaly
      </summary>
      <button
        onClick={handle}
        className={`take-action-dialog__action-btn ${
          loading ? "ring-loader ring-loader--x-small" : ""
        }`}
      >
        Remove Permentaly
      </button>
      <p className={`take-action-dialog__action-status ${status.className}`}>
        {status.message}
      </p>
    </details>
  );
});

const BlockTemproverly = React.memo(function ({ id, username }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    className: "",
    message: "",
  });

  const handle = async function () {
    setLoading(true);
    const status = {
      className: "",
      message: "",
    };
    try {
      const res = await fetch("/admin/block-user-by", {
        method: "post",
        body: JSON.stringify({ type: "_id", value: id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        status.className = "take-action-dialog__action-status--ok";
        status.message = "Status: User blocked sucessfully";
      } else if (res.status === 400) {
        status.className = "take-action-dialog__action-status--wrong";
        status.message = "Status: User Not found";
      } else {
        throw new Error("server error");
      }
    } catch (e) {
      if (e.message === "server error") {
        status.className = "take-action-dialog__action-status--wrong";
        status.message = "Status: Someting went wrong";
      } else throw e;
    } finally {
      setStatus(status);
      setLoading(false);
    }
  };
  return (
    <details className="take-action-dialog__action">
      <summary className="take-action-dialog__action-title">
        Block {username} Temproverly
      </summary>
      <button
        onClick={handle}
        className={`take-action-dialog__action-btn ${
          loading ? "ring-loader ring-loader--x-small" : ""
        }`}
      >
        Block Temproverly
      </button>
      <p className={`take-action-dialog__action-status ${status.className}`}>
        {status.message}
      </p>
    </details>
  );
});

const SendNotification = React.memo(function ({ id, username }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({
    className: "",
    message: "",
  });

  const handle = async function () {
    setLoading(true);
    const status = {
      className: "",
      message: "",
    };
    try {
      const res = await fetch("/admin/send-notification", {
        method: "post",
        body: JSON.stringify({ type: "warning", userId: id, message }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        status.className = "take-action-dialog__action-status--ok";
        status.message = "Status: Message sent sucessfully";
      } else if (res.status === 400) {
        status.className = "take-action-dialog__action-status--wrong";
        status.message = "Status: User Not found";
      } else {
        throw new Error("server error");
      }
      setMessage("");
    } catch (e) {
      if (e.message === "server error") {
        status.className = "take-action-dialog__action-status--wrong";
        status.message = "Status: Someting went wrong";
      } else throw e;
    } finally {
      setStatus(status);
      setLoading(false);
    }
  };

  return (
    <details className="take-action-dialog__action">
      <summary className="take-action-dialog__action-title">
        Send Warning Notification To {username}
      </summary>
      <textarea
        value={message}
        rows="5"
        cols="30"
        placeholder="type..."
        onChange={(e) => setMessage(e.target.value)}
        className="take-action-dialog__action-textarea"
      />
      <button
        onClick={handle}
        disabled={!Boolean(message)}
        className={`take-action-dialog__action-btn ${
          loading ? "ring-loader ring-loader--x-small" : ""
        }`}
      >
        Send
      </button>
      <p className={`take-action-dialog__action-status ${status.className}`}>
        {status.message}
      </p>
    </details>
  );
});

export function TakeActionDialog(props) {
  let {
    className = "",
    visible,
    id,
    username,
    close = () => {},
    ...rest
  } = props;
  className += " take-action-dialog";

  if (visible === false) return null;

  return (
    <div className="dialog-container dialog-container--white">
      <div className={className} {...rest}>
        <div className="take-action-dialog__header">
          <h2 className="take-action-dialog__title">
            Take Action On {username}
          </h2>
          <button className="take-action-dialog__close-btn" onClick={close}>
            X
          </button>
        </div>
        <div className="take-action-dialog__inputs">
          <RemovePermentaly id={id} username={username} />
          <BlockTemproverly id={id} username={username} />
          <SendNotification id={id} username={username} />
        </div>
      </div>
    </div>
  );
}
