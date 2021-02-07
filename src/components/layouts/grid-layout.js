import React from "react";

import "./grid-layout.scss";
import Header from "../header";
import Footer from "../footer";

export default function Layout({ children, headerProps, footerProps }) {
  return (
    <div className="grid-layout">
      <Header {...headerProps} className="grid-layout__top" />
      {children}
      <Footer {...footerProps} className="grid-layout__bottom" />
    </div>
  );
}
