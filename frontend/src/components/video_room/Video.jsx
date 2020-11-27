import React, { Component } from "react";

export class Video extends Component {
  componentDidMount = () => {
    const { peer, user_id } = this.props;

    peer.on("stream", (stream) => {
      document.getElementById(`remote-${user_id}`).srcObject = stream;
    });
  };

  render() {
    const { id } = this.props;
    return <video id={id} autoPlay></video>;
  }
}

export default Video;
