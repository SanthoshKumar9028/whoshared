import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./home.scss";
import GridLayout from "../components/layouts/grid-layout";

export function Home() {
  const [headerProps] = useState({ guestmenu: true });
  return (
    <GridLayout headerProps={headerProps}>
      <main className="home">
        <div className="home__content">
          <div className="home__intro">
            <h1 className="home__intro-title">
              {"{"}WhoShared{"}"}
            </h1>
            <p className="home__intro-text">
              Plateform to share there thoughts..
            </p>
            <Link to="/login" className="home__intro-login-btn">
              log in
            </Link>
          </div>
        </div>
      </main>
    </GridLayout>
  );
}

export default Home;
