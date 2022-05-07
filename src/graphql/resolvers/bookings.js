import BookingModel from "../../models/bookings.js";
import EventModel from "../../models/events.js";
import { transformBooking, transformEvent } from "./merge.js";

const bookingResolver = {
  bookings: async (args, req) => {
    // ! this if statement is to check if the user is logged in. It is the "CheckAuth" middleware
    if (!req.isAuthenticated) {
      // console.log(req);
      // if not authenticated we cannot create an event
      throw new Error("You must be logged in to get the bookings information");
    }
    try {
      const bookings = await BookingModel.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  bookEvent: async (args, req) => {
    // ! this if statement is to check if the user is logged in. It is the "CheckAuth" middleware
    if (!req.isAuthenticated) {
      // if not authenticated we cannot create an event
      throw new Error("You must be logged in to perform this action");
    }
    try {
      const fetchedEvent = await EventModel.findOne({ _id: args.eventId });
      const booking = new BookingModel({
        user: req.userId,
        event: fetchedEvent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  cancelBooking: async (args, req) => {
    // ! this if statement is to check if the user is logged in. It is the "CheckAuth" middleware
    if (!req.isAuthenticated) {
      // if not authenticated we cannot create an event
      throw new Error("You must be logged in to perform this action");
    }
    try {
      const booking = await BookingModel.findById(args.bookingId).populate(
        "event"
      );
      await BookingModel.deleteOne({ _id: args.bookingId });
      return transformEvent(booking.event); // DRY principle - we can use the same function to transform the data
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};
export default bookingResolver;
