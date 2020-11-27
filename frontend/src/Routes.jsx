import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import jwt_decode from "jwt-decode";

// Components
import { Nav, EventList, Login, Register } from "./components";
import EventRoom from "./components/video/EventRoom";

import { axiosInstance } from "./components";

export class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInStatus: false,
    };

    this.checkLogStatus = this.checkLogStatus.bind(this);
    this.navigationBar = this.navigationBar.bind(this);
    this.loginPage = this.loginPage.bind(this);
    this.registerPage = this.registerPage.bind(this);
  }

  // Later I have to use JWT verification here
  checkLogStatus = () => {
    axiosInstance
      .post("token/refresh/", {
        refresh: localStorage.getItem("refresh_token"),
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            loggedInStatus: true,
          });
          console.log("User logged in");
        }
      })
      .catch((error) => {
        this.setState({
          loggedInStatus: false,
        });
        console.log(error.message);
        console.log("User not logged in");
      });
  };

  navigationBar = (props) => {
    return (
      <Nav
        {...props}
        checkLogStatus={this.checkLogStatus}
        loggedInStatus={this.state.loggedInStatus}
      />
    );
  };
  loginPage = () => {
    return this.state.loggedInStatus ? (
      <Redirect to="/" exact />
    ) : (
      <Login checkLogStatus={this.checkLogStatus} />
    );
  };

  registerPage = () => {
    return this.state.loggedInStatus ? (
      <Redirect to="/" exact />
    ) : (
      <Register checkLogStatus={this.checkLogStatus} />
    );
  };

  componentDidMount = () => {
    this.checkLogStatus();
  };

  render() {
    return (
      <>
        <Router>
          <Route render={this.navigationBar} />
          <Switch>
            <Route exact path="/" component={EventList} />
            <Route exact path="/login" render={this.loginPage} />
            <Route exact path="/register" render={this.registerPage} />
            <Route exact path="/event/room" component={EventRoom} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default Routes;
