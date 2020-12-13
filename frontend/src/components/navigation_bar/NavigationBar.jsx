import React, { Component } from "react";
import { withRouter } from "react-router";

// Material UI components
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Tooltip from "@material-ui/core/Tooltip";

// Utility components, functions, constants, objects...
import {
  UserInfoContext,
  AVAILABLE_PATHS,
  ALL_PATH_TITLES,
} from "../utilities";
import navigationBarStyles from "./navigation_bar_styles";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      pageTitle: this.changePageTitle(),
      isComponentShown: false,
    };
  }

  // Title changes based on what url path user is on
  changePageTitle = () => {
    const currentUrlPath = window.location.pathname;
    const { LOBBY_PATH, LOGIN_PATH, REGISTER_PATH } = AVAILABLE_PATHS;

    const { LOBBY_TITLE, LOGIN_TITLE, REGISTER_TITLE } = ALL_PATH_TITLES;

    let pageTitle;

    switch (currentUrlPath) {
      case LOBBY_PATH:
        pageTitle = LOBBY_TITLE;
        break;
      case LOGIN_PATH:
        pageTitle = LOGIN_TITLE;
        break;
      case REGISTER_PATH:
        pageTitle = REGISTER_TITLE;
        break;
      default:
        pageTitle = "404";
        break;
    }

    if (currentUrlPath.match("/video/")) {
      pageTitle = "Room";
    }
    this.setState({
      pageTitle: pageTitle,
    });
    return pageTitle;
  };

  static contextType = UserInfoContext;

  // Method to open menu items
  handleMenuOpen = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  // Logic to handle for each of the items in menu
  gotoSection = (event) => {
    const { history, authenticateUser, printFeedback } = this.props;
    const { menu } = event.currentTarget.dataset;
    const { LOBBY_PATH, LOGIN_PATH, REGISTER_PATH } = AVAILABLE_PATHS;
    const {
      LOBBY_TITLE,
      LOGIN_TITLE,
      REGISTER_TITLE,
      LOGOUT_TITLE,
    } = ALL_PATH_TITLES;
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
        case LOGOUT_TITLE:
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          authenticateUser();
          printFeedback({
            type: "success",
            feedbackMsg: "Logged out successfully",
          });
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

  // Method to hide 'Search bar' and 'create room button' if url is not the default route
  showComponents = () => {
    this.changePageTitle();
    if (this.props.location.pathname !== "/") {
      this.setState({
        isComponentShown: false,
      });
    } else {
      this.setState({
        isComponentShown: true,
      });
    }
  };

  componentDidMount = () => {
    this.showComponents();
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.changePageTitle();
      this.showComponents();
    }
  }

  render() {
    const { classes, openRoomForm, search, handleSearchChanges } = this.props;
    const { anchorEl, pageTitle, isComponentShown } = this.state;
    const { userFullName, isUserLoggedIn } = this.context;
    const {
      LOBBY_TITLE,
      LOGIN_TITLE,
      REGISTER_TITLE,
      LOGOUT_TITLE,
    } = ALL_PATH_TITLES;

    // Menu items changes based on whether user is logged in or not
    const menuItems = isUserLoggedIn
      ? [LOBBY_TITLE, LOGOUT_TITLE]
      : [LOBBY_TITLE, LOGIN_TITLE, REGISTER_TITLE];
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <Typography className={classes.pageTitle} variant="h6">
              {pageTitle}
            </Typography>
            {isComponentShown ? (
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  value={search}
                  onChange={handleSearchChanges}
                  placeholder="Search room title…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                />
              </div>
            ) : null}

            <div className={classes.root} />
            {isComponentShown ? (
              <Tooltip title="Create Room">
                <IconButton onClick={openRoomForm} color="inherit">
                  <AddCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            <Typography className={classes.username} variant="subtitle1">
              {userFullName && userFullName !== "" ? userFullName : "Anonymous"}
            </Typography>
            <Tooltip title="Menu">
              <IconButton
                onClick={this.handleMenuOpen}
                edge="start"
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
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

export default withRouter(withStyles(navigationBarStyles)(NavigationBar));
