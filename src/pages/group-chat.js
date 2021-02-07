import React from "react";
import { useHistory } from "react-router-dom";

import GridLayout from "../components/layouts/grid-layout";
import { useUserAuth } from "../lib/hooks";

export default function GroupChat() {
  const { isUser, toRedirectPath } = useUserAuth();
  const history = useHistory();
  if (!isUser) {
    history.replace(toRedirectPath);
    return null;
  }
  return (
    <GridLayout>
      <h1>GroupChat</h1>
    </GridLayout>
  );
}
