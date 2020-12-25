import React, { Component } from "react";
import { Formik, Form } from "formik";

// Material UI components
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

// Utility components, functions, constants, objects...
import {
  roomFormValidationSchema,
  FormikUIField,
  FormikUISelect,
  UserInfoContext,
} from "../../utilities";
import createRoomFormStyles from "./create_room_form_styles";

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
    ];
  }
  static contextType = UserInfoContext;
  render() {
    const { userId } = this.context;

    // Instantiating form fields with pretty much empty values
    let initialValues = {
      user: userId,
      title: "",
      description: "",
      typeOf: "OTA",
    };

    const { classes, onRoomFormSubmit } = this.props;

    return (
      <Paper className={classes.formPaper} elevation={3}>
        <Formik
          initialValues={initialValues}
          onSubmit={onRoomFormSubmit}
          validationSchema={roomFormValidationSchema}
        >
          {({ isValid, dirty, errors, touched }) => (
            <Form>
              <Typography align="center" variant="h4">
                New Room
              </Typography>

              {/* Title */}
              <FormikUIField
                name="title"
                label="Title"
                type="text"
                required
                fullWidth
                error={errors.title}
              />

              {/* Description */}
              <FormikUIField
                name="description"
                label="Event description"
                type="text"
                fullWidth
                error={errors.description}
                multiline
                rows={4}
              />

              {/* Room type */}
              <FormikUISelect
                name="typeOf"
                label="Room type"
                items={this.roomTypes}
                error={errors.typeOf || touched.typeOf}
                required
              />

              <Button
                fullWidth
                disabled={!dirty || !isValid}
                className={classes.createRoomBtn}
                variant="contained"
                type="submit"
              >
                Create Room
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    );
  }
}
export default withStyles(createRoomFormStyles)(CreateRoomForm);
