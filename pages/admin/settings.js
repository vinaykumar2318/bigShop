import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/adminLayout";
import { useRouter } from "next/router";

const Settings = () => {
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [currency, setCurrency] = useState("INR");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle the form submission (e.g., API call to save settings)
    console.log("Settings saved:", { storeName, storeEmail, storePhone, currency });
  };

  const router = useRouter();

  useEffect(()=>{
    if(!localStorage.getItem("admintoken")){
      router.push('/admin/login');
    }
  },[])  

  const handleClick = ()=>{
    localStorage.removeItem('admintoken');
    router.push('/admin/login');
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Page Header */}
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
          <button onClick={handleClick} className="bg-red-500 hover:bg-red-700 text-white w-20 h-10 text-lg rounded-lg">Logout</button>
        </div>
        <p className="mb-6">Adjust general admin and site settings here.</p>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Store Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="storeName" className="mb-2 font-semibold">Store Name</label>
              <input
                type="text"
                id="storeName"
                className="p-3 border border-gray-300 rounded-md"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="storeEmail" className="mb-2 font-semibold">Store Email</label>
              <input
                type="email"
                id="storeEmail"
                className="p-3 border border-gray-300 rounded-md"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="storePhone" className="mb-2 font-semibold">Store Phone</label>
              <input
                type="text"
                id="storePhone"
                className="p-3 border border-gray-300 rounded-md"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="currency" className="mb-2 font-semibold">Currency</label>
              <select
                id="currency"
                className="p-3 border border-gray-300 rounded-md"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
          </div>

          {/* Payment Settings */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">Payment Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="paypalEmail" className="mb-2 font-semibold">PayPal Email</label>
              <input
                type="email"
                id="paypalEmail"
                className="p-3 border border-gray-300 rounded-md"
                placeholder="Enter PayPal email"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="stripeKey" className="mb-2 font-semibold">Stripe API Key</label>
              <input
                type="text"
                id="stripeKey"
                className="p-3 border border-gray-300 rounded-md"
                placeholder="Enter Stripe API Key"
              />
            </div>
          </div>

          {/* Email Settings */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">Email Settings</h2>
          <div className="flex flex-col mb-6">
            <label htmlFor="smtpHost" className="mb-2 font-semibold">SMTP Host</label>
            <input
              type="text"
              id="smtpHost"
              className="p-3 border border-gray-300 rounded-md"
              placeholder="Enter SMTP host"
            />
          </div>
          <div className="flex flex-col mb-6">
            <label htmlFor="smtpPort" className="mb-2 font-semibold">SMTP Port</label>
            <input
              type="text"
              id="smtpPort"
              className="p-3 border border-gray-300 rounded-md"
              placeholder="Enter SMTP port"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 mt-6"
          >
            Save Settings
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;
