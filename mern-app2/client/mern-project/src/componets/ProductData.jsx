import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GET_PRODUCT } from '../resources/api.js';
import { FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { NavLink } from 'react-router-dom'; // Fixed: correct import

const ProductData = () => {
  const [product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(GET_PRODUCT);
        if (response.data.product) {
          setProduct(response.data.product);
          setFilteredProducts(response.data.product);
        }
      } catch (error) {
        toast.error("Something went wrong!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = product.filter((p) => {
      return p.name.toLowerCase().includes(term);
    });
    setFilteredProducts(filtered);
  }, [searchTerm, product]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>

      <div className="bg-black h-[200px] flex flex-col justify-center items-center p-4">
        <h1 className="text-4xl font-bold mb-4 text-white">Welcome to Store!</h1>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-3xl shadow-md border border-gray-400 focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
        </div>
      </div>

      <div className="flex flex-wrap gap-8 mt-8 p-4">
        {loading ? (
          <p className="text-gray-600 text-lg">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-600 text-lg">No products found.</p>
        ) : (
          filteredProducts.map((p) => ( // Removed index, use p._id
            <div
              key={p._id || Math.random()} // Fixed: use _id, fallback to random
              className="bg-white shadow-lg rounded-2xl w-[280px] p-4 relative hover:shadow-2xl transition duration-300"
            >
              <div className="w-full h-[200px] bg-gray-100 rounded-xl flex items-center justify-center">
                <img
                  src={p.image || "https://via.placeholder.com/200"}
                  alt={p.name}
                  className="object-contain h-[150px]"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-gray-700 font-semibold text-lg">{p.name}</h3>
                  <p className="text-black font-bold text-xl mt-1">${p.price}</p>
                  <p className="text-black font-medium text-xl mt-1">{p.category}</p>
                </div>
                <div>
                  <button className="text-gray-400 hover:text-red-500 transition">
                    <FaHeart size={20} />
                  </button>
                </div>
              </div>
              <button className="mt-4 w-full bg-black text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                <FaShoppingCart /> Buy Now
              </button>
            </div>
          ))
        )}
      </div>

      <div className='flex justify-end gap-2 mr-5'>
        <NavLink to={'/create'}>
          <button className='bg-white rounded cursor-pointer hover:bg-gray-800 transition-all hover:transform hover:scale-105 font-semibold text-black py-2 px-5'>
            Create
          </button>
        </NavLink>
        <NavLink to={'/manageProduct'}>
          <button className='bg-white rounded cursor-pointer hover:bg-gray-800 transition-all hover:transform hover:scale-105 font-semibold text-white py-2 px-5'>
            Edit and Delete
          </button>
        </NavLink>
      </div>
    </>
  );
};

export default ProductData;