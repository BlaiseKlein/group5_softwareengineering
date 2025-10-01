import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// CSS
import './index.css'

// Pages
import Landing from './landing.tsx'
import Login from './login.tsx'

const router = createBrowserRouter([
  {path: "/", element: <Landing />},
  {path: "/login", element: <Login />}
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
