import React, { useContext } from "react";
import Bill from "./Bill";
import { GlobalContext } from "../context/GlobalState";

function BillList() {
  const { bills } = useContext(GlobalContext);

  return (
    <>
      <h3>History</h3>
      <ul>
        {bills.map((bill) => (
          <Bill key={bill.id} bill={bill} />
        ))}
      </ul>
    </>
  );
}

export default BillList;
