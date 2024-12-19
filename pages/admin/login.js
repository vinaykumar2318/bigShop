import React, { useState } from 'react'
import toast, { Toaster } from "react-hot-toast";
import Link from 'next/link'
import { useRouter } from 'next/router';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleChange = (e)=>{
    if(e.target.name=='email'){
      setEmail(e.target.value)
    } else if(e.target.name=='password'){
      setPassword(e.target.value)
    }
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const data = {email, password};
    let res = await fetch("/api/adminLogin",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    let response = await res.json();
    
    if(response.success){
      localStorage.setItem('admintoken', response.token)
      toast.success('🦄 YaY! Admin Login Successfull ...Redirecting to home page',{duration: 1000, position: 'top-center',});
      setEmail("");
      setPassword("");
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } else{
      toast.error(`🚨 ${response.error}`,{duration: 2000, position: 'top-center',});
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster/>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 text-lg font-extrabold text-center mb-4">Admin Login</p>
        <form onSubmit={handleSubmit} method='POST'>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input onChange={handleChange} type="email" id="email" name="email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Enter your email"/>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input onChange={handleChange} type="password" id="password" name="password" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Enter your password"/>
          </div>

          <button type="submit" className="w-full bg-[#0C82E7] text-white py-2 rounded-lg font-bold text-lg hover:bg-[#2f79b9] transition duration-300 mb-4">
            Login
          </button>
          <Link href={'/'} className="w-64 bg-green-500 text-white py-2 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-300">
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-300 mb-4">
              Back to Home
            </button>
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Login
