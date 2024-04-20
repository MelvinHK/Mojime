import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Home from './pages/Home.tsx';

import './index.css'
import './main.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Home />} />
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
