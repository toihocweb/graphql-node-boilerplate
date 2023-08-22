import { GraphQLError } from "graphql";
import Todo from "../models/todo.js";
import User from "../models/user.js";

const todoResolvers = {
  Query: {
    todos: async (_, __, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized!");
      const todos = await Todo.find({ userId: context.user._id });
      return todos;
    },
  },
  Mutation: {
    createTodo: async (_, { input: { title } }, context) => {
      const user = context.user;
      if (!user) throw new GraphQLError("User not found!");
      const todo = new Todo({
        title,
        userId: user._id,
      });
      await todo.save();
      return todo;
    },
    deleteAllTodos: async (_, __, context) => {
      await Todo.deleteMany();
      return true;
    },
  },
  Todo: {
    user: async (parent) => {
      const user = await User.findById(parent.userId);
      return user;
    },
  },
};

export { todoResolvers };
