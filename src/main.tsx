import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'virtual:uno.css'
import 'primereact/resources/themes/lara-light-blue/theme.css' // Tema
import 'primereact/resources/primereact.min.css'               // Core
import 'primeicons/primeicons.css'                             // Ícones

import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'
import Realizar from './pages/Realizar.tsx'
import Usuarios from './pages/Usuarios.tsx'
const client = new QueryClient()
const browser = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/",
    element: <App />
  },
  {
    path: "/realizar",
    element: <Realizar />
  },
  {
    path: "/realizar",
    element: <Realizar />
  },
  {
    path : "usuarios",
    element : <Usuarios/>
  }
  
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
      <RouterProvider router={browser} />
    </QueryClientProvider>
  </StrictMode >
)
