import React, { Component } from "react";

// Material UI components
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";

// Components
import Room from "./Room";
import CreateRoomForm from "./RoomForm/CreateRoomForm";
import axiosInstance from "../utilities/axios";

const styles = {
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
      title: data.title,
      description: data.description,
      typeOf: data.typeOf,
    };

    axiosInstance
      .post("events/", jsonData)
      .then(() => {
        resetForm();

        this.setState({
          openRoomForm: false,
          loadingRooms: true,
        });

        axiosInstance
          .get("events/")
          .then((res) => {
            this.setState(() => ({
              roomListData: res.data,
              loadingRooms: false,
            }));
          })
          .catch((error) => console.log(error.message));
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
        axiosInstance
          .get("events/")
          .then((res) => {
            this.setState(() => ({
              roomListData: res.data,
              loadingRooms: false,
            }));
          })
          .catch((error) => console.log(error.message));
      })
      .catch((error) => console.log(error.message));
  }

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

  componentDidMount() {
    axiosInstance
      .get("events/")
      .then((res) => {
        this.setState(() => ({ roomListData: res.data, loadingRooms: false }));
      })
      .catch((error) => {
        this.setState(() => ({ loadingRooms: false }));
        console.log(error.message);
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <Typography align="center" variant="h2">
          Room Lobby
        </Typography>
        <Button variant="contained" onClick={this.roomFormOpen}>
          Create new room
        </Button>

        <Modal open={this.state.openRoomForm} onClose={this.roomFormClose}>
          <CreateRoomForm onRoomFormSubmit={this.onRoomFormSubmit} />
        </Modal>

        <div>
          {this.state.loadingRooms ? (
            <Container className={classes.loading}>
              <CircularProgress />
            </Container>
          ) : (
            this.state.roomListData.map((data) => {
              return (
                <React.Fragment key={data.id}>
                  <Room deleteRoom={this.deleteRoom} apiData={data} />
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
