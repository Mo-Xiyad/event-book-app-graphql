import bcrypt from "bcrypt";
import UserModel from "../../../models/users.js";

const authResolver = {
  users: async (args) => {
    try {
      const users = await UserModel.find();
      return users.map((user) => {
        return {
          ...user._doc,
          password: null,
          createdEvents: events.bind(this, user._doc.createdEvents),
        };
      });
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
      const { email, password, _id } = await user.save();
      return { email, password: null, _id };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
export default authResolver;
