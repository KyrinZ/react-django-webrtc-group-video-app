import React, { Component } from "react";
import { Formik, Form } from "formik";

// Components
import ScheduleInputFields from "./ScheduleInputFields";
import eventValidationSchema from "./event-validation-schema";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import FormikUIField from "../../authentication/FormikUIField";
import FormikUISelect from "../../authentication/FormikUISelect";

const styles = {
  submitBtn: {
    margin: "1rem",
  },
};

class CreateEventForm extends Component {
  constructor(props) {
    super(props);

    this.eventTypes = [
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
      isScheduled: false,
      schedules: [
        {
          date: "",
          timeStartsAt: "",
          timeEndsAt: "",
        },
      ],
    };

    const { classes } = this.props;

    return (
      <Container maxWidth="sm">
        <Paper elevation={3}>
          <Container>
            <Formik
              initialValues={initialValues}
              onSubmit={this.props.onEventFormSubmit}
              validationSchema={eventValidationSchema}
            >
              {({ values, isValid, dirty }) => (
                <Form>
                  <Typography align="center" variant="h4">
                    Create Event
                  </Typography>
                  <FormikUIField
                    name="title"
                    label="Title"
                    type="text"
                    required
                    fullWidth
                    error={!isValid}
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
                    items={this.eventTypes}
                    required
                  />

                  <FormControlLabel
                    label="Schedule event"
                    control={
                      <FormikUIField
                        name="isScheduled"
                        type="checkbox"
                        MUComponent={Switch}
                      />
                    }
                  >
                    Schedule event
                  </FormControlLabel>

                  <div>
                    {values.isScheduled ? (
                      <ScheduleInputFields
                        name="schedules"
                        schedules={values.schedules}
                      />
                    ) : null}
                  </div>
                  <Grid container direction="row" justify="center">
                    <Button
                      disabled={!dirty || !isValid}
                      className={classes.submitBtn}
                      variant="contained"
                      type="submit"
                    >
                      Create Event
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
export default withStyles(styles)(CreateEventForm);
