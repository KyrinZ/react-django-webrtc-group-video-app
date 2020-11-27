import React, { Component } from "react";

// Material UI components
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  roomHeading: {
    marginTop: "1rem",
    padding: "0.5rem",
  },
  roomDescription: {
    padding: "0.5rem",
  },
};

class Room extends Component {
  constructor(props) {
    super(props);
    this.renderRoomType = this.renderRoomType.bind(this);
  }

  renderRoomType(eventTypeKeyWord) {
    if (eventTypeKeyWord === "OTA") {
      return "Open to All";
    } else if (eventTypeKeyWord === "IO") {
      return "Invite only";
    } else if (eventTypeKeyWord === "L") {
      return "Locked";
    } else {
      return "urecognized event type";
    }
  }

  render() {
    const {
      apiData: { id, title, description, typeOf, createdOn },
      classes,
      deleteRoom,
    } = this.props;
    return (
      <Paper elevation={3}>
        <AppBar className={classes.roomHeading} position="static">
          <Container>
            <Grid container direction="row" justify="space-between">
              <Grid item>{title}</Grid>
              <Grid item>{this.renderRoomType(typeOf)}</Grid>
            </Grid>
          </Container>
        </AppBar>

        <Container>
          <Grid className={classes.roomDescription}>
            <Grid className={classes.roomDescription}>
              <Typography variant="h4">{title}</Typography>
              <Typography variant="subtitle2">{createdOn}</Typography>
              <Typography variant="body1">{description}</Typography>
            </Grid>

            <Grid container direction="row" justify="space-around">
              <ButtonGroup variant="contained">
                <Button color="secondary" onClick={() => deleteRoom(id)}>
                  Delete Room
                </Button>

                <Button color="primary">Enter Room</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    );
  }
}
export default withStyles(styles)(Room);
