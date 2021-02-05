import React from "react";

import "./footer.scss";

function Footer(props) {
  let { className, ...rest } = props;
  if (className) className += " footer";
  else className = "footer";

  return (
    <footer className={className} {...rest}>
      <div className="footer__content">
        <p className="footer__text">all copyright &copy; goes to mca gang.</p>
      </div>
    </footer>
  );
}
export default React.memo(Footer);
