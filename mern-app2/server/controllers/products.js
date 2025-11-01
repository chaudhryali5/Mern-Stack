// controllers/productController.js
import Product from '../models/productScehma.js';  // adjust path as needed

// GET all products
export const getAllProducts = async (req, res) => {
  const product = await Product.find()
  return res.send({ status: true, product })
};

// CREATE a product
export const createProduct = async (req, res) => {
  const product = req.body||{}

  if (!product.name || !product.price || !product.category) {
    return res.status(400).send({
      status: false,
      message: "Missing required fields: name, price, or category"
    });
  }

  try {
    const newProduct = await Product.create(product)
      
    if (!newProduct) {
      return res.status(500).send({
        status: false,
        message: "Product creation failed",
      });
    }
    return res.send({
      status: true,
      message: "Product created successfully",
      newProduct
    });
  } catch (error) {
    console.error("createProduct error:", error);
    return res.status(500).send({
      status: false,
      message: "Something went wrong!"
    });
  }
};

//UPDATE a product by its id
export const updateProductById = async (req, res) => {
  const id = req.params.id;
  const product = req.body;
if (!product.name && !product.price && !product.category) {
  return res.send({ status: false, message: "No data to update" });
}

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      product,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.send({ status: false, message: "product is missing", updatedProduct });
    }

    return res.send({ status: true, message: "product updated successfully", updatedProduct });
  } catch (error) {
    return res.send({ status: false, message: "something went wrong !", error });
  }
};

// DELETE a product by its id (string form)
export const deleteProductById = async (req, res) => {
 const id=req.params.id;

try {
  const deletedProduct=await Product.findByIdAndDelete(id)
  if(!deletedProduct){
    res.send({status:false,message:"Product is not deleted",id})
  }
res.send({status:true,message:"Product is deleted successfully",id})
} catch (error) {
  res.send({status:false,message:"something went wrong!",error})
}
};
