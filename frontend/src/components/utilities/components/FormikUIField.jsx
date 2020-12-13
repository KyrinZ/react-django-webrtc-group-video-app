import React from "react";
import { Field, ErrorMessage } from "formik";

// Material UI components
import TextField from "@material-ui/core/TextField";

function FormikUIField(props) {
  const {
    name,
    label,
    type = "text",
    MUComponent = TextField,
    ...restOfProps
  } = props;
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

export default FormikUIField;
