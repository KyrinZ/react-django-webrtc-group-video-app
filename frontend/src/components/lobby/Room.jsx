import React, { Component } from "react";

// Material UI components
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";

// Utility components, functions, constants, objects...
import { UserInfoContext } from "../utilities/components/UserInfoProvider";
import roomStyles from "./room_styles";

class Room extends Component {
  constructor(props) {
    super(props);

    this.renderRoomType = this.renderRoomType.bind(this);
  }

  // User information
  static contextType = UserInfoContext;

  // Render room types based on initial acquired from database
  renderRoomType(roomTypeKeyWord) {
    switch (roomTypeKeyWord) {
      case "OTA":
        return "Open to All";
      case "IO":
        return "Invite only";
      default:
        return "unrecognized room type";
    }
  }

  // Copy room url to clipboard
  copyRoomUrl = (databaseId) => {
    const roomInput = document.getElementById(`room-data-base${databaseId}`);
    roomInput.select();
    document.execCommand("copy");
    this.props.printFeedback({ type: "success", feedbackMsg: "Link copied" });
  };

  render() {
    const {
      apiData: { id, title, description, typeOf, createdOn, roomId, user },
      classes,
      deleteRoom,
      enterRoom,
    } = this.props;
    const { userId } = this.context;
    return (
      <Accordion>
        {/* Head */}
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{title}</Typography>
          <Typography className={classes.secondaryHeading}>
            {this.renderRoomType(typeOf)}
          </Typography>
        </AccordionSummary>

        {/* Description */}
        <AccordionDetails>
          <div className={classes.gridContainer}>
            <div className={classes.gridItemA}>
              <Typography
                style={{ fontWeight: "bolder" }}
                gutterBottom
                variant="h5"
              >
                {title}
              </Typography>
              <Typography variant="caption" style={{ color: "gray" }}>
                created on {createdOn}
              </Typography>
              <Typography variant="body1">{description}</Typography>
            </div>

            <div className={classes.gridItemB}>
              <ButtonGroup
                fullWidth
                size="small"
                orientation="vertical"
                variant="contained"
              >
                {/* Delete button is only shown if the room belongs to current user */}
                {userId === user ? (
                  <Button
                    style={{ transition: "0.5s" }}
                    color="secondary"
                    onClick={() => deleteRoom(id)}
                  >
                    Delete Room
                  </Button>
                ) : null}

                {/* 'Invite Only' type have there enter button not shown */}
                {typeOf !== "IO" ? (
                  <Button
                    className={classes.enterBtn}
                    onClick={() => enterRoom(roomId)}
                    color="primary"
                  >
                    Enter Room
                  </Button>
                ) : userId === user ? (
                  <Button
                    className={classes.enterBtn}
                    onClick={() => enterRoom(roomId)}
                    color="primary"
                  >
                    Enter Room
                  </Button>
                ) : null}
              </ButtonGroup>
            </div>

            {/* Copy Room Url */}
            <div className={classes.gridItemC}>
              {userId === user && typeOf === "IO" ? (
                <>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    id={`room-data-base${id}`}
                    defaultValue={window.location.origin + `/video/${roomId}`}
                  />
                  <Button
                    style={{ transition: "0.5s" }}
                    fullWidth
                    color="secondary"
                    size="small"
                    onClick={() => this.copyRoomUrl(id)}
                  >
                    Copy room link
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }
}
export default withStyles(roomStyles)(Room);
