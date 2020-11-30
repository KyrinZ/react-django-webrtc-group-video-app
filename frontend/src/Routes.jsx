import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// Components
import { Nav, RoomList, VideoRoom, Login, Register } from "./components";
import isUserAuthenticate from "./components/utilities/authenticate_user";

export class Routes extends Component {
  constructor(props) {
    super(props);

    this.navigationBar = this.navigationBar.bind(this);
    this.lobbyPage = this.lobbyPage.bind(this);
    this.loginPage = this.loginPage.bind(this);
    this.registerPage = this.registerPage.bind(this);

    this.state = {
      userData: isUserAuthenticate(),
    };
  }

  navigationBar = (props) => {
    const { isUserLoggedIn } = this.state;
    let menuItems;
    if (isUserLoggedIn) {
      menuItems = ["Lobby", "My Account", "Logout"];
    } else {
      menuItems = ["Lobby", "Login", "Register"];
    }
    return (
      <Nav menuItems={menuItems} isUserLoggedIn={isUserLoggedIn} {...props} />
    );
  };

  lobbyPage = (props) => {
    const { isUserLoggedIn } = this.state;
    return <RoomList isUserLoggedIn={isUserLoggedIn} {...props} />;
  };
  loginPage = () => {
    return this.state.isUserLoggedIn ? (
      <Redirect to="/" exact />
    ) : (
      <Login checkLogInStatus={this.checkLogInStatus} />
    );
  };

  registerPage = () => {
    return this.state.isUserLoggedIn ? (
      <Redirect to="/" exact />
    ) : (
      <Register checkLogInStatus={this.checkLogInStatus} />
    );
  };

  // componentDidMount = () => {
  //   this.checkLogInStatus();
  // };

  render() {
    return (
      <>
        <Router>
          <Route render={this.navigationBar} />
          <Switch>
            <Route exact path="/" render={this.lobbyPage} />
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
