import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql"; //middleware function
import { buildSchema } from "graphql";
import mongoose from "mongoose";
import EventModel from "../models/events.js";
import UserModel from "../models/users.js";
import bcrypt from "bcrypt";

const app = express();

let PORT = 3001 || process.env.PORT;

app.use(express.json());
// app.use(bodyParser.json()); // same as express.json()

const events = async (eventIds) => {
  // This function is called when we call the user.createdEvents property. It is passed the eventIds array. This function is binded to the User function
  const events = await EventModel.find({ _id: { $in: eventIds } }); // $in is a mongo operator that allows us to query for an array of ids
  return events.map((event) => {
    return {
      ...event._doc,
      creator: user.bind(this, event.creator), // this is a function that returns the user object. binding to the user function
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
        createdEvents: events.bind(this, user._doc.createdEvents.toString()),
      };
      // return { ...user, createdEvents: events.bind(this, user.createdEvents) };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error finding user");
  }
};
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }
  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }
  input UserInput {
    email: String!
    password: String!
  }

  type RootQuery {
    events: [Event!]!
    users: [User!]!
  }

  type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
  }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    //RootValue points to all the resolver functions
    rootValue: {
      events: async () => {
        try {
          // const events = await EventModel.find().populate("creator"); //populate is a mongoose method that allows us to populate the creator field with the user data
          const events = await EventModel.find();
          return events.map((event) => {
            return { ...event, creator: user.bind(this, event.creator) };
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
          await event.save();
          const user = await UserModel.findById(event.creator);
          if (!user) {
            throw new Error("User not found");
          }
          user.createdEvents.push(event);
          await user.save();
          return event;
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
          args.userInput.password = await bcrypt.hash(
            args.userInput.password,
            12
          ); // hashing the password
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
    },
    graphiql: true,
  })
);

mongoose.connect(process.env.MONGO_DB_URL);

mongoose.connection.on("connected", () => {
  console.log("📊 Mongo Connected❗️");
  app.listen(PORT, () => {
    console.log(
      `Server is running on 📍:  http://localhost:${PORT}/graphql 🚀`
    );
  });
});

mongoose.connection.on("error", (error) => {
  console.log(`Error on connection 💣`, error);
});
