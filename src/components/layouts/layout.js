import React from "react";

import Header from "../header";
import Footer from "../footer";

export default function Layout({ children, headerProps, footerProps }) {
  return (
    <>
      <Header {...headerProps} />
      {children}
      <Footer {...footerProps} />
    </>
  );
}
