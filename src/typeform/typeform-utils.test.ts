import { sanitizeData } from "./typeform-utils";

describe("typeform-utils", () => {
  describe("sanitizeData", () => {
    it("should return rating and opinion", () => {
      const items = [
        {
          answers: [
            { field: { type: "rating" }, number: 3 },
            { field: { type: "opinion_scale" }, number: 7 },
            { field: { type: "whatever" }, number: 7 },
          ],
        },
        {
          answers: [
            { field: { type: "rating" }, number: 4 },
            { field: { type: "opinion_scale" }, number: 9 },
            { field: { type: "whatever" }, number: 7 },
          ],
        },
      ];
      const sanitizedData = sanitizeData(items);
      const expectedResult = [
        {
          label: "rating",
          value: 3.5,
        },
        {
          label: "recommendation",
          value: 80,
        },
      ];
      expect(sanitizedData).toEqual(expectedResult);
    });
  });
});
