import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import cors from "cors";
import fs from "fs/promises";
import mongoose from "mongoose";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";
import * as resolvers from "./resolvers/index.js";
import path from "path";
import { jwtAuth } from "./middlewares/jwtAuth.js";

const app = express();

app.use(cors(), express.json(), jwtAuth);

// schema path
const schemaPath = path.resolve("schemas");

// read all file .graphql in folder schema and merge them
const files = await fs.readdir(schemaPath);

const graphqlFiles = files.filter((file) => file.endsWith(".graphql"));

const filesContent = await Promise.all(
  graphqlFiles.map(async (file) => {
    const fileData = await fs.readFile(path.join(schemaPath, file), "utf-8");
    return fileData;
  })
);

const typeDefs = filesContent.join("");

const server = new ApolloServer({
  typeDefs: [...scalarTypeDefs, typeDefs],
  resolvers: [scalarResolvers, ...Object.values(resolvers)],
  nodeEnv: process.env.NODE_ENV || "development",
});

await server.start();

app.use(
  process.env.GRAPHQL_ENDPOINT,
  apolloMiddleware(server, {
    context: ({ req }) => {
      if (req.user) {
        return {
          user: req.user,
        };
      }
    },
  })
);

await mongoose.connect(process.env.MONGODB_URI);
console.log("🏁 Connected to MongoDB!");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server started http://localhost:${PORT}${process.env.GRAPHQL_ENDPOINT}`
  );
});
