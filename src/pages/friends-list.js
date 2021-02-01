import React from "react";
import { useHistory } from "react-router-dom";

import Layout from "../components/layout";
import { useUserAuth } from "../lib/hooks";

export default function FriendsList() {
  const { isUser, toRedirectPath } = useUserAuth();
  const history = useHistory();
  if (!isUser) {
    history.replace(toRedirectPath);
    return null;
  }
  return (
    <Layout>
      <h1>Friends List</h1>
    </Layout>
  );
}
