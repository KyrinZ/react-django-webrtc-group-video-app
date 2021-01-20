import React, { Component } from "react";

// Material UI components
import Modal from "@material-ui/core/Modal";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";

// Components
import Room from "./Room";
import CreateRoomForm from "./RoomForm/CreateRoomForm";

// Utility components, functions, constants, objects...
import {
  axiosInstance,
  Loading,
  refreshingAccessToken,
  UserInfoContext, RouterUILink
} from "../utilities/";

class RoomList extends Component {
  constructor(props) {
    super(props);

    this.deleteRoom = this.deleteRoom.bind(this);
    this.enterRoom = this.enterRoom.bind(this);
    this.onRoomFormSubmit = this.onRoomFormSubmit.bind(this);
  }
  // User information
  static contextType = UserInfoContext;

  // Creating Room form
  onRoomFormSubmit = async (data, { resetForm }) => {
    const roomData = {
      user: data.user,
      title: data.title,
      description: data.description,
      typeOf: data.typeOf,
    };
    const { printFeedback, closeRoomForm } = this.props;

    // First refreshes JWT access token stored in local storage if access token is invalid
    await refreshingAccessToken();

    // Then posts the data to backend with the valid access token in the header
    await axiosInstance
      .post("rooms/", roomData)
      .then(() => {
        // After successfully posting form these tasks are performed in order
        resetForm();
        closeRoomForm();
        printFeedback({ type: "success", feedbackMsg: "Room created" });
        this.props.loadRooms();
      })
      .catch((error) => {
        if (error.response) {
          const { status } = error.response;
          // Error is feedback is printed to user if user is not logged in
          if (status === 401 || status === 400) {
            closeRoomForm();
            printFeedback({
              type: "error",
              feedbackMsg: "You are not logged in.",
            });
          }
        }
        console.log(error.message);
      });
  };

  // Delete Room
  deleteRoom = (roomId) => {
    const { printFeedback } = this.props;
    axiosInstance
      .delete("rooms/" + roomId)
      .then((res) => {
        // After successfully deleting these tasks are performed in order
        this.props.loadRooms();
        printFeedback({ type: "success", feedbackMsg: "Room deleted" });
      })
      .catch((error) => console.log(error.message));
  };

  // Directs to the video room
  enterRoom = (roomId) => {
    const { history } = this.props;
    history.push(`/video/${roomId}`);
  };

  componentDidMount() {
    this.props.loadRooms();
  }

  render = () => {
    const {
      closeRoomForm,
      isRoomFormOpen,
      roomListData,
      loadingRooms,
      printFeedback,
    } = this.props;
    const { isUserLoggedIn, isDataArrived } = this.context;
    return (
      <>
      {/* Create Room Form */}
        <Modal disableAutoFocus open={isRoomFormOpen} onClose={closeRoomForm}>
          <CreateRoomForm onRoomFormSubmit={this.onRoomFormSubmit} />
        </Modal>

        {/* User not authentication alert */}
        {!isUserLoggedIn && isDataArrived ? (
          <div style={{ textAlign: "center", margin: "1rem 0" }}>
            <Typography> Please <RouterUILink linkTo="/login" innerText="Login" /> Or <RouterUILink linkTo="/register" innerText="Register" /> to create or enter room</Typography>
          </div>
        ) : null}


          {/* List of Rooms */}
        <div style={{ marginTop: "1rem" }}>
          {loadingRooms ? (
            <Loading />
          ) : roomListData.length > 0 ? (
            roomListData.map((data) => {
              return (
                <React.Fragment key={data.id}>
                  <Room
                    deleteRoom={this.deleteRoom}
                    enterRoom={this.enterRoom}
                    apiData={data}
                    printFeedback={printFeedback}
                  />
                </React.Fragment>
              );
            })
          ) : (
            <Alert severity="info">No Rooms Yet!!</Alert>
          )}
        </div>
      </>
    );
  };
}
export default RoomList;
