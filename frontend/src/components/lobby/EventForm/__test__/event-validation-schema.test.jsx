import eventValidationSchema from "../event-validation-schema";
import { cleanup } from "@testing-library/react";
import moment from "moment";

describe("event-validationschema-test", () => {
  afterEach(cleanup);

  class TestScheduleData {
    // Mock data for schedule for the event

    constructor(
      date = moment().add(1, "days").format("YYYY-MM-DD"),
      timeStartsAt = moment().add(1, "hours").format("HH:MM"),
      timeEndsAt = moment().add(2, "hours").format("HH:MM")
    ) {
      this.date = date;
      this.timeStartsAt = timeStartsAt;
      this.timeEndsAt = timeEndsAt;
    }
  }

  class TestEventData {
    // Mock data for Event

    constructor(
      title = "Test Title",
      description = "This is some description",
      typeOf = "OTA",
      isScheduled = true,
      schedules = [new TestScheduleData()]
    ) {
      this.title = title;
      this.description = description;
      this.typeOf = typeOf;
      this.isScheduled = isScheduled;
      this.schedules = schedules;
    }
  }

  // Function to check validation error msg
  function haveErrorMsg(eventObj, validationschemaObj) {
    let errorMessage = null;
    try {
      validationschemaObj.validateSync(eventObj);
      errorMessage = "No Errors";
    } catch (error) {
      errorMessage = error.message;
    }
    return errorMessage;
  }

  // TEST 1
  test("should check when all value is passed, no error should arise", () => {
    // Validation is expected to return 'true'
    const testEvent = new TestEventData();

    expect(haveErrorMsg(testEvent, eventValidationSchema)).toEqual("No Errors");
    expect(eventValidationSchema.isValidSync(testEvent)).toBeTruthy();
  });

  // TEST 2
  test("should check whether any two dates in an oredered list of schedule where first date should come before the second", () => {
    const scheduleForTommorrow = new TestScheduleData();
    scheduleForTommorrow.date = moment().add(1, "days").format("YYYY-MM-DD");

    const scheduleForToday = new TestScheduleData();
    scheduleForToday.date = moment().format("YYYY-MM-DD");

    const testEvent = new TestEventData();
    testEvent.schedules = [scheduleForTommorrow, scheduleForToday];

    expect(haveErrorMsg(testEvent, eventValidationSchema)).toEqual(
      "Make sure any schedule date does not come before its preceding schedule dates"
    );
    expect(eventValidationSchema.isValidSync(testEvent)).toBeFalsy();
  });

  // TEST 3
  test("whether starting time doesn't come after ending time in a schedule", () => {
    const schedule = new TestScheduleData();
    schedule.timeStartsAt = "02:00";
    schedule.timeEndsAt = "01:00";

    const testEvent = new TestEventData();
    testEvent.schedules = [schedule];

    expect(haveErrorMsg(testEvent, eventValidationSchema)).toEqual(
      "end time should be greater"
    );
    expect(eventValidationSchema.isValidSync(testEvent)).toBeFalsy();
  });

  // TEST 4
  test("if date was today the starting time cannot be before current time", () => {
    const schedule = new TestScheduleData();
    schedule.date = moment().format("YYYY-MM-DD");
    schedule.timeStartsAt = moment().subtract(1, "hours").format("HH:MM");
    schedule.timeEndsAt = moment().format("HH:MM");

    const testEvent = new TestEventData();
    testEvent.schedules = [schedule];

    expect(haveErrorMsg(testEvent, eventValidationSchema)).toEqual(
      "if you set the schedule for today then time should be equal to or greater than current time"
    );
    expect(eventValidationSchema.isValidSync(testEvent)).toBeFalsy();
  });

  // TEST 5
  test("if 'isScheduled' set to true, schedules fields should not be empty", () => {
    const testEvent = new TestEventData();
    testEvent.schedules = [];

    expect(haveErrorMsg(testEvent, eventValidationSchema)).toEqual(
      "schedules is a required field"
    );
    expect(eventValidationSchema.isValidSync(testEvent)).toBeFalsy();
  });

  // TEST 6
  test("if 'isScheduled' set to false, schedules fields should pass", () => {
    const testEvent = new TestEventData();
    testEvent.isScheduled = false;
    testEvent.schedules = [];

    expect(haveErrorMsg(testEvent, eventValidationSchema)).toEqual("No Errors");
    expect(eventValidationSchema.isValidSync(testEvent)).toBeTruthy();
  });

  // TEST 7
  test("for checking 'title' is passed or not", () => {
    const testEvent = new TestEventData();
    testEvent.title = "";

    expect(haveErrorMsg(testEvent, eventValidationSchema)).toEqual(
      "title is a required field"
    );
    expect(eventValidationSchema.isValidSync(testEvent)).toBeFalsy();
  });

  // TEST 8
  test("for checking 'typeOf' is passed or not", () => {
    const testEvent = new TestEventData();
    testEvent.typeOf = "";

    expect(haveErrorMsg(testEvent, eventValidationSchema)).toEqual(
      "typeOf must be one of the following values: OTA, IO, RO"
    );
    expect(eventValidationSchema.isValidSync(testEvent)).toBeFalsy();
  });

  // TEST 9
  test("if multiple dates is passed does 'TEST 2' result is expected", () => {
    const scheduleForToday = new TestScheduleData();
    scheduleForToday.date = moment().format("YYYY-MM-DD");

    const scheduleForTommorrow = new TestScheduleData();
    scheduleForTommorrow.date = moment().add(1, "days").format("YYYY-MM-DD");

    const scheduleForDayAfter = new TestScheduleData();
    scheduleForDayAfter.date = moment().add(2, "days").format("YYYY-MM-DD");

    const testEvent = new TestEventData();
    testEvent.schedules = [
      scheduleForDayAfter,
      scheduleForToday,
      scheduleForTommorrow,
    ];
    expect(haveErrorMsg(testEvent, eventValidationSchema)).toEqual(
      "Make sure any schedule date does not come before its preceding schedule dates"
    );
    expect(eventValidationSchema.isValidSync(testEvent)).toBeFalsy();
  });
});
