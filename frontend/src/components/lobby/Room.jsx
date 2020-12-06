import React, { Component } from "react";

// Material UI components
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

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
      apiData: { id, title, description, typeOf, createdOn, roomId },
      classes,
      deleteRoom,
      enterRoom,
    } = this.props;
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{title}</Typography>
          <Typography className={classes.secondaryHeading}>
            {this.renderRoomType(typeOf)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container justify="space-between">
            <div>
              <Grid container direction="column">
                <Typography gutterBottom variant="h5">
                  {title}
                </Typography>
                <Typography variant="subtitle2">{createdOn}</Typography>
                <Typography variant="body1">{description}</Typography>
              </Grid>
            </div>
            <div>
              <ButtonGroup orientation="vertical" variant="contained">
                <Button color="secondary" onClick={() => deleteRoom(id)}>
                  Delete Room
                </Button>

                <Button onClick={() => enterRoom(roomId)} color="primary">
                  Enter Room
                </Button>
              </ButtonGroup>
            </div>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
}
export default withStyles(styles)(Room);
