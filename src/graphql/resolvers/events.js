import { dateToString } from "../../helpers/date.js";
import EventModel from "../../../models/events.js";
import UserModel from "../../../models/users.js";
import { transformEvent } from "./merge.js";

const eventResolver = {
  events: async () => {
    try {
      // const events = await EventModel.find().populate("creator"); //populate is a mongoose method that allows us to populate the creator field with the user data
      const events = await EventModel.find();
      return events.map((event) => {
        return transformEvent(event); // DRY principle - we can use the same function to transform the data
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  createEvent: async (args, req) => {
    try {
      // ! this if statement is to check if the user is logged in. It is the "CheckAuth" middleware
      if (!req.isAuthenticated) {
        // if not authenticated we cannot create an event
        throw new Error("You must be logged in to perform this action");
      }
      const event = await new EventModel({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price, // making a floating number
        date: dateToString(args.eventInput.date),
        creator: "62759eeec86cfa4765951ec5",
      });
      const result = await event.save();
      let createdEvent = transformEvent(result); // DRY principle - we can use the same function to transform the data
      const creator = await UserModel.findById(event.creator);
      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdEvents.push(event); // updating the user table after the event is created "createdEvents.push()" is a mongoose method
      await creator.save();

      return createdEvent;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};
export default eventResolver;
