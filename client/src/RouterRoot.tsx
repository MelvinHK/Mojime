import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import Error from './pages/Error.tsx';
import Root from './Root.tsx';
import Home from './pages/Home.tsx';

import './styles/index.css'
import './styles/components.css'
import './styles/attributes.css'
import WatchLayout from './pages/WatchLayout.tsx';
import Privacy from './pages/Privacy.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Root routeError={<Error />} />, // errorElement passed as a prop in order to maintain page layout.
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/privacy",
        element: <Privacy />
      },
      {
        path: ":animeId/:episodeNoParam",
        element: <WatchLayout />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>,
)
