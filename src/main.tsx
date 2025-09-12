// import { StrictMode } from 'react'
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
import Escolas from './pages/Escolas.tsx'
import Turmas from './pages/Turmas.tsx'
import Alunos from './pages/Alunos.tsx'
import Avaliacoes from './pages/Avaliacoes.tsx'
import { reg } from './components/graficos/RegistrarGraficos.tsx'
import RankingDeAlunos from './pages/RankingDeALunos.tsx'
import RankingDeEscolas from './pages/RankingDeEscolas.tsx'
const clientQuery = new QueryClient()
const browser = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/Dashboard",
    element: <Dashboard />
  },
  {
    path: "/Realizar",
    element: <Realizar />
  },
  {
    path: "/Escolas",
    element: <Escolas />
  },
  {
    path : "Usuarios",
    element : <Usuarios/>
  },
  {
    path : "Turmas",
    element : <Turmas/>
  },
  {
    path : "Alunos",
    element : <Alunos/>
  },
  {
    path : "Avaliações",
    element : <Avaliacoes/>
  },
  {
    path : "ranking-de-alunos",
    element : <RankingDeAlunos/>
  },
  {
    path : "ranking-de-escolas",
    element : <RankingDeEscolas/>
  },
  
])
reg()
createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={clientQuery}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
      <RouterProvider router={browser} />
    </QueryClientProvider>
)
