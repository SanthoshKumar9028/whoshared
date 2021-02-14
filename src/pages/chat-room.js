import React, { PureComponent, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import "./chat-room.scss";
import { GridLayoutWithoutFooter } from "../components/layouts/grid-layout";
import { userContext } from "../lib/contexts";
import withUserAutentication from "../components/withUserAuthentication";

import { ChatBoxMemo } from "../components/chat-room/chat-box";
import { ChatHeaderMemo } from "../components/chat-room/chat-header";
import { TypingUsers } from "../components/chat-room/typing-users";
import { ChatRoomInputs } from "../components/chat-room/inputs";

class ChatRoom extends PureComponent {
  constructor(props) {
    super(props);

    this.user = null;
    this.state = {
      userTypingStarted: {},
      userTypingStoped: {},
      currentMessagesDate: new Date().toLocaleDateString(),
      chatBoxLoading: false,
      typingUsersVisibility: false,
      messages: [],
      text: "",
    };

    // {
    //   username: "santhosh",
    //   sentDate: new Date(2020, 10, 2),
    //   body: "hi hello",
    // }

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
    const toFetchDate = new Date(e.target.value);
    if (toFetchDate === "Invalid Date") return;
    let dateStr = toFetchDate.toLocaleDateString();

    let [month, date, year] = dateStr.split("/");

    const url = `user/messages-on?date=${year}-${month}-${date}`;
    this.setState({
      chatBoxLoading: true,
    });
    fetch(url)
      .then((res) => res.json())
      .then((messages) => {
        this.setState({
          chatBoxLoading: false,
          messages,
          currentMessagesDate: toFetchDate.toLocaleDateString(),
        });
      })
      .catch((e) => console.log(e));
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
      // this.socket = new WebSocket("ws://localhost:8080/chat-room");
      this.socket = new WebSocket("wss://whoshared.herokuapp.com/chat-room");
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.messages.length !== this.state.messages.length) {
      //to move the focus to the last sent message
      let u = document.querySelector(".grid-layout--without-footer");
      u.scroll(0, window.innerHeight * 100);
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
              <ChatHeaderMemo
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
              <ChatBoxMemo
                chatBoxLoading={this.state.chatBoxLoading}
                messages={this.state.messages}
                className="chat-room__msgs"
              />
            </div>
            <div className="chat-room__inputs-container">
              {new Date().toLocaleDateString() ===
              this.state.currentMessagesDate ? (
                <ChatRoomInputs
                  className="chat-room__inputs"
                  textareaProps={{
                    value: this.state.text,
                    onChange: (e) => this.setState({ text: e.target.value }),
                    onFocus: this.typing,
                    onBlur: this.typing,
                  }}
                  buttonProps={{
                    disabled: !this.state.text,
                    onClick: () => this.sendMsg(),
                  }}
                />
              ) : null}
            </div>
          </div>
        </main>
      </GridLayoutWithoutFooter>
    );
  }
}
ChatRoom.contextType = userContext;

export default withUserAutentication(withRouter(ChatRoom));
