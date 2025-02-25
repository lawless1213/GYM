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
    console.log("📥 Запит у `context`, заголовки:", req.headers);

    // Перевірка токена і отримання користувача
    const user = await verifyToken(req);
    
    // Якщо токен валідний, повертаємо тільки необхідні дані користувача
    if (user) {
      // Створюємо об'єкт користувача для контексту, що містить лише важливі дані
      const userContext = {
        uid: user.uid,
        email: user.email,
        name: user.name,  // Якщо name зберігається в токені
        // додайте інші необхідні поля
      };
      
      console.log("🟢 Отриманий користувач у `context`:", userContext); // Лог користувача з важливими даними
      return { user: userContext };
    } else {
      console.error("❌ Не вдалося верифікувати токен.");
      return { user: null };
    }
  },
});



export async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
}

export default app;