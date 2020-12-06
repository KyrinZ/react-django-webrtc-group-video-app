import React, { Component } from "react";

// Material UI components
import Modal from "@material-ui/core/Modal";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";

// Components
import Room from "./Room";
import CreateRoomForm from "./RoomForm/CreateRoomForm";
import axiosInstance, { getRoomsList } from "../utilities/axios";

const styles = {
  roomList: {
    marginTop: "1rem",
  },
  loading: {
    textAlign: "center",
  },
};

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomListData: [],
      loadingRooms: true,
      openRoomForm: false,
    };

    this.deleteRoom = this.deleteRoom.bind(this);
    this.roomFormClose = this.roomFormClose.bind(this);
    this.roomFormOpen = this.roomFormOpen.bind(this);
    this.onRoomFormSubmit = this.onRoomFormSubmit.bind(this);
  }

  onRoomFormSubmit(data, { resetForm }) {
    const jsonData = {
      user: 2,
      title: data.title,
      description: data.description,
      typeOf: data.typeOf,
    };
    const { printFeedback } = this.props;
    axiosInstance
      .post("events/", jsonData)
      .then(() => {
        resetForm();

        this.setState({
          openRoomForm: false,
          loadingRooms: true,
        });
        printFeedback({ type: "success", feedbackMsg: "Room created" });
        this.loadRooms();
      })
      .catch((error) => console.log(error.message));
  }

  deleteRoom(roomId) {
    axiosInstance
      .delete("events/" + roomId)
      .then((res) => {
        this.setState({
          loadingRooms: true,
        });
        this.loadRooms();
      })
      .catch((error) => console.log(error.message));
  }

  enterRoom = (roomId) => {
    const { history } = this.props;
    history.push(`/video/${roomId}`);
  };

  roomFormClose() {
    this.setState({
      openRoomForm: false,
    });
  }
  roomFormOpen() {
    this.setState({
      openRoomForm: true,
    });
  }

  loadRooms() {
    const { printFeedback } = this.props;
    getRoomsList(axiosInstance)
      .then((res) => {
        this.setState(() => ({ roomListData: res.data, loadingRooms: false }));
      })
      .catch((error) => {
        this.setState(() => ({ loadingRooms: false }));
        printFeedback({ type: "error", feedbackMsg: error.message });
        console.log(error.message);
      });
  }

  componentDidMount() {
    this.loadRooms();
  }

  render() {
    const { classes, closeRoomForm, isRoomFormOpen } = this.props;
    return (
      <>
        <Modal open={isRoomFormOpen} onClose={closeRoomForm}>
          <CreateRoomForm onRoomFormSubmit={this.onRoomFormSubmit} />
        </Modal>

        <div className={classes.roomList}>
          {this.state.loadingRooms ? (
            <Container className={classes.loading}>
              <CircularProgress />
            </Container>
          ) : (
            this.state.roomListData.map((data) => {
              return (
                <React.Fragment key={data.id}>
                  <Room
                    deleteRoom={this.deleteRoom}
                    enterRoom={this.enterRoom}
                    apiData={data}
                  />
                </React.Fragment>
              );
            })
          )}
        </div>
      </>
    );
  }
}
export default withStyles(styles)(RoomList);
