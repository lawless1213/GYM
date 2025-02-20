import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";

const app = express();
app.use(cors());

const server = new ApolloServer({ typeDefs, resolvers });

export async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
}

export default app;