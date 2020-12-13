import React from "react";
import { Field, ErrorMessage } from "formik";

// Material UI components
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";

function MaterialSelectUI(props) {
  const { label, children, value, name, errorString, onChange, onBlur } = props;
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} name={name} onChange={onChange} onBlur={onBlur}>
        {children}
      </Select>
      <FormHelperText>{errorString}</FormHelperText>
    </FormControl>
  );
}

function FormikUISelect(props) {
  const { name, label, items = [] } = props;
  return (
    <Field
      name={name}
      label={label}
      errorString={<ErrorMessage name={name} />}
      as={MaterialSelectUI}
    >
      {items.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </Field>
  );
}

export default FormikUISelect;
