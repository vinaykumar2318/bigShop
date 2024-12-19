import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/adminLayout";
import Image from "next/image";
import { useRouter } from "next/router";

const Dashboard = () => {
  const [data, setData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
  });

  const router = useRouter();

  useEffect(()=>{
    if(!localStorage.getItem("admintoken")){
      router.push('/admin/login');
    }
  },[])  

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await fetch("/api/forDashboard");
        const result = await response.json();

        setData({
          totalSales: result.totalSales,
          totalOrders: result.totalOrders,
          totalProducts: result.totalProducts,
          totalUsers: result.totalUsers,
          recentOrders: result.recentOrders,
        });
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold">Total Sales</h2>
            <p className="text-2xl font-bold text-green-500">
              ₹{data.totalSales}
            </p>
            <p className="text-sm text-gray-500">+12% from last month</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold">Total Orders</h2>
            <p className="text-2xl font-bold text-blue-500">
              {data.totalOrders}
            </p>
            <p className="text-sm text-gray-500">+10% from last month</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold">Total Products</h2>
            <p className="text-2xl font-bold text-yellow-500">
              {data.totalProducts}
            </p>
            <p className="text-sm text-gray-500">+8% from last month</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl font-bold text-purple-500">
              {data.totalUsers}
            </p>
            <p className="text-sm text-gray-500">+5% from last month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
            <Image src={'/chart.png'} width={400} height={30} className="bg-gray-100"></Image>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-4">Order Analytics</h2>
            <Image src={'/chart.png'} width={400} height={30} className="bg-gray-100"></Image>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b-2 p-2 text-center">Order ID</th>
                <th className="border-b-2 p-2 text-center">Customer</th>
                <th className="border-b-2 p-2 text-center">Date</th>
                <th className="border-b-2 p-2 text-center">Total</th>
                <th className="border-b-2 p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentOrders).map((order) => (
                <tr key={order._id}>
                  <td className="border-b p-2 text-center">#{order.orderId}</td>
                  <td className="border-b p-2 text-center">{order.email}</td>
                  <td className="border-b p-2 text-center">{order.createdAt.slice(0,10)}</td>
                  <td className="border-b p-2 text-center">₹{order.amount}</td>
                  <td
                    className={`border-b p-2 text-center ${
                      order.status === "Delivered"
                        ? "text-green-500"
                        : order.status === "Processing"
                        ? "text-blue-500"
                        : "text-red-500"
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
