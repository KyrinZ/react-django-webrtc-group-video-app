import * as yup from "yup";

let loginValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

let registerValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  password: yup.string().min(8).required(),
  confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
export { registerValidationSchema, loginValidationSchema };
