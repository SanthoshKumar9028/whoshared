import React from "react";

import Header from "./header";

export default function Layout({ children, headerProps = {} }) {
  return (
    <>
      <Header {...headerProps} />
      {children}
    </>
  );
}
