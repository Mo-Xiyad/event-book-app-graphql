import bcrypt from "bcrypt";
import UserModel from "../../../models/users.js";
import jwt from "jsonwebtoken";

// export const JWTAuthenticate = async (user) => {
//   // 1. given the user generates token
//   const accessToken = await generateJWTToken({ _id: user._id });
//   return accessToken;
// };

// const generateJWTToken = (payload) =>
//   new Promise((resolve, reject) =>
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET_SECRET_KEY,
//       { expiresIn: "15m" },
//       (err, token) => {
//         if (err) reject(err);
//         else resolve(token);
//       }
//     )
//   );

// export const verifyJWT = (token) =>
//   new Promise((res, rej) =>
//     jwt.verify(
//       token,
//       process.env.JWT_SECRET_SECRET_KEY,
//       (err, decodedToken) => {
//         if (err) rej(err);
//         else res(decodedToken);
//       }
//     )
//   );

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
  login: async ({ email, password }) => {
    //object destructuring to get the email and password from the "args" object
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist");
    }
    const isEqual = await bcrypt.compare(password, user.password); // comparing the password with the hashed password in the database. bcrypt.compare here comparing the password with the hashed password in the database
    if (!isEqual) {
      throw new Error("Password is incorrect");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_SECRET_KEY,
      { expiresIn: "1h" }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
export default authResolver;
