import _ from "lodash";

//Assume that dollarAmount is in cents
//Returns the costPerMember in terms of cents
export const equalCostPerMemberString = (dollarAmount, groupSize) => {
  const costPerMember = (dollarAmount / groupSize).toFixed(2);
  return groupSize > 0 ? costPerMember.toString() : "";
};

//Assume that remainingAmount and member cost is in cents
//Returns the remainingAmount in terms of cents
export const calculateRemainingAmount = (remainingAmount, members) => {
  members.forEach((member) => {
    remainingAmount = remainingAmount - member.cost;
  });
  return remainingAmount;
};

//Assume member cost is in dollars
//Returns a copy of the members array, but with the cost in terms of cents
export const convertMemberCoststoCents = (members) => {
  let membersCopy = _.cloneDeep(members);
  membersCopy.forEach((member) => {
    member.cost = Math.floor(member.cost * 100);
  });
  return membersCopy;
};

//Assume member cost is in cents
//Returns a copy of the members array, but with the cost in terms of cents
export const convertMemberCoststoDollars = (members) => {
  let membersCopy = _.cloneDeep(members);
  membersCopy.forEach((member) => {
    member.cost = (member.cost / 100).toFixed(2);
  });
  return membersCopy;
};
