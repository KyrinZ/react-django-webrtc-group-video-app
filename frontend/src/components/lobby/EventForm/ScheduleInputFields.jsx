import React, { Component } from "react";
import { FieldArray } from "formik";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import FormikUIField from "../../authentication/FormikUIField";

class ScheduleInputFields extends Component {
  render() {
    return (
      <FieldArray name={this.props.name}>
        {(arrayHelpers) => (
          <>
            {this.props.schedules && this.props.schedules.length > 0 ? (
              <>
                {this.props.schedules.map((schedule, index) => (
                  <Grid
                    key={index}
                    container
                    direction="row"
                    justify="space-around"
                  >
                    <FormikUIField
                      label="Schedule date"
                      type="date"
                      name={`${this.props.name}[${index}].date`}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <FormikUIField
                      label="Start"
                      type="time"
                      name={`${this.props.name}[${index}].timeStartsAt`}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <FormikUIField
                      label="End"
                      type="time"
                      name={`${this.props.name}[${index}].timeEndsAt`}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <Grid>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          if (this.props.schedules.length > 1) {
                            arrayHelpers.remove(index);
                          }
                        }}
                      >
                        -
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </>
            ) : null}

            <Grid container direction="row" justify="center">
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={() =>
                  arrayHelpers.insert(this.props.schedules.length, {
                    date: "",
                    timeStartsAt: "",
                    timeEndsAt: "",
                  })
                }
              >
                Add Schedule
              </Button>
            </Grid>
          </>
        )}
      </FieldArray>
    );
  }
}

export default ScheduleInputFields;
