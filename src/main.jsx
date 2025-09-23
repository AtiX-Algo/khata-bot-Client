import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

// Import Layout and Pages
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
// import TextTest from './components/Gemini/TextTest.jsx';
// Define the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // The layout wraps all pages
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      // {
      //   path: "/text",
      //   element: <TextTest></TextTest>,
      // },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div data-theme="cupcake">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>,
)