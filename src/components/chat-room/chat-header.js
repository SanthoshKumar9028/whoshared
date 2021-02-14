import React from "react";

export function ChatHeader(props) {
  const { handleDatePicker, toggleOnlineFriends, headerTitle, ...rest } = props;
  return (
    <div {...rest}>
      <p>{headerTitle || "header"}</p>
      <div className="toggle-btn">
        <button onClick={toggleOnlineFriends}>&#9741;</button>
      </div>
      <div className="date-container">
        <input type="date" onChange={handleDatePicker} />
        <span className="date-container__logo">💬</span>
      </div>
    </div>
  );
}

export const ChatHeaderMemo = React.memo(ChatHeader);
