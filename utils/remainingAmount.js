const calculateRemainingAmount = (e, members) => {
  let remainingAmount = e;
  members.forEach((member) => {
    remainingAmount = remainingAmount - member.cost;
  });
  return remainingAmount;
};

export default calculateRemainingAmount;
