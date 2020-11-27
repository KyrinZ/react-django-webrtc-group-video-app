import React, { Component } from "react";

// Material UI components
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";

// Components
import Event from "./Event";
import { CreateEventForm } from "./EventForm";
import { axiosInstance } from "../authentication";

const styles = {
  loading: {
    textAlign: "center",
  },
};

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventData: [],
      loadingEvents: true,
      openEventForm: false,
    };

    this.deleteEvent = this.deleteEvent.bind(this);
    this.eventFormClose = this.eventFormClose.bind(this);
    this.eventFormOpen = this.eventFormOpen.bind(this);
    this.onEventFormSubmit = this.onEventFormSubmit.bind(this);
  }

  onEventFormSubmit(data, { resetForm }) {
    if (!data.isScheduled) {
      data.schedules = [];
    }

    const jsonData = {
      title: data.title,
      description: data.description,
      typeOf: data.typeOf,
      isScheduled: data.isScheduled,
      eventSchedule: data.schedules,
    };

    axiosInstance
      .post("events/", jsonData)
      .then(() => {
        resetForm();

        this.setState({
          openEventForm: false,
          loadingEvents: true,
        });

        axiosInstance
          .get("events/")
          .then((res) => {
            this.setState(() => ({
              eventData: res.data,
              loadingEvents: false,
            }));
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }

  deleteEvent(eventID) {
    axiosInstance
      .delete("events/" + eventID)
      .then((res) => {
        this.setState({
          loadingEvents: true,
        });
        axiosInstance
          .get("events/")
          .then((res) => {
            this.setState(() => ({
              eventData: res.data,
              loadingEvents: false,
            }));
          })
          .catch((error) => console.log(error));
      })
      .catch((err) => console.log(err.message));
  }

  eventFormClose() {
    this.setState({
      openEventForm: false,
    });
  }
  eventFormOpen() {
    this.setState({
      openEventForm: true,
    });
  }

  componentDidMount() {
    axiosInstance
      .get("events/")
      .then((res) => {
        this.setState(() => ({ eventData: res.data, loadingEvents: false }));
      })
      .catch((error) => {
        this.setState(() => ({ loadingEvents: false }));
        console.log(error.message);
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <Typography align="center" variant="h2">
          Event Lobby
        </Typography>
        <Button variant="contained" onClick={this.eventFormOpen}>
          Create new event
        </Button>

        <Modal open={this.state.openEventForm} onClose={this.eventFormClose}>
          <CreateEventForm onEventFormSubmit={this.onEventFormSubmit} />
        </Modal>

        <div>
          {this.state.loadingEvents ? (
            <Container className={classes.loading}>
              <CircularProgress />
            </Container>
          ) : (
            this.state.eventData.map((data) => {
              return (
                <React.Fragment key={data.id}>
                  <Event deleteEvent={this.deleteEvent} apiData={data} />
                </React.Fragment>
              );
            })
          )}
        </div>
      </>
    );
  }
}
export default withStyles(styles)(EventList);
