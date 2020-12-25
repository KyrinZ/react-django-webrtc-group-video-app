import React, { Component } from "react";
import Peer from "simple-peer";

// Material UI components
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import VolumeUpRoundedIcon from "@material-ui/icons/VolumeUpRounded";
import VolumeOffRoundedIcon from "@material-ui/icons/VolumeOffRounded";
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded";
import VideocamOffRoundedIcon from "@material-ui/icons/VideocamOffRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import Tooltip from "@material-ui/core/Tooltip";
import Alert from "@material-ui/lab/Alert";

// Components
import Video from "./Video";

// Utility components, functions, constants, objects...
import { UserInfoContext, webSocketUrl, AVAILABLE_PATHS } from "../utilities";
import videoRoomStyles from "./video_room_styles";

export class VideoRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      websocket: null,
      stream: null,
      usersConnected: [],
      peersEstablished: [],

      isVideoMuted: false,
      isAudioMuted: false,
      contentLoading: true,

      isVideoRoomAccessible: true,
    };
  }

  muteVideo = () => {
    const stream = document.getElementById("localVideo").srcObject;
    if (!stream.getVideoTracks()[0]) return;
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    this.setState({
      isVideoMuted: !stream.getVideoTracks()[0].enabled,
    });
  };
  muteAudio = () => {
    const stream = document.getElementById("localVideo").srcObject;
    if (!stream.getAudioTracks()[0]) return;
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    this.setState({
      isAudioMuted: !stream.getAudioTracks()[0].enabled,
    });
  };
  leaveRoom = () => {
    const { history } = this.props;
    history.push(AVAILABLE_PATHS.LOBBY_PATH);
  };

  // Creates offer to send it to other user in the room
  CreatePeer = (currentUserId, otherUserId, currentUserStream = null) => {

    // User creates peer as initiator
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: currentUserStream,
    });

    // Offer is sent
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

    // Peer is then returned
    return peer;
  };

  // Creates answer in response to the offer received
  addPeer = (
    currentUserId,
    otherUserId,
    receivedOffer,
    currentUserStream = null
  ) => {

    // User creates peer but not as an initiator 
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentUserStream,
    });


    // The offer that was sent is set as remote description
    peer.signal(receivedOffer);

    // Answer is sent back to the user who sent the offer
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

     // Peer is then returned
    return peer;
  };

  // Function to send offers to each users as initiator that are connected to the room
  sendSignalsToAll = (currentUserId, stream = null) => {
    const peers = [];
    this.state.usersConnected.forEach((otherUser) => {
      if (otherUser.user_id !== currentUserId) {
        const peer = this.CreatePeer(currentUserId, otherUser.user_id, stream);
        peers.push({
          user_id: otherUser.user_id,
          user_full_name: otherUser.user_full_name,
          peer: peer,
        });
      }
    });

    this.setState({
      peersEstablished: peers,
    });
  };

  componentDidMount = () => {
    const {
      printFeedback,
      match: { params },
    } = this.props;

    // Checks whether 'navigator.mediaDevices' is available for this browser or not
    if (!navigator.mediaDevices) {
      this.setState({ isVideoRoomAccessible: false });
      printFeedback({
        type: "error",
        feedbackMsg:
          "this video room is not accessible because the site is not running on secure protocol, i.e. 'HTTPS'",
      });
      return;
    }
    // Extracting current user info
    const { userId, userFullName } = this.context;

    // Websocket connection is made
    const websocket = new WebSocket(webSocketUrl() + `${params.roomId}/`);
    this.setState({
      websocket: websocket,
    });

    websocket.onopen = () => {
      this.setState({
        contentLoading: true,
      });

      // Send all users in the room new user joined
      websocket.send(
        JSON.stringify({
          type: "new_user_joined",
          from: userId,
          user_full_name: userFullName,
          token: localStorage.getItem("access_token"),
        })
      );
    };

    websocket.onmessage = (payload) => {
      // Message from backend
      const data = JSON.parse(payload.data);

      switch (data.type) {
        case "new_user_joined":
          this.setState({
            usersConnected: data.users_connected,
          });

          // If user joined is current user, the user is requested to enable the media devices and offer is created and sent to other user
          if (userId === data.from) {
            navigator.mediaDevices
              .getUserMedia({
                video: true,
                audio: true,
              })
              .then((stream) => {
                this.setState({ stream: stream });
                document.getElementById("localVideo").srcObject = stream;
                this.sendSignalsToAll(userId, stream);
              })
              .catch((error) => {
                this.setState({ isVideoRoomAccessible: false });
                printFeedback({
                  type: "error",
                  feedbackMsg:
                    "you need to enable media devices inorder to use access this room",
                });
                console.log(error.message);
                return;
              });
          }

          // Message is send to other user that new user joined
          if (userId !== data.from) {
            const user = this.state.usersConnected.find(
              (eachUser) => eachUser.user_id === data.from
            );
            printFeedback({
              type: "success",
              feedbackMsg: `${user.user_full_name} joined this room`,
            });
            console.log(`User No. ${data.from} joined this room`);
          }
          break;

        // Offer is received here by others who then store it in there state and sends the answer
        case "sending_offer":
          if (data.to === userId) {
            console.log("offer_received");
            const peer = this.addPeer(
              userId,
              data.from,
              data.offer,
              this.state.stream
            );
            this.setState(({ peersEstablished }) => {
              const user = this.state.usersConnected.find(
                (eachUser) => eachUser.user_id === data.from
              );
              let newPeersList = [
                ...peersEstablished,
                {
                  user_id: data.from,
                  user_full_name: user.user_full_name,
                  peer: peer,
                },
              ];

              // Checks whether the peer with same user id exists in the 'peersEstablished' state, that peer is then removed
              const userPeer = this.state.peersEstablished.find(
                (eachUser) => eachUser.user_id === data.from
              );
              if (userPeer) {
                const newList = this.state.peersEstablished.filter(
                  (peer) => userPeer.user_id !== peer.user_id
                );

                newPeersList = [
                  ...newList,
                  {
                    user_id: data.from,
                    user_full_name: user.user_full_name,
                    peer: peer,
                  },
                ];
              }

              return {
                peersEstablished: newPeersList,
              };
            });
          }
          break;

        // Answer is received here by the user who just joined
        case "sending_answer":
          if (data.to === userId) {
            console.log("answer_received");
            const userPeer = this.state.peersEstablished.find(
              (eachUser) => eachUser.user_id === data.from
            );

            // Answer is set as remote description
            userPeer.peer.signal(data.answer);
          }

          break;
        case "disconnected":
          if (data.from !== userId) {
            const user = this.state.usersConnected.find(
              (eachUser) => eachUser.user_id === data.from
            );

            // Feedback is sent to users about who just disconnected
            if (user) {
              console.log(`User No. ${data.from} disconnected`);
              printFeedback({
                type: "error",
                feedbackMsg: `${user.user_full_name} left`,
              });

              // Peer associated with the user that just disconnected is destroyed
              const userPeer = this.state.peersEstablished.find(
                (eachUser) => eachUser.user_id === data.from
              );
              if (userPeer) {
                userPeer.peer.destroy();
                const newPeersList = this.state.peersEstablished.filter(
                  (peer) => userPeer.user_id !== peer.user_id
                );
                this.setState({ peersEstablished: newPeersList });
              }
            }
          }
          break;
        default:
          break;
      }
    };
  };

  componentWillUnmount = () => {
    // Websocket is closed
    const { websocket, peersEstablished, stream } = this.state;
    if (websocket) {
      this.state.websocket.close();
    }

    // All peers is destroyed
    peersEstablished.forEach(({ peer }) => {
      peer.destroy();
    });

    // Streams are stopped
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    // All state is cleared
    this.setState({
      websocket: null,
      stream: null,
      usersConnected: [],
      peersEstablished: [],

      isVideoMuted: true,
      isAudioMuted: true,
    });
  };

  static contextType = UserInfoContext;
  render() {
    const {
      isVideoRoomAccessible,
      isVideoMuted,
      isAudioMuted,
      peersEstablished,
    } = this.state;

    const { userFullName } = this.context;
    const { classes } = this.props;
    return (
      <div>
        {isVideoRoomAccessible ? (
          <>
            {/* Action Buttons */}
            <div className={classes.floatingButtons}>
              {/* Video Mute/Unmute */}
              <Tooltip title="Video ON/OFF">
                <Fab
                  className={classes.floatingButton}
                  onClick={this.muteVideo}
                  color="inherit"
                >
                  {isVideoMuted ? (
                    <VideocamOffRoundedIcon />
                  ) : (
                    <VideocamRoundedIcon />
                  )}
                </Fab>
              </Tooltip>

              {/* Audio Mute/Unmute */}
              <Tooltip title="Audio ON/OFF">
                <Fab
                  className={classes.floatingButton}
                  onClick={this.muteAudio}
                  color="inherit"
                >
                  {isAudioMuted ? (
                    <VolumeOffRoundedIcon />
                  ) : (
                    <VolumeUpRoundedIcon />
                  )}
                </Fab>
              </Tooltip>

              {/* Leave Room */}
              <Tooltip title="Leave Room">
                <Fab
                  onClick={this.leaveRoom}
                  className={classes.floatingButton}
                  color="secondary"
                >
                  <ExitToAppRoundedIcon />
                </Fab>
              </Tooltip>
            </div>

            {/* Locale Video */}
            <Video isLocalUser id="localVideo" user_full_name={userFullName} />

            {/* Remote Videos */}
            <div className={classes.videoGrid}>
              {peersEstablished.length > 0 ? (
                peersEstablished.map((userPeer, index) => (
                  <Video
                    key={index}
                    id={`remote-${userPeer.user_id}`}
                    user_id={userPeer.user_id}
                    user_full_name={userPeer.user_full_name}
                    peer={userPeer.peer}
                  />
                ))
              ) : (
                <Alert severity="info">No one joined yet!!</Alert>
              )}
            </div>
          </>
        ) : (
          // Error displayed if something goes wrong
          <Alert className={classes.alert} severity="error">
            This room is not accessible. Please make sure you enabled your media
            devices
          </Alert>
        )}
      </div>
    );
  }
}

export default withStyles(videoRoomStyles)(VideoRoom);
