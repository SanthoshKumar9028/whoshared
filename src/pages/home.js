import React from "react";
import { useHistory } from "react-router-dom";

import "./home.scss";
import Layout from "../components/layout";
import { useUserAuth } from "../lib/hooks";

export default function Home() {
  const { isUser, toRedirectPath } = useUserAuth();
  const history = useHistory();
  if (!isUser) {
    history.replace(toRedirectPath);
    return null;
  }
  return (
    <Layout>
      <h1>Home</h1>
    </Layout>
  );
}
