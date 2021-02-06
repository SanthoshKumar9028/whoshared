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
    setTimeout(() => setDialogStatus(""), 1000);
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
