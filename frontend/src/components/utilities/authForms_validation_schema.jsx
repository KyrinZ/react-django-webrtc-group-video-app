import * as yup from "yup";

// Validations Schemas for authentication

export let loginValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export let registerValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
  firstName: yup.string().required().label("First Name"),
  lastName: yup.string().required().label("Last Name"),
  password: yup.string().min(8).required(),
  confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
});
