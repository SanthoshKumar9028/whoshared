import React from "react";

import GridLayout from "../components/layouts/grid-layout";
import withUserAutentication from "../components/withUserAuthentication";

export function GroupChat() {
  return (
    <GridLayout>
      <h1>GroupChat</h1>
    </GridLayout>
  );
}

export default withUserAutentication(GroupChat);
