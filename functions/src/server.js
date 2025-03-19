import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { verifyToken } from "./firebase.js";

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
  context: async ({ req }) => {
    try {
      // Перевіряємо токен і отримуємо користувача
      const user = await verifyToken(req);
      
      // Якщо токен валідний, повертаємо тільки необхідні дані користувача
      if (user) {
        const userContext = {
          uid: user.uid,
          email: user.email,
          name: user.name,
        };
        return { user: userContext };
      }
      
      // Якщо токен невалідний або відсутній, повертаємо порожній контекст
      return { user: null };
    } catch (error) {
      console.error("❌ Помилка створення контексту:", error);
      return { user: null };
    }
  },
});

export async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
}

export default app;