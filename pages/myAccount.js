import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import toast, { Toaster } from 'react-hot-toast';

const MyAccount = ({logout}) => {
  const router = useRouter();
  const [fName, setFirstName] = useState('');
  const [lName, setLastName] = useState('');
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', conNewPassword:'' });


  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/getUser", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const response = await res.json();

        if(response.user){
          setUser(response.user);
          const nameParts = response.user.username.trim().split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');
          setFirstName(firstName);
          setLastName(lastName);
          setFormData({
            phone: response.user.phone,
            address: response.user.address,
            city: response.user.city,
            state: response.user.state,
            pincode: response.user.pincode,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserEmail();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {formData, email:user.email}
    try {
      const res = await fetch("/api/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const response = await res.json();
      if (response.success) {
        toast.success(response.message,{duration: 2000, position: 'top-center',});
        setUser({
          ...user,
          ...formData,
        });
        // router.push('/myAccount');
      } else {
        toast.error(response.message,{duration: 2000, position: 'top-center',});
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred. Please try again.");
    }
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    let data = {passwordData, email}
    if(passwordData.newPassword==passwordData.conNewPassword){
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/changePassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
  
        const response = await res.json();
        if (response.success) {
          toast.success(response.message,{duration: 2000, position: 'top-center',});
          setIsChangingPassword(false);
        } else {
          toast.error(response.message,{duration: 2000, position: 'top-center',});
        }
        setPasswordData({ oldPassword: '', newPassword: '', conNewPassword: '' });
      } catch (error) {
        console.error("Error changing password:", error);
        alert("An error occurred. Please try again.");
      }
    } else{
      toast.error("🚨 New Password and Confirm New Password must be same",{duration: 2000, position: 'top-center',});
    }
  };

  return (
    <div className="container mx-auto mt-24 p-6" style={{maxWidth:"1200px"}}>
      <Toaster/>
      <div className="bg-gradient-to-br from-blue-100 to-white shadow-lg rounded-lg p-8 relative">
        <h2 className="text-3xl font-bold mb-6 text-gray-700 text-center">My Account</h2>
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="shadow-md pl-4 pt-2 rounded-lg">
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">First Name:</span> {fName}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">Last Name:</span> {lName}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">Email:</span> {user.email}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">Phone:</span> {user.phone}
              </p>
            </div>
            <div className="shadow-md pl-4 pt-2 rounded-lg">
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">Address:</span> {user.address}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">City:</span> {user.city}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">State:</span> {user.state}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">Pincode:</span> {user.pincode}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600">Loading user details...</p>
        )}
        <button className="absolute top-4 right-4 bg-[#0C82E7] text-white px-6 py-2 flex rounded-full hover:bg-[#2f79b9] shadow-lg" onClick={() => setIsEditing(true)}>
          <span>Edit</span>
          <CiEdit className="text-2xl font-extrabold ml-2" />
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-2xl relative animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Edit Your Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-gray-600 mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-[#0C82E7] text-white px-4 py-2 rounded-full hover:bg-[#2f79b9]">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-2xl relative animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block font-semibold text-gray-600 mb-2">Old Password</label>
                <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
              <div className="mb-4">
                <label className="block font-semibold text-gray-600 mb-2">New Password</label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
              <div className="mb-4">
                <label className="block font-semibold text-gray-600 mb-2">Confirm New Password</label>
                <input type="password" name="conNewPassword" value={passwordData.conNewPassword} onChange={handlePasswordChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600" onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-[#0C82E7] text-white px-4 py-2 rounded-full hover:bg-[#2f79b9]">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Account Settings</h2>
        <div className="flex space-x-4">
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
          <button onClick={() => setIsChangingPassword(true)} className="bg-[#0C82E7] text-white px-4 py-2 rounded hover:bg-[#2f79b9]">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;