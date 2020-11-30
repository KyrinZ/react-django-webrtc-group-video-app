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
    };
  }

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  gotoSection = (event) => {
    const {
      history,
      availablePaths,
      availablePathTitles,
      authenticateUser,
    } = this.props;
    const { menu } = event.currentTarget.dataset;
    const {
      LOBBY_PATH,
      LOGIN_PATH,
      REGISTER_PATH,
      USER_PROFILE_PATH,
    } = availablePaths;
    const {
      LOBBY_TITLE,
      LOGIN_TITLE,
      REGISTER_TITLE,
      USER_PROFILE_TITLE,
      LOGOUT_TITLE,
    } = availablePathTitles;
    if (menu && history) {
      switch (menu) {
        case LOBBY_TITLE:
          history.push(LOBBY_PATH);
          break;
        case LOGIN_TITLE:
          history.push(LOGIN_PATH);
          break;
        case REGISTER_TITLE:
          history.push(REGISTER_PATH);
          break;
        case USER_PROFILE_TITLE:
          history.push(USER_PROFILE_PATH);
          break;
        case LOGOUT_TITLE:
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          authenticateUser();
          history.push(LOBBY_PATH);
          break;
        default:
          break;
      }
    }
    this.setState({
      anchorEl: null,
    });
  };
  componentDidMount = () => {
    this.props.changePageTitle();
  };

  render() {
    const { classes, menuItems, pageTitle } = this.props;
    const { anchorEl } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {pageTitle}
            </Typography>
            <Typography className={classes.username} variant="subtitle1">
              Anonymous
            </Typography>
            <IconButton onClick={this.handleClick} edge="start" color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
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
