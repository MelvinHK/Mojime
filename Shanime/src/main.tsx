import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Home from './pages/Home.tsx';
import Watch from './pages/Watch.tsx';

import './styles/index.css'
import './styles/components.css'
import './styles/attributes.css'

const router = createBrowserRouter(
  createRoutesFromElements(<>
    <Route path='/' element={<Home />} />
    <Route path='/watch/:id' element={<Watch />} />
  </>)
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
