import React, { Component } from "react";
import { Formik, Form } from "formik";

// Material UI components
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

// Components
import FormikUIField from "../utilities/form_fields/FormikUIField";
import { registerValidationSchema } from "../utilities/authForms_validation_schema";
import axiosInstance from "../utilities/axios";

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

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverErrors: "",
    };
    this.onSubmitRegisterForm = this.onSubmitRegisterForm.bind(this);
  }
  onSubmitRegisterForm(data, { resetForm }) {
    const jsonData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    };

    axiosInstance
      .post("user/create/", jsonData)
      .then((response) => {
        axiosInstance.defaults.headers["Authorization"] =
          "Bearer " + response.data.tokens.access;
        localStorage.setItem("access_token", response.data.tokens.access);
        localStorage.setItem("refresh_token", response.data.tokens.refresh);

        this.props.checkLogStatus();
      })
      .catch((error) => {
        this.setState({
          serverErrors: Object.values(error.response.data),
        });
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
              {({ dirty, isValid }) => (
                <Form>
                  <Typography align="center" variant="h2">
                    Register
                  </Typography>

                  <FormikUIField
                    name="firstName"
                    label="First Name"
                    type="text"
                    fullWidth
                    required
                    error={!isValid}
                  />

                  <FormikUIField
                    name="lastName"
                    label="Last Name"
                    type="text"
                    fullWidth
                    required
                    error={!isValid}
                  />

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

                  <FormikUIField
                    name="confirmation"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    error={!isValid}
                  />

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

export default withStyles(styles)(Register);
