export const equalCostPerMemberString = (dollarAmount, groupSize) => {
  const costPerMember = (dollarAmount / groupSize).toFixed(2);
  return groupSize > 0 ? costPerMember : "";
};

export const calculateRemainingAmount = (remainingAmount, members) => {
  members.forEach((member) => {
    remainingAmount = remainingAmount - member.cost;
  });
  return remainingAmount.toFixed(2);
};
