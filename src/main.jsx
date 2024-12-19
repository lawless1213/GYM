import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './providers/StoreProvider';
import App from './App.jsx'

import './assets/index.scss';

import { MantineProvider } from '@mantine/core';
import { theme } from './theme';

import '@mantine/core/styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter basename='/'>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>
)
