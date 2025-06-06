import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './providers/StoreProvider';
import { ModalsProvider } from '@mantine/modals';
import './firebase/firebase';
import App from './App.jsx';
import { AuthModal, ExerciseModal, WorkoutModal } from './modals';
import { AuthProvider } from './stores/context/AuthContext.jsx';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { ApolloProvider } from '@apollo/client';
import client from './providers/apolloClient.js';
import './locales/i18n.js';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import './assets/index.scss';
import '@mantine/charts/styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ApolloProvider client={client}>
        <StoreProvider>
          <BrowserRouter basename='/'>
            <MantineProvider theme={theme} defaultColorScheme="dark">
                <ModalsProvider
                  modals={
                    { 
                      auth: AuthModal, 
                      exercise: ExerciseModal, 
                      workout: WorkoutModal,
                    }
                  }
                >
                  <App/>
                </ModalsProvider>
            </MantineProvider>
          </BrowserRouter>
        </StoreProvider>
      </ApolloProvider>
    </AuthProvider>
  </StrictMode>
)
