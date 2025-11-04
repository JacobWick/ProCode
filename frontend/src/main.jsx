import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import theme from './theme'
import App from './App.jsx'
import {ChakraProvider} from "@chakra-ui/react";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <App></App>
    </BrowserRouter>
  </ChakraProvider>
  </StrictMode>,
)
