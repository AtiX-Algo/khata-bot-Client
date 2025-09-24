// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Import Layout and Pages
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
// import TextTest from './components/Gemini/TextTest.jsx';
import History from './pages/History.jsx'; // 👈 Import History page
import { AuthProvider } from './contexts/AuthProvider.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // 👈 Import ProtectedRoute
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

// Define the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/dashboard", // 👈 ADD THIS ROUTE
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        ), // 👈 Protected route
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
    <AuthProvider>
      <div data-theme="cupcake">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </React.StrictMode>
);
