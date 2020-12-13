import React from "react";

// Material UI components
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

function Loading() {
  return (
    <Container style={{ textAlign: "center" }}>
      <CircularProgress />
    </Container>
  );
}

export default Loading;
