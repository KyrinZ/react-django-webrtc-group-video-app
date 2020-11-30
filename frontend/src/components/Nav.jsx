import React, { Component } from "react";

//
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  username: {
    marginRight: theme.spacing(2),
  },
});

export class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      navTitle: this.determineNavTitle(),
    };
  }

  determineNavTitle = () => {
    const { location } = this.props;
    switch (location.pathname) {
      case "/":
        return "Lobby";
      case "/login":
        return "Login";
      case "/register":
        return "Register";

      case "My Account":
        return "My Account";
      default:
        return "404";
    }
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  gotoSection = (event) => {
    const { history } = this.props;
    const { menu } = event.currentTarget.dataset;
    if (menu && history) {
      switch (menu) {
        case "Lobby":
          history.push("/");
          break;
        case "Login":
          history.push("/login");
          break;
        case "Register":
          history.push("/register");
          break;
        case "My Account":
          history.push("/my-account");
          break;
        case "Logout":
          history.push("/");
          break;

        default:
          break;
      }
      this.setState({
        navTitle: menu,
      });
    }
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { classes, menuItems } = this.props;
    const { anchorEl, navTitle } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {navTitle}
            </Typography>
            <Typography className={classes.username} variant="subtitle1">
              Anonymous
            </Typography>
            <IconButton onClick={this.handleClick} edge="start" color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={this.gotoSection}
            >
              {menuItems.map((items, index) => (
                <MenuItem
                  key={index}
                  data-menu={items}
                  onClick={this.gotoSection}
                >
                  {items}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Nav);
