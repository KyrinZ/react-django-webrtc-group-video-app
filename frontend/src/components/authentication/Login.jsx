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
  loginValidationSchema,
  axiosInstance,
  RouterUILink,
} from "../utilities";
import formStyles from "./form_styles";

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
      <Paper className={classes.formPaper} elevation={3}>
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

              {/* Email */}
              <FormikUIField
                name="email"
                label="Email"
                type="email"
                fullWidth
                required
                error={errors.email && touched.email}
              />

              {/* Password */}
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
                className={classes.formButton}
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
      </Paper>
    );
  }
}

export default withStyles(formStyles)(Login);
