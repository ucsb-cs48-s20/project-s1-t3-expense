import { equalCostPerMemberString } from "../utils/calculations";

describe("util/calculations", () => {
  describe("equalCostPerMemberString", () => {
    it("calculates the average cost per member", () => {
      expect(equalCostPerMemberString(10, 2, ["member1", "member2"])).toBe("5");
    });
    it("returns empty string when the number members <= 0", () => {
      expect(equalCostPerMemberString(10, 0, [])).toBe("");
    });
  });
});
