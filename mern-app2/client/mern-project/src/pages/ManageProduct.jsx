import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GET_PRODUCT, UPDATE_PRODUCT } from '../resources/api.js';
import { NavLink } from 'react-router-dom';
import DeleteProduct from '../componets/DeleteProduct.jsx';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });
  const [loading, setLoading] = useState(false);

  // Fetch products
  useEffect(() => {
     const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(GET_PRODUCT);
        console.log("Fetched products:", res.data);

        // Use the correct array field; adapt if your API returns differently
        const productList = res.data.product ?? res.data;
        setProducts(productList);
      } catch (err) {
        toast.error('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete a product
  // const handleDelete = async (e, id) => {
  //   e.preventDefault();
  //   console.log("Trying to delete product with _id:", id);
  //   if (!window.confirm('Are you sure you want to delete this product?')) {
  //     return;
  //   }

  //   try {
  //     const result = await axios.delete(`${DELETE_PRODUCT}/${id}`);
  //     console.log("Delete response:", result.data);

  //     // Remove the correct product from state
  //     setProducts(prev => {
  //       const newProducts = prev.filter(p => p._id !== id);
  //       console.log("New products after delete:", newProducts);
  //       return newProducts;
  //     });

  //     toast.success(result.data.message || 'Product deleted!');
  //   } catch (err) {
  //     toast.error('Delete failed');
  //     console.error("Delete error:", err);
  //   }
  // };

  // Start editing
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      category: product.category || '',
    });
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill all fields');
      return;
    }

    console.log("Editing product:", editingProduct._id, "with data:", formData);
    try {
      const res = await axios.put(`${UPDATE_PRODUCT}/${editingProduct._id}`, {
        ...formData,
        price: parseFloat(formData.price),
      });
      console.log("Update response:", res.data);
      const updatedProduct = res.data;
      setProducts(products.map(p => (p._id === editingProduct._id ? updatedProduct : p)));
      toast.success('Product updated!');
      setEditingProduct(null);
    } catch (err) {
      toast.error('Update failed');
      console.error("Update error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <h2 className="text-2xl text-center bg-black text-white rounded py-3 font-bold mb-4">
        Manage Your Products
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((p) => (
            <li
              key={p._id}
              className="bg-white text-black p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{p.name}</p>
                <p>${p.price}</p>
                <p>{p.category}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditClick(p)}
                  className="px-3 py-1 border border-black rounded bg-black text-white hover:bg-white hover:text-black transition"
                >
                  Edit
                </button>
     <DeleteProduct product={p} setProducts={setProducts} />

              </div>
            </li>
          ))}
        </ul>
      )}

      {editingProduct && (
        <div className="mt-6 bg-white text-black p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Edit Product</h3>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block">Name:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full p-2 bg-white text-black border border-black rounded"
              />
            </div>
            <div>
              <label className="block">Price:</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleFormChange}
                className="w-full p-2 bg-white text-black border border-black rounded"
                min="0.01"
                step="0.01"
              />
            </div>
            <div>
              <label className="block">Category:</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full p-2 bg-white text-black border border-black rounded"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 border border-black rounded bg-black text-white hover:bg-white hover:text-black transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border border-black rounded bg-black text-white hover:bg-white hover:text-black transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <NavLink to="/">
        <button className="bg-black text-white cursor-pointer py-2 px-5 rounded mt-3">
          Back
        </button>
      </NavLink>
    </div>
  );
};

export default ManageProducts;