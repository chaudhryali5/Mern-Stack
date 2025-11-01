import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {NavLink,useNavigate} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { CREATE_PRODUCT } from '../resources/api.js';
const CreateProduct = () => {
  const { register, handleSubmit } = useForm();
  const [isloading, setLoading] = useState(false);
  const navigate=useNavigate();

  const getProducts = async (data) => {
    if (!data.name) {
      toast.error("Name field is required!", { duration: 3000 })
      return;
    } else if (!data.price) {
      toast.error("Price field is required!", { duration: 3000 })
      return;
    }
    else if (!data.category) {
      toast.error("Category field is required!", { duration: 3000 })
      return;
    }
    try {
      const success = await axios.post(CREATE_PRODUCT,data)
     if (success) {
        toast.success(success.data.message, { duration: 3000 })
        navigate('/')
      } else {
        toast.error(success.data.message, { duration: 3000 })
      }
    } catch (error) {
      toast.error(" something went wrong!", { duration: 3000 },error)
    }finally{
      setLoading(false)
    }
  }
  return (
    <>
      <div className="bg-black w-full min-h-screen flex flex-col">

        <h2 className="text-center text-white text-5xl mt-[50px] font-bold">
          Enter Your Product Details
        </h2>

        <div className=" flex justify-center items-center mt-3">
          <form onSubmit={handleSubmit(getProducts)} className="h-[400px] w-[500px] bg-white border rounded p-6 flex flex-col justify-between">
            <label className="block mb-1 text-[20px] font-normal">
              Name
              <input
              {...register("name")} 
                type="text"
                className="w-full bg-white/90 py-1.5 rounded border border-gray-400 text-[15px] pl-2 hover:border-black mt-1"
              />
            </label>

            <label className="block mb-1 text-[20px] font-normal">
              Price
              <input
              {...register("price")} 
                type="text"
                className="w-full bg-white/90 py-1.5 rounded border border-gray-400 text-[15px] pl-2 hover:border-black mt-1"
              />
            </label>

            <label className="block mb-1 text-[20px] font-normal">
              Category
              <input
              {...register("category")} 
                type="text"
                className="w-full bg-white/90 py-1.5 rounded border border-gray-400 text-[15px] pl-2 hover:border-black mt-1"
              />
            </label>

             <div className="flex justify-end">
              {isloading ?
                <button  className="bg-black py-[5px] px-8 font-semibold text-[20px] text-white rounded-3xl">
                  Creating...
                </button> :
                <button  className="bg-black py-[5px] px-8 font-semibold text-[20px] text-white rounded-3xl">
                  Create
                </button>
              }
            </div>
          </form>
        </div>

       <NavLink
       to={'/'}>
         <div className="flex justify-center mb-6">
          <button className="bg-white  mt-3 py-[5px] px-8 font-semibold text-[20px] text-black rounded-3xl">
            Back
          </button>
        </div>
       </NavLink>
      </div>
      
    </>
  );
};

export default CreateProduct;
