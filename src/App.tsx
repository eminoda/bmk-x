// import "./App.css";
import "@/styles/global.less";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLink from "./routes/AppLink";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLink />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
