import React, { useState } from "react";

import "./home.scss";
import Layout from "../components/layout";

export default function Home() {
  const [headerProps] = useState({ guestmenu: true });
  return (
    <Layout headerProps={headerProps}>
      <h1>Home</h1>
    </Layout>
  );
}
