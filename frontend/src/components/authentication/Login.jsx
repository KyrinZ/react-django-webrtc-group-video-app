import React, { Component } from "react";
import { Formik, Form } from "formik";
// Material UI components
import { withStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import FormikUIField from "./FormikUIField";
import { loginValidationSchema } from "./auth-validation-schema";
import axiosInstance from "./axios";

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(3),
    textAlign: "center",
    color: theme.palette.text.primary,
    borderRadius: "1rem",
  },
  button: {
    margin: theme.spacing(3),
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverErrors: "",
    };
    this.onSubmitLoginForm = this.onSubmitLoginForm.bind(this);
  }

  onSubmitLoginForm(data) {
    const jsonData = {
      email: data.email,
      password: data.password,
    };

    axiosInstance
      .post("token/", jsonData)
      .then((res) => {
        axiosInstance.defaults.headers["Authorization"] =
          "Bearer " + res.data.access;
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);

        this.props.checkLogStatus();
      })
      .catch((error) => {
        this.setState({
          serverErrors: Object.values(error.response.data),
        });
      });
  }

  render() {
    const { classes } = this.props;
    let initialValues = {
      email: "",
      password: "",
    };
    return (
      <Container maxWidth="sm">
        <Paper className={classes.paper} elevation={3}>
          <Container>
            <Formik
              initialValues={initialValues}
              onSubmit={this.onSubmitLoginForm}
              validationSchema={loginValidationSchema}
            >
              {({ dirty, isValid }) => (
                <Form>
                  <Typography align="center" variant="h2">
                    Login
                  </Typography>
                  <FormikUIField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    error={!isValid}
                  />

                  {/* Gotta remember the warning about the password, I will sure remember to add SSL */}
                  <FormikUIField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    error={!isValid}
                  />

                  {/* Server side error */}
                  {this.state.serverErrors
                    ? this.state.serverErrors.map((error, index) => (
                        <FormHelperText key={index} error>
                          {error}
                        </FormHelperText>
                      ))
                    : null}

                  <Button
                    className={classes.button}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!dirty || !isValid}
                  >
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          </Container>
        </Paper>
      </Container>
    );
  }
}

export default withStyles(styles)(Login);
