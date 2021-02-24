import React from "react";

import { useUserAuth } from "../../lib/hooks";

const UserName = React.memo(function ({ children }) {
  return (
    <em>
      <strong>{children}</strong>
    </em>
  );
});

const ChatTime = React.memo(function ({ datetime }) {
  return <time>{new Date(datetime).toLocaleTimeString()}</time>;
});

export function ChatBox(props) {
  const { isUser, user } = useUserAuth();
  const { messages, className = "", chatBoxLoading, ...rest } = props;
  let loadingclassName = className + " ring-loader ring-loader--tp-bg";

  if (isUser === false) return null;

  if (chatBoxLoading)
    return <section className={loadingclassName} {...rest}></section>;
  // console.log(messages);

  if (messages.length === 0)
    return (
      <section className={className} {...rest}>
        <h2 style={{ textAlign: "center" }}>empty...</h2>
      </section>
    );

  return (
    <section className={className} {...rest}>
      {messages.length > 0 ? (
        <ul>
          {messages.map((message) => {
            return (
              <li
                key={message._id}
                className={message.username === user.username ? "me" : "others"}
              >
                <div>
                  <UserName>
                    {message.username === user.username
                      ? "You"
                      : message.username}
                  </UserName>
                  <ChatTime datetime={message.sentDate} />
                </div>
                <p>{message.body}</p>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

export const ChatBoxMemo = React.memo(ChatBox);
