import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/adminLayout';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const router = useRouter();

  useEffect(()=>{
    if(!localStorage.getItem("admintoken")){
      router.push('/admin/login');
    }
  },[])  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/getUsers');
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleDeleteUser = async (id) => {
    const data = {id}
    try {
      const res = await fetch(`/api/removeUser`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let response = await res.json();

      if(response.success){
        setUsers(users.filter((user) => user._id !== id));
        toast.success("🦄 User deleted successfully!....",{duration: 2000, position: 'top-center',});
      } else {
        toast.error("🚨 User deketion unsuccessfull!.....",{duration: 2000, position: 'top-center',});
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Page Header */}
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        <p className="mb-6">Here you can view, edit, or delete users from your application.</p>

        {/* User Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b">User ID</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Role</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
              <tr key={index}>
                <td className="p-4 border-b">{user._id}</td>
                <td className="p-4 border-b">{user.username}</td>
                <td className="p-4 border-b">{user.email}</td>
                <td className="p-4 border-b">Customer</td>
                <td className="p-4 border-b">
                  <button onClick={() => handleViewUser(user)} className="text-white bg-blue-500 hover:underline w-16 mr-2 rounded">View</button>
                  <button onClick={() => handleDeleteUser(user._id)} className="text-white bg-red-500 hover:underline w-16 rounded">Delete</button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>


        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform scale-100">
              {/* Modal Header */}
              <div className="flex justify-between items-center bg-blue-500 text-white rounded-t-lg px-6 py-4">
                <h2 className="text-xl font-semibold">User Details</h2>
                <button
                  onClick={closeModal}
                  className="text-white text-2xl hover:text-gray-300 focus:outline-none"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {selectedUser && (
                  <div className="space-y-4 text-gray-700">
                    <p>
                      <strong className="text-gray-900">User ID:</strong> {selectedUser._id}
                    </p>
                    <p>
                      <strong className="text-gray-900">Name:</strong> {selectedUser.username}
                    </p>
                    <p>
                      <strong className="text-gray-900">Email:</strong> {selectedUser.email}
                    </p>
                    <p>
                      <strong className="text-gray-900">Address:</strong> {selectedUser.address}
                    </p>
                    <p>
                      <strong className="text-gray-900">Pincode:</strong> {selectedUser.pincode}
                    </p>
                    <p>
                      <strong className="text-gray-900">City:</strong> {selectedUser.city}
                    </p>
                    <p>
                      <strong className="text-gray-900">State:</strong> {selectedUser.state}
                    </p>
                    <p>
                      <strong className="text-gray-900">Role:</strong> Customer
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end bg-gray-100 px-6 py-4 rounded-b-lg">
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;
