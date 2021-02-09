import React from "react";

import "./grid-layout.scss";
import Header from "../header";
import Footer from "../footer";

export function GridLayoutWithouFooter({ children, headerProps, footerProps }) {
  return (
    <div className="grid-layout grid-layout--without-footer">
      <Header {...headerProps} className="grid-layout__top" />
      {children}
    </div>
  );
}
export default function GridLayout({ children, headerProps, footerProps }) {
  return (
    <div className="grid-layout">
      <Header {...headerProps} className="grid-layout__top" />
      {children}
      <Footer {...footerProps} className="grid-layout__bottom" />
    </div>
  );
}
