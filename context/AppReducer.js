export default (state, action) => {
  switch (action.type) {
    case "DELETE_BILL":
      return {
        ...state,
        bills: state.bills.filter((bill) => bill.id !== action.payload),
      };

    case "ADD_BILL":
      return {
        ...state,
        bills: [action.payload, ...state.bills],
      };

    default:
      return state;
  }
};
