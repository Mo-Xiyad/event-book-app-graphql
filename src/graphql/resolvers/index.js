import authResolver from "./auth.js";
import bookingResolver from "./bookings.js";
import eventResolver from "./events.js";

const graphQlRootResolvers = {
  ...authResolver,
  ...bookingResolver,
  ...eventResolver,
};
export default graphQlRootResolvers;
