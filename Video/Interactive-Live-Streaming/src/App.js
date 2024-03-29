import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Prejoin from "./Prejoin";
import InCall from "./InCall";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Prejoin />,
    },
    {
      path: "in-call",
      element: <InCall />,
    },
  ]);

  return (
    <ThemeProvider theme={darkTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
