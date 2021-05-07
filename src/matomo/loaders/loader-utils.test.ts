import { normalizeRequestDate } from "./loader-utils";

describe("normalizeRequestDate", () => {
  it("should return a valid date string with an array of dates", () => {
    // Given
    const dateRange: [string, string] = ["yesterday", "today"];
    const expectedResult = "yesterday,today";
    // When
    const normalizedDate = normalizeRequestDate(dateRange);
    // Then
    expect(normalizedDate).toEqual(expectedResult);
  });

  it("should return a valid date string with a single date", () => {
    expect(normalizeRequestDate("yesterday")).toEqual("yesterday");
  });
});
