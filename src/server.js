import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql"; //middleware function
import { buildSchema } from "graphql";

const app = express();

let PORT = 3001 || process.env.PORT;

app.use(express.json());
// app.use(bodyParser.json()); // same as express.json()
let events = [];
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

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type RootQuery {
    events: [Event!]!
  }
  type RootMutation {
    createEvent(eventInput:EventInput): Event
  }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      //points to all the resolver functions
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        events.push(event);
        console.log(event.title);
        return event;
      },
    },
    graphiql: true,
  })
);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
