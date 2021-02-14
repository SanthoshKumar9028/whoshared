import React, { useState, useEffect } from "react";

function getChatRoomWidth() {
  if (window.innerWidth >= 1100) return "350px";
  return document.querySelector(".chat-room__msgs").offsetWidth + "px";
}

export function ChatRoomInputs(props) {
  const [ownStyle, setOwnStyle] = useState({ width: "100%" });
  const { textareaProps, buttonProps, style, ...rest } = props;

  useEffect(() => {
    setOwnStyle({ width: getChatRoomWidth() });
  }, []);

  return (
    <div {...rest} style={{ ...ownStyle, ...style }}>
      <textarea {...textareaProps} type="text" placeholder="message" />
      <button {...buttonProps} title="send message">
        &#10148;
      </button>
    </div>
  );
}
