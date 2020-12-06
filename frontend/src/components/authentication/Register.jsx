import React, { Component } from "react";
import { Formik, Form } from "formik";

// Material UI components
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

// Components
import FormikUIField from "../utilities/form_fields/FormikUIField";
import { registerValidationSchema } from "../utilities/authForms_validation_schema";
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
  input: {
    display: "inline-block",
  },
});

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverErrors: "",
    };
    this.onSubmitRegisterForm = this.onSubmitRegisterForm.bind(this);
  }
  onSubmitRegisterForm(data, { resetForm }) {
    const userData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    };
    const {
      history,
      redirectPath,
      authenticateUser,
      printFeedback,
    } = this.props;
    axiosInstance
      .post("user/create/", userData)
      .then(({ data: { tokens } }) => {
        axiosInstance.defaults.headers["Authorization"] =
          "Bearer " + tokens.access;
        localStorage.setItem("access_token", tokens.access);
        localStorage.setItem("refresh_token", tokens.refresh);

        authenticateUser();
        history.push(redirectPath);
        printFeedback({
          type: "success",
          feedbackMsg: "You are registered and logged in",
        });
      })
      .catch((error) => {
        console.log(error.message);
        if (error.response) {
          this.setState({
            serverErrors: Object.values(error.response.data),
          });
        }
      });

    resetForm();
    // Sending Login credentials and receiving Tokens
  }

  render() {
    const { classes } = this.props;
    let initialValues = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmation: "",
    };
    return (
      <Container maxWidth="sm">
        <Paper className={classes.paper} elevation={3}>
          <Container>
            <Formik
              initialValues={initialValues}
              onSubmit={this.onSubmitRegisterForm}
              validationSchema={registerValidationSchema}
            >
              {({ dirty, isValid, errors, touched }) => (
                <Form>
                  <Typography align="center" variant="h3">
                    Register
                  </Typography>

                  <Grid container justify="space-between">
                    <FormikUIField
                      name="firstName"
                      label="First Name"
                      type="text"
                      required
                      error={errors.firstName && touched.firstName}
                    />

                    <FormikUIField
                      name="lastName"
                      label="Last Name"
                      type="text"
                      required
                      error={errors.lastName && touched.lastName}
                    />
                  </Grid>
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

                  <FormikUIField
                    name="confirmation"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    error={errors.confirmation && touched.confirmation}
                  />

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
                    Register
                  </Button>
                  <Typography display="block" variant="caption">
                    already have an account?
                    <RouterUILink linkTo="/login" innerText="Log In" />
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

export default withStyles(styles)(Register);
