import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Products from '../pages/Products'
import CreateProduct from '../pages/CreateProduct'
import ManageProduct from '../pages/ManageProduct'
const Routes = () => {
    const router = createBrowserRouter([
        {
            path: '/', element: <Products />
        },
        {
            path: '/create', element: <CreateProduct />
        },
        {
            path: '/manageProduct', element: <ManageProduct />
        }
    ])
    return (
        <RouterProvider router={router} />
    )
}

export default Routes