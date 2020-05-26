import equalCostPerMemberString from "../utils/costPerMember";

describe("util/costPerMember", () => {
  describe("equalCostPerMemberString", () => {
    it("calculates the average cost per member", () => {
      expect(equalCostPerMemberString(10, 2, ["member1", "member2"])).toBe(
        "5.00"
      );
    });
    it("returns empty string when the number members <= 0", () => {
      expect(equalCostPerMemberString(10, 0, [])).toBe("");
    });
  });
});
