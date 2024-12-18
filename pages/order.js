import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Order = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);

  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/getOrders", {
          method: "GET",
        });
        const data = await response.json();
        let rawOrder = data.find(order => order.orderId == id);
        setOrder(rawOrder);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchOrders();
  }, [id]);
      
  useEffect(()=>{
    if(!localStorage.getItem("token")){
      router.push('/');
    }
  },[])

  if (!order) {
    return (
      <div className="mt-48 text-center text-5xl">
        <p>Order not found!</p>
      </div>
    );
  }

  const handleClick = async (title)=>{
    const response = await fetch('/api/getProducts');
    const data = await response.json();
    const rawData = data.products.filter(prod => prod.title === title);
    router.push(`/product/${rawData[0].slug}`);
  }

  const handleTrack = ()=>{
    if(order){
      router.push(`/trackOrder?id=${order.orderId}`);
    }
  }

  return (
    <div className="mt-20 md:mt-14 bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>
        <p className="mb-2">
          <span className="font-semibold text-gray-700">Order ID: </span>
          <span className='font-bold'>#{order.orderId}</span>
        </p>
        <p className="mb-2">
          <span className="font-semibold text-gray-700">Order Date: </span>
          {order.createdAt.slice(0,10)} (YYYY/MM/DD)
        </p>
        <p className="mb-2">
          <span className="font-semibold text-gray-700">Total: </span>
          {order.amount}
        </p>
        <div className="mb-6 flex items-center">
          <p className="font-semibold text-gray-700 mr-2">Status: </p>
          <p className={`text-sm font-bold ${order.status === 'Delivered' ? 'text-green-500' : `${order.status === 'Rejected' ? 'text-red-500' : 'text-blue-500'}`}`}>
            {order.status}
            {order.status==="Processing" && (
              <button onClick={handleTrack} className="ml-2 px-4 py-1 text-white bg-[#0C82E7] rounded-lg shadow hover:bg-[#2f79b9] transition-colors">Track Order</button>
            )}
          </p>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Items</h2>
        <ul className="space-y-4">
          {Object.keys(order.products).map((key, idx) => {
            const product = order.products[key];
            return (
              <li onClick={()=>{handleClick(product.name)}} key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border cursor-pointer">
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
  );
};

export default Order;