import * as yup from "yup";

const typeOf = ["OTA", "IO"];
let roomFormValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  typeOf: yup.string().required().oneOf(typeOf),
});
export default roomFormValidationSchema;
