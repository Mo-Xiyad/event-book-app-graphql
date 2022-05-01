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
  }
  type User {
    _id: ID!
    email: String!
    password: String
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
    rootValue: {
      //points to all the resolver functions
      events: async () => {
        return await EventModel.find()
          .then((events) => {
            console.log(...events);
            return events;
            // return events.map((event) => { // leave out all the meta data from the mongoose object collection we get collection
            //   return { ...event._doc , _id: event.id }; // this ID is translated by mongoose to an string
            // });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createEvent: async (args) => {
        const event = await new EventModel({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price, // making a floating number
          date: new Date(args.eventInput.date),
        });
        return await event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc, _id: result._id.toString() }; // work around for the mongoose object to string conversion
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createUser: async (args) => {
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
