import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/adminLayout";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/getOrders", {
          method: "GET",
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    console.log(order.products);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const router = useRouter();

  useEffect(()=>{
    if(!localStorage.getItem("admintoken")){
      router.push('/admin/login');
    }
  },[])  

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
  
      const res = await fetch("/api/updateOrderStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      let response = await res.json();
  
      if(response.success){
        toast.success(`🦄 Order ${newStatus} successfully!....`,{duration: 2000, position: 'top-center',});
        setShowModal(false);
      } else {
        toast.error("🚨 Action performed not successfull",{duration: 2000, position: 'top-center',});
      }
  
      console.log("Order status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <Toaster/>
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
        <p className="mb-6">Here you can view, update, and manage customer orders.</p>

        {orders.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b text-center">Order ID</th>
                <th className="p-4 border-b text-center">Customer</th>
                <th className="p-4 border-b text-center">Date <p>(YYYY/MM/DD)</p></th>
                <th className="p-4 border-b text-center">Total</th>
                <th className="p-4 border-b text-center">Status</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>  
              {orders.map((order) => (
                <tr>
                  <td className="p-4 border-b text-center">{order.orderId}</td>
                  <td className="p-4 border-b text-center">{order.email}</td>
                  <td className="p-4 border-b text-center">{order.createdAt.slice(0,10)}</td>
                  <td className="p-4 border-b text-center">₹{order.amount}</td>
                  <td className="p-4 border-b text-center">
                    <span className={` text-sm px-2 py-1 rounded  ${order.status === 'Delivered' ? 'text-green-500' : `${order.status === 'Rejected' ? 'text-red-500' : 'text-blue-500'}`}`}>
                    {order.status}
                    </span>
                  </td>
                  <td className="p-4 border-b flex justify-center">
                    <button onClick={() => handleViewOrder(order)} className="text-white bg-blue-500 hover:underline mr-2 rounded w-16">View</button>
                    <button onClick={() => handleStatusChange(order.orderId, "Delivered")} disabled={order.status !== "Processing"} className="text-white bg-green-500 hover:underline mr-2 rounded w-16 disabled:bg-green-400 disabled:cursor-not-allowed disabled:no-underline">Shipped</button>
                    <button onClick={() => handleStatusChange(order.orderId, "Rejected")} disabled={order.status !== "Processing"} className="text-white bg-red-500 hover:underline rounded w-16 disabled:bg-red-400 disabled:cursor-not-allowed disabled:no-underline">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : (
          <p className="text-gray-600">You have no orders yet.</p>
        )}

        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg transform transition-all duration-300 scale-100">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-800 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="text-gray-700">
                <p className="mb-2"><strong>Order ID:</strong> #{selectedOrder.orderId}</p>
                <p className="mb-2"><strong>Customer Email:</strong> {selectedOrder.email}</p>
                <p className="mb-2"><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-white text-sm ${selectedOrder.status === 'Delivered' ? 'bg-green-500' : selectedOrder.status === 'Rejected' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p className="mb-2"><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                <p className="mb-2"><strong>Amount:</strong> ₹{selectedOrder.amount}</p>

                <h3 className="mt-6 font-semibold text-lg">Products:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {Object.entries(selectedOrder.products).map(([key, value]) => (
                    <li key={key} className="flex justify-between items-center">
                      <span>{value.name} ({value.size}, {value.variant})</span>
                      <span>Qty: x{value.qty}</span>
                      <span className="font-semibold">₹{value.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
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

export default Orders;
