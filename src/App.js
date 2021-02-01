import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.scss";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import GroupChat from "./pages/group-chat";
import FriendsList from "./pages/friends-list";
import LoadingIndicator from "./components/loading-indicator";
import { userContext } from "./lib/contexts";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      const emptyUser = { isLogedIn: false };
      try {
        const data = await fetch("/auth/is-user").then((res) => res.json());
        // console.log(data);
        if (data.user) {
          data.user.isLogedIn = true;
          data.user.logout = async function () {
            try {
              await fetch("/auth/logout-user");
            } finally {
              setUser(emptyUser);
            }
          };
          setUser(data.user);
        } else setUser(emptyUser);
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
          <Route path="/group-chat">
            <GroupChat />
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
