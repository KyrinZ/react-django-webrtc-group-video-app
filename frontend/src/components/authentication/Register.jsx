import React, { Component } from "react";
import { Formik, Form } from "formik";

// Material UI components
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

// Utility components, functions, constants, objects...
import {
  FormikUIField,
  registerValidationSchema,
  axiosInstance,
  RouterUILink,
} from "../utilities";
import formStyles from "./form_styles";

const passwordHelperText = [
  "Your password can’t be too similar to your other personal information.",
  "Your password must contain at least 8 characters.",
  "Your password can’t be a commonly used password. ",
  "Your password can’t be entirely numeric.",
];

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverErrors: "",
    };
    this.onSubmitRegisterForm = this.onSubmitRegisterForm.bind(this);
  }

  // Submission form
  onSubmitRegisterForm(data) {
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

    // Sends post requests
    axiosInstance
      .post("user/create/", userData)
      .then(({ data: { tokens } }) => {
        // Tokens are added to headers upcoming requests
        // And they stored in local storage
        axiosInstance.defaults.headers["Authorization"] =
          "Bearer " + tokens.access;
        localStorage.setItem("access_token", tokens.access);
        localStorage.setItem("refresh_token", tokens.refresh);

        // User is then authenticated and redirected to lobby with print feedback message
        authenticateUser();
        history.push(redirectPath);
        printFeedback({
          type: "success",
          feedbackMsg: "You are registered and logged in",
        });
      })
      .catch((error) => {
        console.log(error.message);

        // Server error is set to state to display down in component
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmation: "",
    };
    return (
      <Paper className={classes.formPaper} elevation={3}>
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

              <div className={classes.fullName}>
                {/* First Name */}
                <FormikUIField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  type="text"
                  required
                  error={errors.firstName && touched.firstName}
                />

                {/* Last Name */}
                <FormikUIField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  type="text"
                  required
                  error={errors.lastName && touched.lastName}
                />
              </div>

              {/* Email */}
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
              {passwordHelperText.map((text, index) => (
                <FormHelperText key={index}>{text}</FormHelperText>
              ))}

              {/* Password */}
              <FormikUIField
                name="confirmation"
                label="Confirm Password"
                type="password"
                fullWidth
                required
                error={errors.confirmation && touched.confirmation}
              />
              <FormHelperText>
                Enter the same password as before, for verification.
              </FormHelperText>
              {/* Server Errors */}
              {this.state.serverErrors
                ? this.state.serverErrors.map((error, index) => (
                    <FormHelperText key={index} error>
                      {error}
                    </FormHelperText>
                  ))
                : null}

              {/* Register Button */}
              <Button
                fullWidth
                className={classes.formButton}
                type="submit"
                variant="contained"
                color="primary"
                disabled={!dirty || !isValid}
              >
                Register
              </Button>

              {/* Link to Login page */}
              <Typography display="block" variant="caption">
                already have an account?
                <RouterUILink linkTo="/login" innerText="Log In" />
              </Typography>
            </Form>
          )}
        </Formik>
      </Paper>
    );
  }
}

export default withStyles(formStyles)(Register);
