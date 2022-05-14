import { SET_AUTH_TOKEN, LOG_OUT_USER } from "../actions";
import { initialState } from "../store";

// the reducer's job is ALWAYS to return a valid state for the application
// the SHAPE of the state you're supposed to return from every case is the SAME
// as the initialValue you're providing to it

// a PURE FUNCTION never mutates its arguments

const authReducer = (state = initialState.auth, action) => {
  switch (action.type) {
    case SET_AUTH_TOKEN:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        tokenExpiration: action.payload.tokenExpiration,
      };
    case LOG_OUT_USER:
      return {
        ...state,
        token: null,
        userId: null,
        tokenExpiration: null,
      };
    default:
      return state;
  }
};

export default authReducer;
