import React from 'react'
import { createBrowserRouter } from 'react-router'
import App from '../App'

const userRouter = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        {index: true, }
    ]
}])
function AppRoutes() {
  return (
    <div>AppRoutes</div>
  )
}

export default AppRoutes