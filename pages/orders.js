import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState('');

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
  
        if(response.user && response.user.email){
          setUserEmail(response.user.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await fetch("/api/getOrders", {
            method: "GET",
          });
          const data = await response.json();
          let rawOrders;
          if(data){
            rawOrders = data.filter(order => order.email === userEmail);
          }
          setOrders(rawOrders);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      };
      fetchOrders();
    }, [userEmail]);

  const router = useRouter();
    
  useEffect(()=>{
    if(!localStorage.getItem("token")){
      router.push('/');
    }
  },[])

  return (
    <div className="bg-gray-100 min-h-screen py-8 mt-20 md:mt-14">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h1>
        {orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order) => (
              <Link key={order.id} href={`/order?id=${order.orderId}`}>
                <div key={order.id} className="relative border rounded-lg p-6 bg-gray-50 shadow-md hover:shadow-lg transition-shadow mb-5">
                  <div className="absolute top-4 right-4 -space-x-3 hidden sm:flex">
                    {Object.keys(order.products).map((key, index) => {
                      const product = order.products[key];
                      return (
                      <img key={index} src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"/>
                      )
                    })}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID:</p>
                      <p className="text-lg font-bold text-gray-800">#{order.orderId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Date:</p>
                      <p className="font-medium text-gray-800">{order.createdAt.slice(0,10)} (YYYY/MM/DD)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total:</p>
                      <p className="font-medium text-gray-800">{order.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600"> Delivery Status:</p>
                      <p className={`text-sm font-bold ${order.status === 'Delivered' ? 'text-green-500' : `${order.status === 'Rejected' ? 'text-red-500' : 'text-blue-500'}`}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Items:</h2>
                    <ul className="space-y-2">
                      {Object.keys(order.products).map((key, idx) => {
                        const product = order.products[key];
                        return (
                        <li key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border">
                          <div className="flex items-center gap-4 flex-1">
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200"/>
                            <span className="text-gray-800 font-medium">{product.name}</span>
                          </div>
                          <div className="flex-1 text-center">
                            <span className="text-gray-600 block">x{product.qty}</span>
                          </div>
                          <div className="flex-1 text-center">
                            <span className="font-semibold text-gray-800">{product.price}</span>
                          </div>
                        </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You have no orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
