import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import Todo from "../models/todo.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const userResolvers = {
  Mutation: {
    register: async (_, { input: { name, email, age, password } }) => {
      const user = new User({ name, email, age, password });
      const salt = bcrypt.genSaltSync(12);
      user.password = bcrypt.hashSync(password, salt);
      await user.save();
      return user;
    },
    login: async (_, { input: { email, password } }, context) => {
      const user = await User.findOne({ email });
      if (!user) throw new GraphQLError("User not found!");

      const valid = bcrypt.compareSync(password, user.password);

      if (!valid) throw new GraphQLError("Invalid password!");

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d", // can create variable in .env
      });

      return {
        token,
      };
    },
  },
  User: {
    todos: async (parent) => {
      const todos = await Todo.find({ userId: parent._id });
      return todos;
    },
  },
};

export { userResolvers };
