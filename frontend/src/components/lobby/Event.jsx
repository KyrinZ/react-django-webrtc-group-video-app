import React, { Component } from "react";

// Material UI components
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";

const styles = {
  eventHeading: {
    marginTop: "1rem",
    padding: "0.5rem",
  },
  eventDescription: {
    padding: "0.5rem",
  },
};

class Event extends Component {
  constructor(props) {
    super(props);
    this.renderEventType = this.renderEventType.bind(this);
  }

  renderEventType(eventTypeKeyWord) {
    if (eventTypeKeyWord === "OTA") {
      return "Open to All";
    } else if (eventTypeKeyWord === "IO") {
      return "Invite only";
    } else if (eventTypeKeyWord === "RO") {
      return "Register only";
    } else if (eventTypeKeyWord === "L") {
      return "Locked";
    } else {
      return "urecognized event type";
    }
  }

  render() {
    const {
      apiData: {
        id,
        title,
        description,
        typeOf,
        isScheduled,
        eventSchedule,
        eventStatus,
        createdOn,
      },
      classes,
    } = this.props;
    return (
      <Paper elevation={3}>
        <AppBar className={classes.eventHeading} position="static">
          <Container>
            <Grid container direction="row" justify="space-between">
              <Grid item>{title}</Grid>
              <Grid item>{this.renderEventType(typeOf)}</Grid>
              <Grid item>{eventStatus}</Grid>
            </Grid>
          </Container>
        </AppBar>

        <Container>
          <Grid className={classes.eventDescription}>
            <Grid className={classes.eventDescription}>
              <Typography variant="h4">{title}</Typography>
              {isScheduled
                ? eventSchedule.map((data) => {
                    const { id, date, timeStartsAt, timeEndsAt } = data;
                    return (
                      <Typography variant="subtitle1" key={id}>
                        On {date}, starts from {timeStartsAt} to {timeEndsAt}
                      </Typography>
                    );
                  })
                : null}

              <Typography variant="subtitle2">{createdOn}</Typography>
              <Typography variant="body1">{description}</Typography>
            </Grid>

            <Grid container direction="row" justify="space-around">
              <ButtonGroup variant="contained">
                <Button
                  color="secondary"
                  onClick={() => this.props.deleteEvent(id)}
                >
                  Delete Event
                </Button>

                <Button color="primary">Enter Event</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    );
  }
}
export default withStyles(styles)(Event);
