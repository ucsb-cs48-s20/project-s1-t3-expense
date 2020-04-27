import React, { useState } from "react";

function AddBill() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState(0.0);

  return (
    <>
      <h3>Add new bill</h3>
      <form>
        <div>
          <h4>Text</h4>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter name of expense..."
          />
        </div>
        <div>
          <h4>Amount</h4>
          ${" "}
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
          />
        </div>
        <button>Add Bill</button>
      </form>
    </>
  );
}

export default AddBill;
