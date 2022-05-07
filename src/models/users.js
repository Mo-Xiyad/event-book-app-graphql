import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdEvents: [
    // array of event IDs where user has created events
    {
      type: Schema.Types.ObjectId,
      ref: "Event", // this allows us to reference the Event model. thi is letting mongoose know this two models are related and to create a relationship between the two models
    },
  ],
});

export default model("User", userSchema);
