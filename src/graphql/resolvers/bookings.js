import BookingModel from "../../../models/bookings.js";
import EventModel from "../../../models/events.js";
import { transformBooking, transformEvent } from "./merge.js";

const bookingResolver = {
  bookings: async (args) => {
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
  bookEvent: async (args) => {
    try {
      const fetchedEvent = await EventModel.findOne({ _id: args.eventId });
      const booking = new BookingModel({
        user: "62759eeec86cfa4765951ec5",
        event: fetchedEvent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  cancelBooking: async (args) => {
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
