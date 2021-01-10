export const initialState = {
  msg: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SAY_HELLO":
      return {
        ...state,
        msg: [...state.msg, action.msg],
      };

    default:
      return state;
  }
};

export default reducer;
