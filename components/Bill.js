import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

function Bill(props) {
  const { deleteBill } = useContext(GlobalContext);

  return (
    <li>
      {props.bill.text} <span>${props.bill.amount}</span>
      <button onClick={() => deleteBill(props.bill.id)}>x</button>
    </li>
  );
}

export default Bill;
