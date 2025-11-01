import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { DELETE_PRODUCT } from "../resources/api.js";

const DeleteProduct = ({ product, setProducts }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault();

    if (!id) {
      console.error("Delete called without id:", id, product);
      toast.error("Cannot delete: invalid product ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      const result = await axios.delete(`${DELETE_PRODUCT}/${id}`);

      if (result?.data?.success) {
        setProducts((prev) => prev.filter((data) => data._id !== id));
        toast.success(result.data.message || "Deleted successfully");
      } else {
        toast.error(result.data?.message || "Deletion failed");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Something went wrong while deleting");
    }
  };


  if (!product || !product._id) {
    return (
      <button
        disabled
        className="px-3 py-1 border border-gray-400 rounded bg-gray-300 text-gray-700 cursor-not-allowed"
      >
        Invalid Product
      </button>
    );
  }

  return (
    <button
      onClick={(e) => handleDelete(e, product._id)}
      className="px-3 py-1 border border-black rounded bg-black text-white hover:bg-white hover:text-black transition"
    >
      Delete
    </button>
  );
};

export default DeleteProduct;
