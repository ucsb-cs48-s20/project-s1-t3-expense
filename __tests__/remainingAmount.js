import calculateRemainingAmount from "../utils/remainingAmount";

describe("util/remainingAmount", () => {
  describe("calculateRemainingAmount", () => {
    it("calculate the remaining amount after subtracting the cost of each member", () => {
      const members = [{ cost: 2 }, { cost: 5 }];
      expect(calculateRemainingAmount(10, members)).toBe(3);
    });
  });
});
