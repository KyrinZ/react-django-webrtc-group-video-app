import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import jwt_decode from "jwt-decode";

// Components
import { Nav, RoomList, VideoRoom, Login, Register } from "./components";
import axiosInstance, { validateToken } from "./components/utilities/axios";

export class Routes extends Component {
  constructor(props) {
    super(props);
    this.AVAILABLE_PATHS = {
      LOBBY_PATH: "/",
      LOGIN_PATH: "/login",
      REGISTER_PATH: "/register",
      USER_PROFILE_PATH: "/user-profile",
      VIDEO_ROOM_PATH: "/video/room",
    };

    this.ALL_PATH_TITLES = {
      LOBBY_TITLE: "Lobby",
      LOGIN_TITLE: "Login",
      REGISTER_TITLE: "Register",
      USER_PROFILE_TITLE: "User Profile",
      LOGOUT_TITLE: "Logout",
    };

    this.state = {
      userData: {
        userId: null,
        userType: "Anonymous",
        isUserLoggedIn: false,
      },
      pageTitle: this.changePageTitle(),
    };

    this.navigationBar = this.navigationBar.bind(this);
    this.lobbyPage = this.lobbyPage.bind(this);
    this.loginPage = this.loginPage.bind(this);
    this.registerPage = this.registerPage.bind(this);
  }

  changePageTitle = () => {
    const currentUrlPath = window.location.pathname;
    const {
      LOBBY_PATH,
      LOGIN_PATH,
      REGISTER_PATH,
      USER_PROFILE_PATH,
    } = this.AVAILABLE_PATHS;

    const {
      LOBBY_TITLE,
      LOGIN_TITLE,
      REGISTER_TITLE,
      USER_PROFILE_TITLE,
    } = this.ALL_PATH_TITLES;

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
      case USER_PROFILE_PATH:
        pageTitle = USER_PROFILE_TITLE;
        break;
      default:
        pageTitle = "404";
        break;
    }
    this.setState({
      pageTitle: pageTitle,
    });
    return pageTitle;
  };

  navigationBar = (props) => {
    const {
      userData: { isUserLoggedIn },
      pageTitle,
    } = this.state;
    const {
      LOBBY_TITLE,
      LOGIN_TITLE,
      REGISTER_TITLE,
      USER_PROFILE_TITLE,
      LOGOUT_TITLE,
    } = this.ALL_PATH_TITLES;
    let menuItems;
    if (isUserLoggedIn) {
      menuItems = [LOBBY_TITLE, USER_PROFILE_TITLE, LOGOUT_TITLE];
    } else {
      menuItems = [LOBBY_TITLE, LOGIN_TITLE, REGISTER_TITLE];
    }
    return (
      <Nav
        key={window.location.pathname}
        availablePaths={this.AVAILABLE_PATHS}
        availablePathTitles={this.ALL_PATH_TITLES}
        changePageTitle={this.changePageTitle}
        pageTitle={pageTitle}
        menuItems={menuItems}
        isUserLoggedIn={isUserLoggedIn}
        authenticateUser={this.authenticateUser}
        {...props}
      />
    );
  };

  lobbyPage = (props) => {
    const { isUserLoggedIn } = this.state.userData;
    return <RoomList isUserLoggedIn={isUserLoggedIn} {...props} />;
  };

  loginPage = (props) => {
    const { isUserLoggedIn } = this.state.userData;
    return isUserLoggedIn ? (
      <Redirect to={this.AVAILABLE_PATHS.LOBBY_PATH} exact />
    ) : (
      <Login
        authenticateUser={this.authenticateUser}
        redirectPath={this.AVAILABLE_PATHS.LOBBY_PATH}
        {...props}
      />
    );
  };

  registerPage = (props) => {
    const { isUserLoggedIn } = this.state.userData;
    return isUserLoggedIn ? (
      <Redirect to={this.AVAILABLE_PATHS.LOBBY_PATH} exact />
    ) : (
      <Register
        authenticateUser={this.authenticateUser}
        redirectPath={this.AVAILABLE_PATHS.LOBBY_PATH}
        {...props}
      />
    );
  };

  authenticateUser = () => {
    const refresh_token = localStorage.getItem("refresh_token");
    validateToken(axiosInstance, refresh_token)
      .then((response) => {
        if (response.status === 200) {
          const userId = jwt_decode(refresh_token).user_id;
          this.setState({
            userData: {
              userId: userId,
              userType: "Registered",
              isUserLoggedIn: true,
            },
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.setState({
          userData: {
            userId: null,
            userType: "Anonymous",
            isUserLoggedIn: false,
          },
        });
      });
  };

  componentDidMount = () => {
    this.authenticateUser();
  };
  render() {
    const {
      LOBBY_PATH,
      LOGIN_PATH,
      REGISTER_PATH,
      VIDEO_ROOM_PATH,
    } = this.AVAILABLE_PATHS;

    return (
      <>
        <Router>
          <Route render={this.navigationBar} />
          <Switch>
            <Route exact path={LOBBY_PATH} render={this.lobbyPage} />
            <Route exact path={LOGIN_PATH} render={this.loginPage} />
            <Route exact path={REGISTER_PATH} render={this.registerPage} />
            <Route exact path={VIDEO_ROOM_PATH} component={VideoRoom} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default Routes;
