import React from "react";

export const UserInfoContext = React.createContext({
  isDataArrived: false,
  userId: null,
  userFullName: "",
  isUserLoggedIn: false,
});

function UserInfoProvider(props) {
  return (
    <UserInfoContext.Provider value={props.userData}>
      {props.children}
    </UserInfoContext.Provider>
  );
}

export default UserInfoProvider;
