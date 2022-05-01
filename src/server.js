import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql"; //middleware function
import { buildSchema } from "graphql";

const app = express();

let PORT = 3001 || process.env.PORT;

app.use(express.json());
// app.use(bodyParser.json()); // same as express.json()

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
  type RootQuery {
    events: [String!]!
  }
  type RootMutation {
    createEvent(name: String!): String
  }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      //points to all the resolver functions
      events: () => {
        return ["event1", "event2"];
      },
      createEvent: (args) => {
        return `event created: ${args.name}`;
      },
    },
    graphiql: true,
  })
);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
