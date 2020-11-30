import React, { Component } from "react";

import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";

export class RouterUILink extends Component {
  render() {
    const { innerText, linkTo } = this.props;
    return (
      <Link component={RouterLink} to={linkTo}>
        {innerText}
      </Link>
    );
  }
}

export default RouterUILink;
