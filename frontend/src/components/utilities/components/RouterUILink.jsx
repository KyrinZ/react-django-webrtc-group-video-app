import React from "react";
import { Link as RouterLink } from "react-router-dom";

// Material UI components
import Link from "@material-ui/core/Link";

// Router link component is modified with material ui
function RouterUILink(props) {
  const { innerText, linkTo } = props;
  return (
    <Link component={RouterLink} to={linkTo}>
      {innerText}
    </Link>
  );
}

export default RouterUILink;
