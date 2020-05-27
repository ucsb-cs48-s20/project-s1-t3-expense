import validateForm from "../utils/validateForm";

describe("util/validateForm", () => {
  describe("validateForm", () => {
    it("returns an empty object", () => {
      expect(validateForm("Grocery", "Apple and Banana")).toEqual({});
    });
    it("returns an object with error message when first parameter is empty", () => {
      expect(validateForm("", "Apple and Banana")).toEqual({
        title: "Title is required",
      });
    });
    it("returns an object with error message when second parameter is empty", () => {
      expect(validateForm("Grocery", "")).toEqual({
        description: "Description is required",
      });
    });
    it("returns an object with error messaage when the second parameter's length > 200", () => {
      expect(
        validateForm(
          "Grocery",
          "Apple, Banana, Strawberry, Apple, Banana, Strawberry, Apple, Banana, Strawberry, " +
            "Apple, Banana, Strawberry, Apple, Banana, Strawberry, Apple, Banana, Strawberry, " +
            "Apple, Banana, Strawberry, Apple, Banana "
        )
      ).toEqual({
        description: "Description must be less than 200 characters",
      });
    });
    it("returns an object with error message when the first parameter's length > 40", () => {
      expect(
        validateForm("Grocery, Grocery, Grocery, Grocery, Grocery", "Apple")
      ).toEqual({ title: "Title must be less than 40 characters" });
    });
  });
});
