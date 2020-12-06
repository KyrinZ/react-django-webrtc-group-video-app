import React, { Component } from "react";
import jwt_decode from "jwt-decode";

import axiosInstance, {
  validateToken,
  refreshingAccessToken,
} from "./components/utilities/axios";

const UserInfo = React.createContext({
  userId: null,
  isUserLoggedIn: false,
});

export class UserInfoProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {
        userId: null,
        isUserLoggedIn: false,
      },
    };
  }

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

  componentDidCatch = () => {
    this.authenticateUser();
  };

  render() {
    return <UserInfo.Provider>{this.props.children}</UserInfo.Provider>;
  }
}

export default UserInfoProvider;
