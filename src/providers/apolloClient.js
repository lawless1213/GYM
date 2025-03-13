import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getToken } from "../firebase/functions";
import { createUploadLink } from 'graphql-upload';

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();
  
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const uploadLink = createUploadLink({
  uri: import.meta.env.VITE_FIREBASE_GRAPH_URL,
});

// Налаштування Apollo Client
const client = new ApolloClient({
  link: authLink.concat(uploadLink), // Додаємо автентифікаційний лінк до лінка для завантаження файлів
  cache: new InMemoryCache(),
});

export default client;
