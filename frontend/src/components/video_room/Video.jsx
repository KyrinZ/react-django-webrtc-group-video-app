import React, { Component } from "react";

// Material UI components
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

// Utility components, functions, constants, objects...
import videoRoomStyles from "./video_room_styles";

export class Video extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMouseHovering: false,
    };
  }

// These Hover method is just for style purposes
  mouseHoverIn = () => {
    this.setState({
      isMouseHovering: true,
    });
  };
  mouseHoverOut = () => {
    this.setState({
      isMouseHovering: false,
    });
  };
  componentDidMount = () => {
    // remote stream is added to video tags
    const { peer, user_id } = this.props;
    if (peer && user_id) {
      peer.on("stream", (stream) => {
        document.getElementById(`remote-${user_id}`).srcObject = stream;
      });
    }
  };

  render() {
    const { user_full_name, id, classes, isLocalUser } = this.props;

    // Style is changed if stream is local or remote
    let videoDivClass;
    let style;
    if (isLocalUser) {
      videoDivClass = classes.localVideoDiv;
    } else {
      videoDivClass = classes.remoteVideoDiv;

      if (this.state.isMouseHovering) {
        style = { opacity: 1 };
      } else {
        style = { opacity: 0 };
      }
    }

    return (
      <div
        onMouseOver={this.mouseHoverIn}
        onMouseOut={this.mouseHoverOut}
        className={videoDivClass}
      >
        <video
          className={classes.video}
          id={id}
          autoPlay
          muted={isLocalUser}
        ></video>

        {!isLocalUser ? (
          <div style={style} className={classes.userDetail}>
            <Typography variant="overline">
              {user_full_name ? user_full_name : "Anonymous"}
            </Typography>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(videoRoomStyles)(Video);
