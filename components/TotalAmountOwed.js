function TotalAmountOwed(props) {
  let TotalAmount = 0;
  props.activeBills?.map((bill) => {
    bill.members.map((member) => {
      if (member.email == props.user.email)
        TotalAmount = TotalAmount + member.cost;
    });
  });

  return <h1>You owe: ${(TotalAmount / 100).toFixed(2)}</h1>;
}

export default TotalAmountOwed;
