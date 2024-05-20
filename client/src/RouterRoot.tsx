import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import Error from './pages/Error.tsx';
import Root from './Root.tsx';
import Home from './pages/Home.tsx';
import Watch from './pages/Watch.tsx';

import './styles/index.css'
import './styles/components.css'
import './styles/attributes.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Root rootErrorOutlet={<Error />} />, // errorElement passed as a prop in order to maintain page layout.
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/:animeId/:episodeNo",
        element: <Watch />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
