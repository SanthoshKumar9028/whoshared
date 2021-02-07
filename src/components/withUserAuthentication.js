import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useUserAuth } from "../lib/hooks";

export default function withUserAutentication(Component) {
  return function () {
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const { user, isUser, toRedirectPath } = useUserAuth();
    useEffect(() => {
      setLoading(true);
      if (isUser === false) {
        history.push(toRedirectPath);
      } else {
        setLoading(false);
      }
    }, [user, isUser, toRedirectPath, history]);
    if (loading) return null;
    return <Component />;
  };
}
