import React from "react";

// Material UI components
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

function Feedback(props) {
  const { severity, feedbackMsg, isFeedbackOpen, closeFeedback } = props;
  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={isFeedbackOpen}
        autoHideDuration={6000}
        onClose={closeFeedback}
      >
        <Alert onClose={closeFeedback} severity={severity}>
          {feedbackMsg}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Feedback;
