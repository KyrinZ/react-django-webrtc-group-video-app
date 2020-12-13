// Custom Video styling
const videoRoomStyles = (theme) => ({
  floatingButtons: {
    zIndex: 1,
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  floatingButton: {
    margin: "0 0.5rem",
  },
  videoGrid: {
    marginTop: "1rem",
    marginBottom: "15rem",

    width: "100%",
    display: "grid",
    "grid-template-columns": "repeat(2, 1fr)",
    "grid-template-rows": "auto",
    gap: "0.3rem",
    [theme.breakpoints.up("md")]: {
      marginBottom: "20rem",
      "grid-template-columns": "repeat(4, 1fr)",
    },
  },

  remoteVideoDiv: {
    overflow: "hidden",
    borderRadius: "0.5rem",
    background: "gray",
    position: "relative",
  },
  localVideoDiv: {
    zIndex: 2,
    borderRadius: "0.5rem",
    position: "fixed",
    bottom: 40,
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "150px",
    height: "100px",
    background: "black",
    [theme.breakpoints.up("md")]: {
      bottom: 30,
      width: "200px",
      height: "150px",
    },
  },
  video: {
    borderRadius: "0.5rem",
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },

  userDetail: {
    textAlign: "center",
    width: "100%",
    borderRadius: "0.5rem",
    transition: "0.3s",
    position: "absolute",
    background: "rgba(177, 202, 248, 0.459)",
    padding: "0.3rem 1rem",
    bottom: -20,
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  alert: {
    marginTop: "1rem",
  },
});
export default videoRoomStyles;
