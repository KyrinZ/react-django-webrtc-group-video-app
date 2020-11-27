import React, { Component } from "react";
import { Field, ErrorMessage } from "formik";

// Material UI components
import TextField from "@material-ui/core/TextField";

export class FormikUIField extends Component {
  render() {
    const {
      name,
      label,
      type = "text",
      MUComponent = TextField,
      ...restOfProps
    } = this.props;

    return (
      <div>
        <Field
          name={name}
          label={label}
          type={type}
          {...restOfProps}
          helperText={<ErrorMessage name={name} />}
          as={MUComponent}
        />
      </div>
    );
  }
}

export default FormikUIField;
