import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Notfound from "./Components/Notfound/Notfound";
import UserContextProvider from "./Context/UserContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import PostDetails from "./Components/PostDetails/PostDetails"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute"
import GuestRoute from "./Components/GuestRoute/GuestRoute"

const query = new QueryClient() 

function App() {

  let routes = createBrowserRouter([
      {path: "" , element: <ProtectedRoute><Layout /></ProtectedRoute> , children: [
        {index: true , element: <Home />},
        {path: "postdetails/:id" , element: <PostDetails />},
        {path: "profile" , element: <Profile />},
        {path: "*" , element: <Notfound />},
      ]},
      {path: "" , element: <GuestRoute><Layout /></GuestRoute> , children: [
        {path: "login" , element: <Login />},
        {path: "register" , element: <Register />},
        {path: "*" , element: <Notfound />},
      ]}
    ])

  return (
    <>
      <UserContextProvider>
        <QueryClientProvider client={query}>
          <RouterProvider router={routes}></RouterProvider>
          <Toaster />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </UserContextProvider>
    </>
  )
}

export default App
