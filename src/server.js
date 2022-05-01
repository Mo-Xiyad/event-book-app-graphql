import express from "express";
import bodyParser from "body-parser";

const app = express();

let PORT = 3001 || process.env.PORT;

app.use(express.json());
app.use(bodyParser.json()); // same as express.json()

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
