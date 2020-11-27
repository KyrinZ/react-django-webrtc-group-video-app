import React, { Component } from "react";

// Material UI components
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const styles = {
  nav: {
    marginBottom: "1rem",
  },
};
export class Nav extends Component {
  constructor(props) {
    super(props);
    this.urlValue = {
      0: "",
      1: "login",
      2: "register",
    };

    this.state = {
      navValue: this.checkUrlPath(),
    };
    this.logout = this.logout.bind(this);
  }
  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.props.checkLogStatus();
  };

  handleChange = (event, value) => {
    if (this.props.loggedInStatus && value === 1) {
      this.logout();
      return;
    }
    const { history } = this.props;
    history.push(`/${this.urlValue[value]}`);
    this.setState({ navValue: value });
  };

  checkUrlPath = () => {
    const { location } = this.props;
    const { pathname } = location;

    switch (pathname) {
      case "/":
        return 0;
      case "/login":
        return 1;
      case "/register":
        return 2;
      default:
        return 0;
    }
  };
  render() {
    const { navValue } = this.state;
    const { loggedInStatus, classes } = this.props;
    return (
      <>
        {loggedInStatus ? (
          <Tabs
            className={classes.nav}
            centered
            value={navValue}
            onChange={this.handleChange}
          >
            <Tab label="Lobby" />
            <Tab label="Logout" />
          </Tabs>
        ) : (
          <Tabs
            className={classes.nav}
            centered
            value={navValue}
            onChange={this.handleChange}
          >
            <Tab label="Lobby" />
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        )}
      </>
    );
  }
}

export default withStyles(styles)(Nav);
