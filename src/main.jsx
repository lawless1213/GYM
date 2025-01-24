import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './providers/StoreProvider';
import { ModalsProvider } from '@mantine/modals';
import './firebase/firebase';
import App from './App.jsx';
import { AuthModal, CreateExerciseModal } from './modals';
import { AuthProvider } from './stores/context/AuthContext.jsx';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';

import '@mantine/core/styles.css';
import './assets/index.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter basename='/'>
          <MantineProvider theme={theme}>
              <ModalsProvider
                modals={{ auth: AuthModal, create: CreateExerciseModal }}
              >
                <App/>
              </ModalsProvider>
          </MantineProvider>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  </StrictMode>
)
