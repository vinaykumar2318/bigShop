import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router';

const trackOrder = () => {
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

  return (
    <div className='mt-32 md:mt-16'>
        <section className="text-gray-600 body-font">
            <div className="bg-white-100 py-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">Track Your Order</h1>
            </div>
            <div className="container px-5 py-24 mx-auto flex flex-wrap" style={{ maxWidth: '1200px' }}>
                <div className="flex flex-col md:flex-row w-full">
                    <div className="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6">
                        <div className="flex relative pb-12">
                            <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                            </div>
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0C82E7] inline-flex items-center justify-center text-white relative z-10">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <div className="flex-grow pl-4">
                                <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Order Placed</h2>
                                <p className="leading-relaxed">Your order was placed successfully.</p>
                            </div>
                        </div>
                        <div className="flex relative pb-12">
                            <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                            </div>
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0C82E7] inline-flex items-center justify-center text-white relative z-10">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                </svg>
                            </div>
                            <div className="flex-grow pl-4">
                                <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Order Dispatched</h2>
                                <p className="leading-relaxed">Your order has been shipped.</p>
                            </div>
                        </div>
                        <div className="flex relative pb-12">
                            <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                            </div>
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0C82E7] inline-flex items-center justify-center text-white relative z-10">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <circle cx="12" cy="5" r="3"></circle>
                                <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
                                </svg>
                            </div>
                            <div className="flex-grow pl-4">
                                <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Out for Delivery</h2>
                                <p className="leading-relaxed">The delivery agent is on the way to your address.</p>
                            </div>
                        </div>
                        <div className="flex relative pb-12">
                            <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                            </div>
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0C82E7] inline-flex items-center justify-center text-white relative z-10">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                                <path d="M22 4L12 14.01l-3-3"></path>
                                </svg>
                            </div>
                            <div className="flex-grow pl-4">
                                <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Delivered</h2>
                                <p className="leading-relaxed">Your order has been delivered successfully!</p>
                            </div>
                        </div>
                        <div className="flex relative">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0C82E7] inline-flex items-center justify-center text-white relative z-10">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                                <path d="M22 4L12 14.01l-3-3"></path>
                                </svg>
                            </div>
                            <div className="flex-grow pl-4">
                                <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Rate Us</h2>
                                <p className="leading-relaxed">Please leave a Rating here....</p>
                            </div>
                        </div>
                    </div>
                    <div className=" -space-x-[40%] flex justify-center pt-20">
                        {Object.keys(order.products).map((key, index) => {
                            const product = order.products[key];
                            return (
                            <img key={index} src={product.image} alt={product.name} className="w-1/2 h-1/2 object-cover rounded-lg border border-gray-200 shadow-sm"/>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default trackOrder;
