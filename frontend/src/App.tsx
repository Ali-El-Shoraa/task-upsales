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

function App() {
  return <RouterProvider router={router} />;
}

export default App;
