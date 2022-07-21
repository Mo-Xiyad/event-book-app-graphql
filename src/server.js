import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql"; //middleware function
import mongoose from "mongoose";
import cors from "cors";

import graphQlRootResolvers from "./graphql/resolvers/index.js";
import graphQlSchemas from "./graphql/schema/index.js";
import checkAuth from "./middleware/is_Auth.js";

const app = express();
let PORT = 3001 || process.env.PORT;

const whitelist = [process.env.FE_LOCAL_URL, process.env.FE_PROD_URL];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("CURRENT ORIGIN AT:", origin);
    // if (whitelist.indexOf(origin) !== -1) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
// app.use(bodyParser.json()); // same as express.json()

// configure app to use bodyParser()
// this will let us get the data from a POST
// exclusing the route to graphql
app.use(bodyParser.text({ type: "application/graphql" }));

app.use(checkAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchemas,
    //RootValue points to all the resolver functions
    rootValue: graphQlRootResolvers,
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
