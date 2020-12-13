import React from "react";

import "fontsource-roboto";
import Routes from "./Routes";
import Container from "@material-ui/core/Container";

class App extends React.Component {
  render() {
    return (
      <Container>
        <Routes />
      </Container>
    );
  }
}

export default App;
