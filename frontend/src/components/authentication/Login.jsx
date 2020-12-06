import React, { Component } from "react";
import { Formik, Form } from "formik";

// Material UI components
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";

// Components
import FormikUIField from "../utilities/form_fields/FormikUIField";
import { loginValidationSchema } from "../utilities/authForms_validation_schema";
import axiosInstance from "../utilities/axios";
import RouterUILink from "../utilities/RouterUILink";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    textAlign: "center",
    color: theme.palette.text.primary,
    borderRadius: "1rem",
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
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
    const userData = {
      email: data.email,
      password: data.password,
    };
    const {
      history,
      redirectPath,
      authenticateUser,
      printFeedback,
    } = this.props;
    axiosInstance
      .post("token/", userData)
      .then(({ data }) => {
        axiosInstance.defaults.headers["Authorization"] =
          "Bearer " + data.access;
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        authenticateUser();
        history.push(redirectPath);
        printFeedback({ type: "success", feedbackMsg: "You are logged in" });
      })
      .catch((error) => {
        console.log(error.message);
        if (error.response) {
          this.setState({
            serverErrors: Object.values(error.response.data),
          });
        }
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
              {({ dirty, isValid, errors, touched }) => (
                <Form>
                  <Typography align="center" variant="h3">
                    Login
                  </Typography>
                  <FormikUIField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    error={errors.email && touched.email}
                  />

                  <FormikUIField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    error={errors.password && touched.password}
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
                    fullWidth
                    className={classes.button}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!dirty || !isValid}
                  >
                    Login
                  </Button>
                  <Typography display="block" variant="caption">
                    not a member?
                    <RouterUILink linkTo="/register" innerText="Register" />
                  </Typography>
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
