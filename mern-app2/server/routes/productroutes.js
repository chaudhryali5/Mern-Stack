import express from 'express'
import { createProduct, deleteProductById, getAllProducts, updateProductById } from '../controllers/products.js'

const productRoutes = express.Router()
productRoutes.get('/products', getAllProducts)
productRoutes.post('/products/create', createProduct)
productRoutes.put('/products/update/:id',updateProductById)
productRoutes.delete('/products/delete/:id', deleteProductById)

export default productRoutes