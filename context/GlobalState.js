import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  bills: [],
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  function deleteBill(id) {
    dispatch({
      type: "DELETE_BILL",
      payload: id,
    });
  }

  function addBill(bill) {
    dispatch({
      type: "ADD_BILL",
      payload: bill,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        bills: state.bills,
        deleteBill,
        addBill,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
