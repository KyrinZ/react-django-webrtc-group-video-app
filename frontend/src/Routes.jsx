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
import axiosInstance, {
  validateToken,
  refreshingAccessToken,
} from "./components/utilities/axios";
import { AVAILABLE_PATHS, ALL_PATH_TITLES } from "./CONSTANTS";
import AuthenticationRoute from "./AuthenticationRoute";

export class Routes extends Component {
  constructor(props) {
    super(props);
    this.AVAILABLE_PATHS = {
      LOBBY_PATH: "/",
      LOGIN_PATH: "/login",
      REGISTER_PATH: "/register",
      USER_PROFILE_PATH: "/user-profile",
      VIDEO_ROOM_PATH: "/video/:roomId",
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
        isUserLoggedIn: false,
      },
      pageTitle: this.changePageTitle(),
      isRoomFormOpen: false,
      feedbackMsg: "",
    };

    this.navigationBar = this.navigationBar.bind(this);
    this.lobbyPage = this.lobbyPage.bind(this);
    this.closeRoomForm = this.closeRoomForm.bind(this);
    this.openRoomForm = this.openRoomForm.bind(this);
    this.printFeedback = this.printFeedback.bind(this);
    this.videoRoomPage = this.videoRoomPage.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
  }

  closeRoomForm() {
    this.setState({
      isRoomFormOpen: false,
    });
  }
  openRoomForm() {
    this.setState({
      isRoomFormOpen: true,
    });
  }

  changePageTitle = () => {
    const currentUrlPath = window.location.pathname;
    const {
      LOBBY_PATH,
      LOGIN_PATH,
      REGISTER_PATH,
      USER_PROFILE_PATH,
    } = AVAILABLE_PATHS;

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

  printFeedback = ({ type, feedbackMsg }) => {
    switch (type) {
      case "success":
        this.setState({
          feedbackMsg: feedbackMsg,
        });
        break;
      case "error":
        this.setState({
          feedbackMsg: feedbackMsg,
        });
        break;
      default:
        break;
    }
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
        openRoomForm={this.openRoomForm}
        {...props}
      />
    );
  };

  lobbyPage = (props) => {
    const { userData, isRoomFormOpen } = this.state;
    const { isUserLoggedIn } = userData;
    return (
      <RoomList
        printFeedback={this.printFeedback}
        closeRoomForm={this.closeRoomForm}
        isRoomFormOpen={isRoomFormOpen}
        isUserLoggedIn={isUserLoggedIn}
        {...props}
      />
    );
  };

  videoRoomPage = (props) => {
    const { userData } = this.state;
    const { isUserLoggedIn } = userData;
    return !isUserLoggedIn ? (
      <Redirect to={this.AVAILABLE_PATHS.LOGIN_PATH} exact />
    ) : (
      <VideoRoom userData={userData} {...props} />
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
              isUserLoggedIn: true,
            },
          });
          refreshingAccessToken();
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.printFeedback({ type: "error", feedbackMsg: error.message });
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.setState({
          userData: {
            userId: null,
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
    } = AVAILABLE_PATHS;

    const authenticationProps = {
      isUserLoggedIn: this.state.userData.isUserLoggedIn,
      printFeedback: this.printFeedback,
      authenticateUser: this.authenticateUser,
    };

    return (
      <Router>
        <Route render={this.navigationBar} />
        <div>{this.state.feedbackMsg}</div>
        <Switch>
          <Route exact path={LOBBY_PATH} render={this.lobbyPage} />
          <AuthenticationRoute
            path={LOGIN_PATH}
            component={Login}
            authenticationProps={authenticationProps}
          />
          <AuthenticationRoute
            path={REGISTER_PATH}
            component={Register}
            authenticationProps={authenticationProps}
          />
          <Route exact path={REGISTER_PATH} render={this.registerPage} />
          <Route exact path={VIDEO_ROOM_PATH} render={this.videoRoomPage} />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
