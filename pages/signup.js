import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
require('dotenv').config();

const Signup = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push('/');
    }
  },[])

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(password==conPassword){
      const data = {username:name, email, password, address:'--', pincode:'--', city:'--' , state:'--', phone:'--'};
      let res = await fetch(`/api/signUp`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      let response = await res.json();
      if(response.success){
        toast.success('🦄 YaY! SignUp Successfull... Redirecting to login page',{duration: 1000, position: 'top-center',});
        setName("");
        setEmail("");
        setPassword("");
        setConPassword("");
        
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } else{
        toast.error('🚨 Oops! SignUp Unsuccessfull... An error occurred',{duration: 2000, position: 'top-center',});
      }
    } else{
      toast.error('🚨 Password and Confirm Password must be same',{duration: 2000, position: 'top-center',});
    }
  }

  const handleChange = (e)=>{
    if(e.target.name=='name'){
      setName(e.target.value)
    } else if(e.target.name=='email'){
      setEmail(e.target.value)
    } else if(e.target.name=='password'){
      setPassword(e.target.value)
    } else if(e.target.name=='conPassword'){
      setConPassword(e.target.value)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create an Account</h1>
        <form onSubmit={handleSubmit} method='POST'>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600 font-medium mb-2">Full Name</label>
            <input value={name} onChange={handleChange} type="text" id="name" name="name" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Enter your full name"/>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-medium mb-2">Email Address</label>
            <input value={email} onChange={handleChange} type="email" id="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Enter your email"/>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 font-medium mb-2">Password</label>
            <input value={password} onChange={handleChange} type="password" id="password" name="password" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Enter your password"/>
          </div>
          <div className="mb-4">
            <label htmlFor="conPassword" className="block text-gray-600 font-medium mb-2">Confirm Password</label>
            <input value={conPassword} onChange={handleChange} type="password" id="conPassword" name="conPassword" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Confirm your password"/>
          </div>
          <button type="submit" className="w-full bg-[#0C82E7] text-white py-2 rounded font-bold hover:bg-[#2f79b9] focus:outline-none focus:ring-2 focus:ring-[#0C82E7]">
            Sign Up
          </button>
        </form>
        <p className="text-gray-600 text-center mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0C82E7] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
