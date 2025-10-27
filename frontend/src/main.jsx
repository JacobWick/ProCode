import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import theme from './theme'
import App from './App.jsx'
import {ChakraProvider} from "@chakra-ui/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ChakraProvider theme={theme}>
      <App></App>
  </ChakraProvider>
  </StrictMode>,
)
