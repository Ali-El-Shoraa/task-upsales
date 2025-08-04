/**
 * @file App.jsx - Main application component that sets up routing for the entire application
 * @description This file configures all application routes using React Router
 * @module App
 */

import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import {
  loginAction,
  logoutAction,
  registerAction,
} from "./actions/action.route";
import HomePage from "./pages/home/HomePage";
import {
  homeLoader,
  loginLoader,
  registerLoader,
} from "./loaders/loader.route";
import LayoutDefualt from "./layouts/LayoutDefualt";

/**
 * Application router configuration
 * @constant
 * @type {Array}
 * @description Defines all routes for the application with their corresponding components, loaders and actions
 * @property {Object} root - Root route that uses LayoutDefault as wrapper
 * @property {Object[]} root.children - Child routes of the root route
 * @property {Object} root.children.home - Home page route
 * @property {Object} root.children.login - Login page route
 * @property {Object} root.children.register - Registration page route
 */

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutDefualt />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
        action: logoutAction,
      },
      {
        path: "login",
        element: <LoginPage />,
        action: loginAction,
        loader: loginLoader,
      },
      {
        path: "register",
        element: <RegisterPage />,
        action: registerAction,
        loader: registerLoader,
      },
    ],
  },
]);

/**
 * Main App component
 * @function App
 * @description Root component that renders the application router
 * @returns {JSX.Element} The RouterProvider with configured router
 */
export default function App() {
  return <RouterProvider router={router} />;
}
