// Custom form styles
const createRoomFormStyles = (theme) => ({
  formPaper: {
    padding: "2rem",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    [theme.breakpoints.up("md")]: { width: "40%" },
  },
  createRoomBtn: {
    margin: "1rem 0",
    color: "#fff",
    "background-image":
      "linear-gradient(to right, rgba(46,49,146,1) 13%, rgba(27,255,255,1) 96%)",

    transition: "0.5s",
    "background-size": " 200% auto",

    "&:hover": {
      "background-position": "right center",
    },
    "&:disabled": {
      background: "#829baf",
      color: "#e3f2fd",
    },
  },
});
export default createRoomFormStyles;
