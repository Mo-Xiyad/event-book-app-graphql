export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN";
export const LOG_OUT_USER = "LOG_OUT_USER";

export const setTokens = (userAuthInfo) => ({
  type: SET_AUTH_TOKEN,
  payload: userAuthInfo, // this is the payload that is being sent to the reducer as a object
});
