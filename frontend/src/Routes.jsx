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

import { axiosInstance } from "./components";

export class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInStatus: false,
      userId: null,
    };

    this.checkLogInStatus = this.checkLogInStatus.bind(this);
    this.navigationBar = this.navigationBar.bind(this);
    this.loginPage = this.loginPage.bind(this);
    this.registerPage = this.registerPage.bind(this);
  }

  checkLogInStatus = () => {
    const refreshToken = localStorage.getItem("refresh_token");
    axiosInstance
      .post("token/verify/", {
        token: refreshToken,
      })
      .then((response) => {
        if (response.status === 200) {
          const userId = jwt_decode(refreshToken).user_id;
          this.setState({
            loggedInStatus: true,
            userId: userId,
          });

          console.log("User is logged in now");
        }
      })
      .catch((error) => {
        this.setState({
          loggedInStatus: false,
          userId: null,
        });
        console.log(error.message);
        console.log("User is not logged in or register yet");
      });
  };

  navigationBar = (props) => {
    return (
      <Nav
        checkLogInStatus={this.checkLogInStatus}
        loggedInStatus={this.state.loggedInStatus}
        {...props}
      />
    );
  };

  loginPage = () => {
    return this.state.loggedInStatus ? (
      <Redirect to="/" exact />
    ) : (
      <Login checkLogInStatus={this.checkLogInStatus} />
    );
  };

  registerPage = () => {
    return this.state.loggedInStatus ? (
      <Redirect to="/" exact />
    ) : (
      <Register checkLogInStatus={this.checkLogInStatus} />
    );
  };

  componentDidMount = () => {
    this.checkLogInStatus();
  };

  render() {
    return (
      <>
        <Router>
          <Route render={this.navigationBar} />
          <Switch>
            <Route exact path="/" component={RoomList} />
            <Route exact path="/login" render={this.loginPage} />
            <Route exact path="/register" render={this.registerPage} />
            <Route exact path="/event/room" component={VideoRoom} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default Routes;
