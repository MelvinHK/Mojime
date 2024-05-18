import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import Root from './Root.tsx';
import Home from './pages/Home.tsx';
import Watch from './pages/Watch.tsx';
import Error from './pages/Error.tsx';

import './styles/index.css'
import './styles/components.css'
import './styles/attributes.css'

import { getEpisode } from './utils/provider.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Root rootErrorOutlet={<Error />} />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/:episodeID",
        element: <Watch />,
        errorElement: <Error />,
        loader: async ({ params }) => {
          return getEpisode(params.episodeID as string)
        }
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
