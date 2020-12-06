import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import CallEndRoundedIcon from "@material-ui/icons/CallEndRounded";
import VolumeMuteRoundedIcon from "@material-ui/icons/VolumeMuteRounded";
import VideocamOffRoundedIcon from "@material-ui/icons/VideocamOffRounded";

const styles = (theme) => ({
  video: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
});

export class Video extends Component {
  componentDidMount = () => {
    const { peer, user_id } = this.props;
    if (peer && user_id) {
      peer.on("stream", (stream) => {
        document.getElementById(`remote-${user_id}`).srcObject = stream;
      });
    }
  };

  render() {
    const { id, classes } = this.props;
    return <video className={classes.video} id={id} autoPlay></video>;
  }
}

export default withStyles(styles)(Video);
