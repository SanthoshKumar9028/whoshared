import React, { PureComponent, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import "./chat-room.scss";
import { GridLayoutWithoutFooter } from "../components/layouts/grid-layout";
import { userContext } from "../lib/contexts";
import { useUserAuth } from "../lib/hooks";
import withUserAutentication from "../components/withUserAuthentication";

function getRemainingHeight() {
  const headerHeight = document.querySelector(".header").offsetHeight;
  const chatRoomHeaderHeight = document.querySelector(".chat-room__header")
    .offsetHeight;
  const chatRoomInputsHeight = document.querySelector("div.chat-room__inputs")
    .offsetHeight;
  const height = window.innerHeight - (headerHeight + chatRoomHeaderHeight);
  if (window.innerWidth >= 1100) return height + "px";
  return height - chatRoomInputsHeight + "px";
}

function ChatBox(props) {
  const [height, setHeight] = useState({ height: "100%" });
  const { isUser, user } = useUserAuth();
  const { msgs, className = "", chatBoxLoading, ...rest } = props;
  let loadingclassName = className + " ring-loader";
  useEffect(() => {
    setHeight({ height: getRemainingHeight() });
  }, []);

  if (isUser === false) return null;
  if (chatBoxLoading)
    return (
      <section className={loadingclassName} {...rest} style={height}></section>
    );
  // console.log(msgs);
  return (
    <section className={className} {...rest} style={height}>
      {msgs.length > 0 ? (
        <ul>
          {msgs.map((msg) => (
            <li
              key={msg._id}
              className={msg.username === user.username ? "me" : "others"}
            >
              <div>
                <em>
                  <strong>
                    {msg.username === user.username ? "You" : msg.username}
                  </strong>
                </em>
                <time dateTime={new Date(msg.sentDate).toLocaleTimeString()}>
                  {new Date(msg.sentDate).toLocaleTimeString()}
                </time>
              </div>
              <p>{msg.body}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function ChatHeader(props) {
  const { handleDatePicker, toggleOnlineFriends, headerTitle, ...rest } = props;
  return (
    <div {...rest}>
      <p>{headerTitle || "header"}</p>
      <div className="toggle-btn">
        <button onClick={toggleOnlineFriends}>&#9741;</button>
      </div>
      <div className="date-container">
        <input type="date" onChange={handleDatePicker} />
      </div>
    </div>
  );
}

function TypingUsers(props) {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(true);
  const [users, setUsers] = useState([]);
  const { user: currentUser = {} } = useUserAuth();
  const {
    className = "",
    userTypingStarted,
    userTypingStoped,
    ...rest
  } = props;

  useEffect(() => {
    const controller = new AbortController();

    async function getUserStates() {
      try {
        const res = await fetch("/user/user-states", {
          signal: controller.signal,
        });
        if (res.ok) {
          const u = await res.json();
          // console.log(u);
          setUsers(u);
        }
        setLoading(false);
        setHasError(false);
      } catch (e) {
        console.log(e);
        if (e.name !== "AbortError") {
          setHasError(true);
          setLoading(false);
        }
      }
    }
    getUserStates();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    // changing the user typing state based on the props
    let newUserState = users.map((user) => {
      if (user.username === userTypingStarted.username)
        return {
          ...user,
          isTyping: true,
        };
      return user;
    });
    setUsers(newUserState);
  }, [userTypingStarted]);

  useEffect(() => {
    // changing the user typing state based on the props
    let newUserState = users.map((user) => {
      if (user.username === userTypingStoped.username)
        return {
          ...user,
          isTyping: false,
        };
      return user;
    });

    setUsers(newUserState);
  }, [userTypingStoped]);

  if (loading)
    return (
      <div className={className}>
        <h2>Loading...</h2>
      </div>
    );

  if (hasError)
    return (
      <div className={className}>
        <h2>Something went wrong.</h2>
      </div>
    );

  return (
    <div className={className} {...rest}>
      <h2>Friends</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) =>
            user.username === currentUser.username ? null : (
              <li
                key={user.username}
                className={`chat-room__user-item ${
                  user.isTyping ? "chat-room__user-item--typing" : ""
                } ${
                  user.logedin
                    ? "chat-room__user-item--online"
                    : "chat-room__user-item--offline"
                }`}
              >
                <span>o</span>
                {user.username}
              </li>
            )
          )}
        </ul>
      ) : null}
    </div>
  );
}

class ChatRoom extends PureComponent {
  constructor(props) {
    super(props);

    this.user = null;
    this.state = {
      userTypingStarted: {},
      userTypingStoped: {},
      currentMessagesDate: new Date().toLocaleDateString(),
      chatBoxLoading: true,
      typingUsersVisibility: false,
      messages: [],
      text: "",
    };

    // {
    //   username: "santhosh",
    //   sentDate: new Date(2020, 10, 2),
    //   body: "hi hello",
    // },
    // {
    //   username: "batman",
    //   sentDate: new Date(2020, 11, 11),
    //   body: "he hello no bady is there",
    // },
    // {
    //   username: "santhosh",
    //   sentDate: new Date(2020, 12, 12),
    //   body: "alksjf alskjf ",
    // },
    // {
    //   username: "santhosh",
    //   sentDate: new Date(2000, 12, 12),
    //   body: "alksjf alskjf ",
    // },
    // {
    //   username: "santhosh",
    //   sentDate: new Date(2000, 12, 10),
    //   body: "alksjf alskjf ",
    // },
    // {
    //   username: "santhosh",
    //   sentDate: new Date(2000, 11, 10),
    //   body: "alksjf alskjf ",
    // },
    // {
    //   username: "santhosh",
    //   sentDate: new Date(2000, 2, 10),
    //   body: "alksjf alskjf ",
    // },

    this.wsSupported = true;
    if (typeof WebSocket === "undefined") this.wsSupported = false;

    //binding handlers
    this.typing = this.typing.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.messageHandler = this.messageHandler.bind(this);
    this.toggleOnlineFriends = this.toggleOnlineFriends.bind(this);
    this.handleDatePicker = this.handleDatePicker.bind(this);
  }

  messageHandler(e) {
    let msg = JSON.parse(e.data);

    // console.log(msg);

    if (msg.type === "message") {
      // console.log(msg);
      // return;
      this.setState(({ messages }) => ({
        messages: [...messages, msg.data],
      }));
      return;
    }
    if (msg.username === this.user) return;

    if (msg.type === "typingstart") {
      this.setState({ userTypingStarted: msg });
    } else if (msg.type === "typingstop") {
      this.setState({ userTypingStoped: msg });
    }
  }

  typing(e) {
    let type = "typingstart";
    if (e.type === "blur") type = "typingstop";

    if (this.wsSupported && this.socket.readyState === WebSocket.OPEN)
      this.socket.send(JSON.stringify({ type, username: this.user }));
  }

  sendMsg() {
    if (this.wsSupported && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "message",
          data: { username: this.user, body: this.state.text },
        })
      );
      this.setState({ text: "" });
    }
  }
  handleDatePicker(e) {
    const url = "user/messages-on?date=" + e.target.value;

    fetch(url)
      .then((res) => res.json())
      .then((messages) =>
        this.setState({
          messages,
          currentMessagesDate: new Date(e.target.value).toLocaleDateString(),
        })
      )
      .catch((e) => console.log(e));
    // console.log(new Date(e.target.value));
  }
  toggleOnlineFriends() {
    this.setState(({ typingUsersVisibility }) => ({
      typingUsersVisibility: !typingUsersVisibility,
    }));
  }

  componentDidMount() {
    //setting the username
    this.user = this.context.username;

    //setting the websocket
    if (this.wsSupported && this.context.isLogedIn) {
      this.socket = new WebSocket("ws://localhost:8080/chat-room");
      // this.socket = new WebSocket("wss://whoshared.herokuapp.com/chat-room");
      this.socket.onmessage = this.messageHandler;
    }

    //fetching the today messages
    fetch("/user/today-messages")
      .then((res) => res.json())
      .then((messages) =>
        this.setState({
          chatBoxLoading: false,
          messages,
        })
      )
      .catch(() =>
        this.setState({
          chatBoxLoading: false,
          messages: [],
        })
      );
  }

  componentWillUnmount() {
    if (
      this.socket &&
      (this.socket.readyState !== WebSocket.CLOSING ||
        this.socket.readyState !== WebSocket.CLOSED)
    ) {
      this.socket.close();
    }
  }

  render() {
    return (
      <GridLayoutWithoutFooter>
        <main className="chat-room">
          <TypingUsers
            className={`chat-room__typing-user ${
              this.state.typingUsersVisibility
                ? "chat-room__typing-user--show"
                : "chat-room__typing-user--hidde"
            }`}
            userTypingStarted={this.state.userTypingStarted}
            userTypingStoped={this.state.userTypingStoped}
          />
          <div className="chat-room__chat-box">
            <div className="chat-room__chat-header-box-container">
              <ChatHeader
                headerTitle={
                  new Date().toLocaleDateString() ===
                  this.state.currentMessagesDate
                    ? "Today"
                    : this.state.currentMessagesDate
                }
                className="chat-room__header"
                handleDatePicker={this.handleDatePicker}
                toggleOnlineFriends={this.toggleOnlineFriends}
              />
              <ChatBox
                chatBoxLoading={this.state.chatBoxLoading}
                msgs={this.state.messages}
                className="chat-room__msgs"
              />
            </div>

            {new Date().toLocaleDateString() ===
            this.state.currentMessagesDate ? (
              <div className="chat-room__inputs">
                <textarea
                  type="text"
                  value={this.state.text}
                  onChange={(e) => this.setState({ text: e.target.value })}
                  onFocus={this.typing}
                  onBlur={this.typing}
                  placeholder="message"
                />
                <button
                  disabled={!this.state.text}
                  onClick={() => {
                    setTimeout(() => this.sendMsg(), 10);
                  }}
                  title="send message"
                >
                  &#10148;
                </button>
              </div>
            ) : null}
          </div>
        </main>
      </GridLayoutWithoutFooter>
    );
  }
}
ChatRoom.contextType = userContext;

export default withUserAutentication(withRouter(ChatRoom));
