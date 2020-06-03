//Assume that dollarAmount is in cents
//Returns the costPerMember in terms of cents
export const equalCostPerMemberString = (dollarAmount, groupSize) => {
  const costPerMember = Math.floor(dollarAmount / groupSize);
  return groupSize > 0 ? costPerMember : "";
};

//Assume that remainingAmount and member.cost is in cents
//Returns the remainingAmount in terms of cents
export const calculateRemainingAmount = (remainingAmount, members) => {
  members.forEach((member) => {
    remainingAmount = remainingAmount - member.cost;
  });
  return remainingAmount;
};
