import functions from "firebase-functions";
import app, { startServer } from "./src/server.js";

startServer();

export const graphql = functions.https.onRequest(app);