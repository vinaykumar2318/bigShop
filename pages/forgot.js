import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Forgot = () => {
  const router = useRouter()
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push('/');
    } else if (router.query.token) {
      setToken(router.query.token);
    }
  }, [router.query]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    let data = {password, token, sendEmail: false};

    if (password !== confirmPassword) {
      toast.error("🚨 Password and confirm password must be same",{duration: 2000, position: 'top-center',});
      return;
    }
    let gToken = localStorage.getItem('forgottoken');

    if (!gToken || gToken !== token) {
      toast.error("🚨 Token mismatch error!", { duration: 2000, position: 'top-center' });
      return;
    }

    try {
      const res = await fetch('/api/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      if (response.success) {
        toast.success(response.message,{duration: 2000, position: 'top-center',});
        localStorage.removeItem('forgottoken');
        router.push('/login');
      } else {
        toast.error("🚨 Error while changing password!...",{duration: 2000, position: 'top-center',});
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("🚨 Error while changing password!... Please try again..",{duration: 2000, position: 'top-center',});
    }
  };

  const sendResetEmail = async (e)=>{
    e.preventDefault();
    let data = {email, sendEmail: true};
    try {
      const res = await fetch("/api/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const response = await res.json();
  
      if (response.success) {
        toast.success(response.message,{duration: 2000, position: 'top-center',});
        if (response.token) {
          localStorage.setItem('forgottoken', response.token);
        }
      } else {
        toast.error(response.message,{duration: 2000, position: 'top-center',});
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {token ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset Password</h1>
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-600 font-medium mb-2">New Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Enter new password" required />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-600 font-medium mb-2">Confirm Password</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Confirm new password" required />
              </div>
              <button type="submit" className="w-full bg-[#0C82E7] text-white py-2 rounded font-bold hover:bg-[#2f79b9] focus:outline-none focus:ring-2 focus:ring-[#0C82E7]">
                Reset Password
              </button>
            </form>
          </>
        ) :
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Forgot Password</h1>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Enter your registered email address, and we will send you instructions to reset your password.
            </p>
            <form onSubmit={sendResetEmail}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-600 font-medium mb-2">Email Address</label>
                <input value={email} type="email" id="email" onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" placeholder="Enter your email" required />
              </div>
              <button type="submit" className="w-full bg-[#0C82E7] text-white py-2 rounded font-bold hover:bg-[#2f79b9] focus:outline-none focus:ring-2 focus:ring-[#0C82E7]">
                Send Reset Link
              </button>
            </form>
            <p className="text-gray-600 text-center mt-4">
              <Link href="/login" className="text-[#0C82E7] hover:underline">
                Back to Login
              </Link>
            </p>
          </>
        }
      </div>
    </div>
  );
};

export default Forgot;