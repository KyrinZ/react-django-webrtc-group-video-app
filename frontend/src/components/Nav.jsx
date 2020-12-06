import React, { Component } from "react";

// Material UI components
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
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

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  pageTitle: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },

  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
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
    const { classes, menuItems, pageTitle, openRoomForm } = this.props;
    const { anchorEl } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.pageTitle} variant="h6">
              {pageTitle}
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
            <div className={classes.root} />
            <IconButton onClick={openRoomForm} color="inherit">
              <AddCircleOutlineIcon />
            </IconButton>
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
