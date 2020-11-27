import * as yup from "yup";
import moment from "moment";

let today = new Date().toLocaleDateString();
const typeOf = ["OTA", "IO", "RO"];
let eventValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  isScheduled: yup.boolean(),
  typeOf: yup.string().required().oneOf(typeOf),
  schedules: yup.array().when("isScheduled", {
    is: true,
    then: yup
      .array()
      .required()
      .of(
        yup.object().shape({
          date: yup
            .date()
            .required("This date is required if you set schedule to true")
            .min(today)
            .label("This date")
            .test(
              "checks-date-lists",
              "Make sure any schedule date does not come before its preceding schedule dates",
              function (value) {
                const { schedules } = this.from[1].value;
                for (let i = 0; i < schedules.length; i++) {
                  if (
                    i > 0 &&
                    moment(schedules[i].date).isBefore(
                      moment(schedules[i - 1].date)
                    )
                  ) {
                    return false;
                  }
                }
                return true;
              }
            ),
          timeStartsAt: yup
            .string()
            .label("This time")
            .required("This time is required if you set schedule to true")
            .test(
              "time-passed",
              "if you set the schedule for today then time should be equal to or greater than current time",
              function (value) {
                const { date } = this.parent;
                if (
                  value &&
                  date &&
                  moment(date).isSame(moment(), "day") &&
                  moment(value, "HH:mm").isBefore(moment())
                ) {
                  return false;
                }
                return true;
              }
            ),
          timeEndsAt: yup
            .string()
            .required("This time is required if you set schedule to true")
            .test("is-greater", "end time should be greater", function (value) {
              const { timeStartsAt } = this.parent;
              return moment(value, "HH:mm").isSameOrAfter(
                moment(timeStartsAt, "HH:mm")
              );
            }),
        })
      ),
    otherwise: yup.array().notRequired(),
  }),
});
export default eventValidationSchema;
