import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.scss";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import ChatRoom from "./pages/chat-room";
import FriendsList from "./pages/friends-list";
import LoadingIndicator from "./components/loading-indicator";
import { userContext } from "./lib/contexts";
import { assignUserProps } from "./lib/assignProps";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const validateUser = async () => {
      const emptyUser = { isLogedIn: false };
      try {
        // const data = await fetch("/user/user-info").then((res) => res.json());
        const data = await fetch("/auth/is-user").then((res) => res.json());
        // console.log(data);
        if (data.user) {
          //assiginig user props
          assignUserProps(data.user, setUser);
          setUser(data.user);
        } else {
          setUser(emptyUser);
        }
      } catch (e) {
        setUser(emptyUser);
      } finally {
        setLoading(false);
      }
    };
    validateUser();
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
    <Router>
      <userContext.Provider value={user}>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/chat-room">
            <ChatRoom />
          </Route>
          <Route path="/friends">
            <FriendsList />
          </Route>
          <Route path="/login">
            <Login setUser={setUser} />
          </Route>
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
      </userContext.Provider>
    </Router>
  );
}

export default App;
