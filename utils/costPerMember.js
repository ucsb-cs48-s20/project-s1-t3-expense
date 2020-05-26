const equalCostPerMemberString = (dollarAmount, groupSize, members) => {
  const costPerMember = (dollarAmount / groupSize).toFixed(2);
  return members?.length > 0 ? costPerMember : "";
};

export default equalCostPerMemberString;
