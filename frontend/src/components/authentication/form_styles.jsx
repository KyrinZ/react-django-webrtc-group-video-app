// Custom styling for authentication forms
const formStyles = (theme) => ({
  formPaper: {
    margin: "2rem auto",
    width: "80%",
    padding: theme.spacing(3),
    textAlign: "center",
    borderRadius: "1rem",
    [theme.breakpoints.up("md")]: { margin: "4rem auto", width: "40%" },
  },
  fullName: {
    display: "flex",
    "flex-direction": "column",
    "justify-content": "space-between",
    [theme.breakpoints.up("md")]: {
      "flex-direction": "row",
      "justify-content": "space-evenly",
    },
  },
  formButton: {
    margin: "1.5rem 0",
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
export default formStyles;
