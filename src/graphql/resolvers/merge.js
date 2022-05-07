import UserModel from "../../models/users.js";
import EventModel from "../../models/events.js";
import { dateToString } from "../../helpers/date.js";

export const transformEvent = (event) => {
  // DRY principle
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator), // this is a function that returns the user object. binding to the user function
  };
};

const events = async (eventIds) => {
  // This function is called when we call the user.createdEvents property. It is passed the eventIds array. This function is binded to the User function
  const events = await EventModel.find({ _id: { $in: eventIds } }); // $in is a mongo operator that allows us to query for an array of ids
  return events.map((event) => {
    return transformEvent(event);
  });
};

const user = async (userId) => {
  try {
    if (userId) {
      const user = await UserModel.findById(userId);

      return {
        ...user._doc,
        password: null,
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
      // return { ...user, createdEvents: events.bind(this, user.createdEvents) };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error finding user");
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await EventModel.findById(eventId);
    return transformEvent(event);
  } catch (error) {
    console.log(error);
    throw new Error("Error finding event");
  }
};

export const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};
