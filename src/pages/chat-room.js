import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";

import "./chat-room.scss";
import { GridLayoutWithouFooter } from "../components/layouts/grid-layout";
import { userContext } from "../lib/contexts";
import { useUserAuth } from "../lib/hooks";
import withUserAutentication from "../components/withUserAuthentication";

function ChatBox(props) {
  const { isUser, user } = useUserAuth();
  if (isUser === false) return null;
  const { msgs, ...rest } = props;
  return (
    <section {...rest}>
      {msgs.length > 0 ? (
        <ul>
          {msgs.map((msg) => (
            <li
              className={msg.user === user.username ? "me" : "others"}
              key={msg.data}
            >
              {msg.data}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function ChatHeader(props) {
  const { handleDatePicker, toggleOnlineFriends, ...rest } = props;
  return (
    <div {...rest}>
      <p>header</p>
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
  const { user: currentUser = {} } = useUserAuth();
  const { users, ...rest } = props;
  return (
    <div {...rest}>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li
              key={user}
              className="chat-room__user-item chat-room__user-item--online chat-room__user-item--offline"
            >
              <span>o</span> {currentUser.username === user ? "you" : user}
            </li>
          ))}
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
      typingUsers: ["santhosh", "batman"],
      typingUsersVisibility: true,
      messages: [],
      text: "",
    };

    // { type: "message", user: "santhosh", data: "hi hello" },
    // { type: "message", user: "name", data: "he hello no bady is there" },
    // { type: "message", user: "santhosh", data: "alksjf alskjf " },

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
      this.setState(({ messages }) => ({
        messages: [...messages, msg],
      }));
      return;
    }
    if (msg.user === this.user) return;

    if (msg.type === "typingstart") {
      this.setState(({ typingUsers }) => ({
        typingUsers: [...typingUsers, msg.user],
      }));
    } else if (msg.type === "typingstop") {
      this.setState(({ typingUsers }) => ({
        typingUsers: typingUsers.filter((user) => user !== msg.user),
      }));
    }
  }

  typing(e) {
    let type = "typingstart";
    if (e.type === "blur") type = "typingstop";

    if (this.wsSupported && this.socket.readyState === WebSocket.OPEN)
      this.socket.send(JSON.stringify({ type, user: this.user }));
  }

  sendMsg() {
    if (this.wsSupported && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "message",
          user: this.user,
          data: this.state.text,
        })
      );
      this.setState({ text: "" });
    }
  }
  handleUnregisterUser() {
    const { history } = this.props;
    if (history) history.replace("/register");
  }
  handleDatePicker(e) {
    console.log(e.target.value);
  }
  toggleOnlineFriends() {
    this.setState(({ typingUsersVisibility }) => ({
      typingUsersVisibility: !typingUsersVisibility,
    }));
  }

  componentDidMount() {
    this.user = this.context.name;
    if (this.wsSupported && this.context.isLogedIn) {
      this.socket = new WebSocket("ws://localhost:8080/chat-room");
      // this.socket = new WebSocket("ws://localhost:8080/chat-room");
      // this.socket = new WebSocket("wss://whoshared.herokuapp.com/chat-room");
      this.socket.onmessage = this.messageHandler;
    }
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
    if (!this.context.isLogedIn) {
      this.handleUnregisterUser();
      return <h1>Loading...</h1>;
    }

    return (
      <GridLayoutWithouFooter>
        <main className="chat-room container">
          <TypingUsers
            className={`chat-room__typing-user ${
              this.state.typingUsersVisibility
                ? "chat-room__typing-user--show"
                : "chat-room__typing-user--hidde"
            }`}
            users={this.state.typingUsers}
          />
          <div className="chat-room__chat-box">
            <div className="chat-room__chat-header-box-container">
              <ChatHeader
                className="chat-room__header"
                handleDatePicker={this.handleDatePicker}
                toggleOnlineFriends={this.toggleOnlineFriends}
              />
              <ChatBox msgs={this.state.messages} className="chat-room__msgs" />
            </div>
            <div className="chat-room__inputs">
              <textarea
                type="text"
                value={this.state.text}
                onChange={(e) => this.setState({ text: e.target.value })}
                onFocus={this.typing}
                onBlur={this.typing}
                placeholder="message"
              />
              <button onClick={this.sendMsg} title="send message">
                &#10148;
              </button>
            </div>
          </div>
        </main>
      </GridLayoutWithouFooter>
    );
  }
}
ChatRoom.contextType = userContext;

export default withUserAutentication(withRouter(ChatRoom));
