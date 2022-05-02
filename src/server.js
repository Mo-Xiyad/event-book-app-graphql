import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql"; //middleware function
import mongoose from "mongoose";

import graphQlResolvers from "./graphql/resolvers/index.js";
import graphQlSchemas from "./graphql/schema/index.js";

const app = express();

let PORT = 3001 || process.env.PORT;

app.use(express.json());
// app.use(bodyParser.json()); // same as express.json()

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchemas,
    //RootValue points to all the resolver functions
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

mongoose.connect(process.env.MONGO_DB_URL);

mongoose.connection.on("connected", () => {
  const { bookings, users, events } = mongoose.connection.collections;
  // users.drop();
  // bookings.drop();
  // events.drop();
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
