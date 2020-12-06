import React, { Component } from "react";
import { Formik, Form } from "formik";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

// Components
import roomFormValidationSchema from "../../utilities/roomForms_validation_schema";
import FormikUIField from "../../utilities/form_fields/FormikUIField";
import FormikUISelect from "../../utilities/form_fields/FormikUISelect";

const styles = {
  submitBtn: {
    margin: "1rem 0",
  },
};

class CreateRoomForm extends Component {
  constructor(props) {
    super(props);

    this.roomTypes = [
      {
        value: "OTA",
        label: "Open to all",
      },
      {
        value: "IO",
        label: "Invite only",
      },
      {
        value: "RO",
        label: "Register only",
      },
    ];
  }

  render() {
    // Instantiating form fields with pretty much empty values
    let initialValues = {
      title: "",
      description: "",
      typeOf: "OTA",
    };

    const { classes, onRoomFormSubmit } = this.props;

    return (
      <Container maxWidth="sm">
        <Paper elevation={3}>
          <Container>
            <Formik
              initialValues={initialValues}
              onSubmit={onRoomFormSubmit}
              validationSchema={roomFormValidationSchema}
            >
              {({ isValid, dirty, errors, touched }) => (
                <Form>
                  <Typography align="center" variant="h4">
                    Create Room
                  </Typography>
                  <FormikUIField
                    name="title"
                    label="Title"
                    type="text"
                    required
                    fullWidth
                    error={errors.title || touched.title}
                  />
                  <FormikUIField
                    name="description"
                    label="Event description"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                  />
                  <FormikUISelect
                    name="typeOf"
                    label="Event type"
                    items={this.roomTypes}
                    error={errors.typeOf || touched.typeOf}
                    required
                  />

                  <Grid container direction="row" justify="center">
                    <Button
                      fullWidth
                      disabled={!dirty || !isValid}
                      className={classes.submitBtn}
                      variant="contained"
                      type="submit"
                    >
                      Create Room
                    </Button>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Container>
        </Paper>
      </Container>
    );
  }
}
export default withStyles(styles)(CreateRoomForm);
