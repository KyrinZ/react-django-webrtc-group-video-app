import React, { Component } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";

// Components
import {
  Login,
  Register,
  AuthenticationRoute,
  LobbyRoute,
  NavigationBar,
  VideoRoomRoute,
} from "./components";

// Utility components, functions, constants, objects...
import {
  Feedback,
  UserInfoProvider,
  AVAILABLE_PATHS,
  axiosInstance,
  validateToken,
  refreshingAccessToken,
  getRoomsList,
  Loading,
} from "./components/utilities";

export class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {
        isDataArrived: false,
        userId: null,
        userFullName: "",
        isUserLoggedIn: false,
      },
      isRoomFormOpen: false,

      severity: "",
      feedbackMsg: "",
      isFeedbackOpen: false,

      roomListData: [],
      loadingRooms: true,
      search: "",
    };

    this.loadRooms = this.loadRooms.bind(this);
    this.handleSearchChanges = this.handleSearchChanges.bind(this);
    this.closeRoomForm = this.closeRoomForm.bind(this);
    this.openRoomForm = this.openRoomForm.bind(this);
    this.printFeedback = this.printFeedback.bind(this);
    this.closeFeedback = this.closeFeedback.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
  }

  loadRooms(search = "") {
    this.setState({
      loadingRooms: true,
    });
    getRoomsList(axiosInstance, search)
      .then((res) => {
        this.setState(() => ({ roomListData: res.data, loadingRooms: false }));
      })
      .catch((error) => {
        this.setState(() => ({ loadingRooms: false }));
        this.printFeedback({ type: "error", feedbackMsg: error.message });
        console.log(error.message);
      });
  }

  handleSearchChanges = async (event) => {
    await this.setState({
      search: event.target.value,
    });
    await this.loadRooms(this.state.search);
  };

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

  printFeedback = ({ type, feedbackMsg }) => {
    switch (type) {
      case "success":
        this.setState({
          severity: "success",
          feedbackMsg: feedbackMsg,
          isFeedbackOpen: true,
        });
        break;
      case "error":
        this.setState({
          severity: "error",
          feedbackMsg: feedbackMsg,
          isFeedbackOpen: true,
        });
        break;
      default:
        break;
    }
  };

  closeFeedback = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      isFeedbackOpen: false,
    });
  };

  authenticateUser = () => {
    const refresh_token = localStorage.getItem("refresh_token");
    validateToken(axiosInstance, refresh_token)
      .then((response) => {
        if (response.status === 200) {
          const userId = jwt_decode(refresh_token).user_id;
          const userFullName = jwt_decode(refresh_token).full_name;
          this.setState({
            userData: {
              isDataArrived: true,
              userId: userId,
              userFullName: userFullName,
              isUserLoggedIn: true,
            },
          });
          refreshingAccessToken();
        }
      })
      .catch((error) => {
        console.log(error.message);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.setState({
          userData: {
            isDataArrived: true,
            userId: null,
            userFullName: "",
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
    const {
      userData,
      isRoomFormOpen,
      roomListData,
      loadingRooms,
      search,
      severity,
      feedbackMsg,
      isFeedbackOpen,
    } = this.state;

    const authenticationProps = {
      isUserLoggedIn: userData.isUserLoggedIn,
      printFeedback: this.printFeedback,
      authenticateUser: this.authenticateUser,
    };
    const lobbyProps = {
      userData: userData,
      loadingRooms: loadingRooms,
      roomListData: roomListData,
      loadRooms: this.loadRooms,
      printFeedback: this.printFeedback,
      closeRoomForm: this.closeRoomForm,
      isRoomFormOpen: isRoomFormOpen,
    };
    const navProps = {
      search: search,
      handleSearchChanges: this.handleSearchChanges,
      authenticateUser: this.authenticateUser,
      openRoomForm: this.openRoomForm,
      printFeedback: this.printFeedback,
    };

    return userData.isDataArrived ? (
      <UserInfoProvider userData={userData}>
        <Router>
          <NavigationBar {...navProps} />
          <Feedback
            closeFeedback={this.closeFeedback}
            isFeedbackOpen={isFeedbackOpen}
            severity={severity}
            feedbackMsg={feedbackMsg}
          />
          <Switch>
            <LobbyRoute exact path={LOBBY_PATH} lobbyProps={lobbyProps} />
            <AuthenticationRoute
              exact
              path={LOGIN_PATH}
              component={Login}
              authenticationProps={authenticationProps}
            />
            <AuthenticationRoute
              exact
              path={REGISTER_PATH}
              component={Register}
              authenticationProps={authenticationProps}
            />
            <VideoRoomRoute
              exact
              path={VIDEO_ROOM_PATH}
              userData={userData}
              printFeedback={this.printFeedback}
            />
          </Switch>
        </Router>
      </UserInfoProvider>
    ) : (
      <Loading />
    );
  }
}

export default Routes;
