import React, { Component } from "react";
import { Field, ErrorMessage } from "formik";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";

class MaterialSelectUI extends Component {
  render() {
    const {
      label,
      children,
      value,
      name,
      errorString,
      onChange,
      onBlur,
    } = this.props;
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
}

export class FormikUISelect extends Component {
  render() {
    const { name, label, items = [] } = this.props;
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
}

export default FormikUISelect;
