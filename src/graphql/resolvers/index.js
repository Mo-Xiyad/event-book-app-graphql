import EventModel from "../../../models/events.js";
import UserModel from "../../../models/users.js";
import bcrypt from "bcrypt";

const events = async (eventIds) => {
  // This function is called when we call the user.createdEvents property. It is passed the eventIds array. This function is binded to the User function
  const events = await EventModel.find({ _id: { $in: eventIds } }); // $in is a mongo operator that allows us to query for an array of ids
  return events.map((event) => {
    return {
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      creator: user.bind(this, event._doc.creator), // this is a function that returns the user object. binding to the user function
    };
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

const graphQlResolvers = {
  events: async () => {
    try {
      // const events = await EventModel.find().populate("creator"); //populate is a mongoose method that allows us to populate the creator field with the user data
      const events = await EventModel.find();
      return events.map((event) => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  createEvent: async (args) => {
    try {
      const event = await new EventModel({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price, // making a floating number
        date: new Date(args.eventInput.date),
        creator: "626ebc5f7fff293520e8f332",
      });
      const savedEvent = await event.save();
      const eventCreatedUser = await UserModel.findById(event.creator);
      if (!eventCreatedUser) {
        throw new Error("User not found");
      }
      eventCreatedUser.createdEvents.push(event); // updating the user table after the event is created "createdEvents.push()" is a mongoose method
      await eventCreatedUser.save();
      return {
        ...savedEvent._doc,
        date: new Date(savedEvent._doc.date).toISOString(),
        creator: user.bind(this, savedEvent._doc.creator),
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  createUser: async (args) => {
    try {
      if (await UserModel.findOne({ email: args.userInput.email })) {
        throw new Error("User already exists");
      }
      args.userInput.password = await bcrypt.hash(args.userInput.password, 12); // hashing the password
      const user = await new UserModel({
        email: args.userInput.email,
        password: args.userInput.password,
      });
      const { email, password } = await user.save();
      return { email, password: null };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
export default graphQlResolvers;
