import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
require('dotenv').config();

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push('/');
    }
  },[])

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const data = {email, password};
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    let response = await res.json();
    
    if(response.success){
      localStorage.setItem('token', response.token)
      toast.success('🦄 YaY! Login Successfull ...Redirecting to home page',{duration: 1000, position: 'top-center',});
      setEmail("");
      setPassword("");
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else{
      toast.error(`🚨 ${response.error}`,{duration: 2000, position: 'top-center',});
    }
  }

  const handleChange = (e)=>{
    if(e.target.name=='email'){
      setEmail(e.target.value)
    } else if(e.target.name=='password'){
      setPassword(e.target.value)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster/>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back!</h2>
        <p className="text-gray-600 text-sm text-center mb-4">Login to continue shopping</p>
        <form onSubmit={handleSubmit} method='POST'>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input onChange={handleChange} value={email} type="email" id="email" name="email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Enter your email"/>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input onChange={handleChange} value={password} type="password" id="password" name="password" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Enter your password"/>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="h-4 w-4 text-[#0C82E7] focus:ring-0"/>
              <label htmlFor="remember" className="ml-2 text-gray-600 text-sm">Remember Me</label>
            </div>
            <Link href="/forgot" className="text-[#0C82E7] text-sm hover:underline">Forgot Password?</Link>
          </div>

          <button type="submit" className="w-full bg-[#0C82E7] text-white py-2 rounded-lg font-bold text-lg hover:bg-[#2f79b9] transition duration-300">
            Login
          </button>
        </form>

        <div className="my-6 border-t border-gray-300"></div>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href={'/signup'} className="text-[#0C82E7] font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;