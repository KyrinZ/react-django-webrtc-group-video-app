import React, { Component } from "react";
import Peer from "simple-peer";

import Video from "./Video";
import Button from "@material-ui/core/Button";

import jwt_decode from "jwt-decode";

const WEBSOCKET_URL = "ws://127.0.0.1:8000/video/ROOM/";

export class EventRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: jwt_decode(localStorage.getItem("access_token")).user_id,
      websocket: null,
      stream: null,
      usersConnected: [],
      peersEstablished: [],
    };
    this.joinCall = this.joinCall.bind(this);
  }

  joinCall = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        this.setState({ stream: stream });
        document.getElementById("localVideo").srcObject = stream;

        this.state.websocket.send(
          JSON.stringify({
            type: "media_enabled",
            user_id: this.state.userId,
          })
        );

        console.log(this.usersOnMedia());
        if (this.usersOnMedia() > 0) {
          const peers = [];
          this.state.usersConnected.forEach((otherUser) => {
            if (
              otherUser.user_id !== this.state.userId &&
              otherUser.media_enabled
            ) {
              const peer = this.CreatePeer(
                this.state.userId,
                otherUser.user_id,
                stream
              );

              peers.push({ user_id: otherUser.user_id, peer: peer });
            }
          });

          this.setState({
            peersEstablished: peers,
          });
        }
      })
      .catch((error) => console.log(error.message));
  };

  CreatePeer = (currentUserId, otherUserId, currentUserStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: currentUserStream,
    });

    peer.on("signal", (signal) => {
      this.state.websocket.send(
        JSON.stringify({
          type: "sending_offer",
          from: currentUserId,
          to: otherUserId,
          offer: signal,
        })
      );
    });
    return peer;
  };

  addPeer = (currentUserId, otherUserId, receivedOffer, currentUserStream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentUserStream,
    });
    peer.signal(receivedOffer);
    peer.on("signal", (signal) => {
      this.state.websocket.send(
        JSON.stringify({
          type: "sending_answer",
          from: currentUserId,
          to: otherUserId,
          answer: signal,
        })
      );
    });
    return peer;
  };

  usersOnMedia = () => {
    let noOfUserMediaEnabled = 0;
    this.state.usersConnected.forEach((user) => {
      if (user.user_id !== this.state.userId && user.media_enabled) {
        noOfUserMediaEnabled = +1;
      }
    });
    return noOfUserMediaEnabled;
  };
  componentDidMount = () => {
    const websocket = new WebSocket(WEBSOCKET_URL);
    this.setState({
      websocket: websocket,
    });

    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          type: "store_user",
          new_user_id: this.state.userId,
        })
      );
    };

    websocket.onmessage = (payload) => {
      const data = JSON.parse(payload.data);

      switch (data.type) {
        case "new_user_joined":
          this.setState({
            usersConnected: data.users,
          });
          console.log("User No. " + data.newUserId + " joined this room");
          break;
        case "media_enabled":
          this.setState({
            usersConnected: data.users,
          });
          console.log("User No. " + data.userId + " enabled media");
          break;
        case "sending_offer":
          if (data.to === this.state.userId) {
            console.log("offer_received");
            const peer = this.addPeer(
              this.state.userId,
              data.from,
              data.offer,
              this.state.stream
            );

            this.setState(({ peersEstablished }, props) => ({
              peersEstablished: [
                ...peersEstablished,
                { user_id: data.from, peer: peer },
              ],
            }));
          }
          break;
        case "sending_answer":
          if (data.to === this.state.userId) {
            console.log("answer_received");
            const userPeer = this.state.peersEstablished.find(
              (user) => user.user_id === data.from
            );
            userPeer.peer.signal(data.answer);
          }

          break;

        default:
          break;
      }
    };

    websocket.onclose = () => {
      this.setState({
        stream: null,
        usersConnected: [],
        peersEstablished: [],
      });
      console.log("disconnected");
    };
  };

  render() {
    return (
      <div>
        <video id="localVideo" autoPlay></video>
        {this.state.peersEstablished.map((userPeer, index) => (
          <Video
            key={index}
            id={`remote-${userPeer.user_id}`}
            user_id={userPeer.user_id}
            peer={userPeer.peer}
          />
        ))}
        <Button onClick={this.joinCall}>Join Call</Button>
      </div>
    );
  }
}

export default EventRoom;
