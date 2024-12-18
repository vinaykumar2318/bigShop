import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';



const Checkout = ({cart,qtyTotal,subTotal,addToCart,removeFromCart,clearCart}) => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [disable, setDisable] = useState(true);
  const [mode, setMode] = useState(false);

  let status = ['Delivered', 'Processing', 'Rejected'];

  const router = useRouter();

  useEffect(()=>{
    if(!localStorage.getItem("token")){
      router.push('/');
    }
  },[])

  const handleSubmit = async ()=>{
    if(phone.length!==10 || !Number.isInteger(Number(phone))){
      toast.error("🚨 Please enter valid phone number",{duration: 2000, position: 'top-center',});
      return;
    }
    if(pin.length!==6  || !Number.isInteger(Number(pin))){
      toast.error("🚨 Please enter your valid 6-digit pincode",{duration: 2000, position: 'top-center',});
      return;
    }
    let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
    let pinJson = await pins.json();
    if(!Object.keys(pinJson).includes(pin)){
      toast.error('🚨 Your pincode is not servicable',{duration: 2000, position: 'top-center',});
      return;
    }
    const data = {email,id: `${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`,status:status[Math.floor(Math.random()*status.length)],address,pin,city,state,amount:subTotal,products:cart};
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/transaction`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    let response = await res.json();
    if(response.success){
      toast.success('🦄 Your Order placed successfully, Payment ko Lite Lo 😂😂',{duration: 1000, position: 'top-center',});
      setFname("");
      setLname("");
      setEmail("");
      setState("");
      setCity("");
      setPin("");
      setAddress("");
      setPhone("");
      setMode(false);
      clearCart();
        
      setTimeout(() => {
        router.push('/payment');
      }, 1000);
    } else{
      toast.error(response.error,{duration: 2000, position: 'top-center',});
      clearCart();
    }
  }

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
          setEmail(response.user.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserEmail();
  }, []);

  useEffect(()=>{
    if(fname.length>1 && lname.length>1 && email.length>1 && pin.length>1 && address.length>1 && phone.length>1 && mode){
      setDisable(false);
    } else{
      setDisable(true);
    }
    if(subTotal==0){
      setDisable(true);
    }
  },[subTotal,fname, lname, email, state, city, pin, address, phone, mode])

  const handleChange = async (e)=>{
    if(e.target.name=='firstName'){
      setFname(e.target.value);
    } else if(e.target.name=='lastName'){
      setLname(e.target.value);
    } else if(e.target.name=='pin'){
      setPin(e.target.value);
      if(e.target.value.length==6){
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${e.target.value}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const pinData = await response.json();
          setState(pinData[0].PostOffice[0].State);
          setCity(pinData[0].PostOffice[0].Region);
        } catch (error) {
          console.error('Error fetching postal data:', error.message);
        }
      } else{
        setState('');
        setCity('');
      }
    } else if(e.target.name=='address'){
      setAddress(e.target.value);
    } else if(e.target.name=='phone'){
      setPhone(e.target.value);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 mt-20 md:mt-10">
      <Toaster />
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Billing Details</h2>
            <form method='POST'>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-gray-600 mb-2">First Name</label>
                  <input onChange={handleChange} value={fname} name='firstName' type="text" id="firstName" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]"/>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-600 mb-2">Last Name</label>
                  <input onChange={handleChange} value={lname} name='lastName' type="text" id="lastName" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
                  <input value={email} name='email' type="email" id="email" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" readOnly={true}/>
                </div>
                <div>
                  <label htmlFor="pin" className="block text-gray-600 mb-2">Pin Code</label>
                  <input onChange={handleChange} value={pin} name='pin' type="text" id="pin" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-gray-600 mb-2">City</label>
                  <input onChange={handleChange} value={city} name='city' type="text" id="city" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" readOnly={true}/>
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-600 mb-2">State</label>
                  <input onChange={handleChange} value={state} name='state' type="text" id="state" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]" readOnly={true}/>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-600 mb-2">Address</label>
                <input onChange={handleChange} value={address} name='address' type="text" id="address" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]"/>
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-600 mb-2">Phone Number</label>
                <input onChange={handleChange} value={phone} name='phone' type="text" id="phone" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]"/>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Order Summary</h2>
            <div className={`w-full h-2/3 lg:h-5/6 rounded-lg shadow-lg p-2 overflow-y-auto transform transition-transform duration-500 z-50 mb-4`}>
              <div className="space-y-4">
                <div className="mt-4 flex justify-between">
                  <div className="font-bold flex-1 text-center">Product Name</div>
                  <div className="font-bold flex-1 text-center">Quantity</div>
                  <div className="font-bold flex-1 text-center">Price </div>
                </div>
                {Object.keys(cart).length==0 && <div className='text-center text-base'>Cart Empty! Please Add Items.</div>}  
                {Object.keys(cart).map((k)=>{
                  return <div key={k} className="flex justify-between">
                          <div className="flex-1 text-center">{cart[k].name}({cart[k].size}/{cart[k].variant})</div>
                          <div className="flex-1 text-center flex justify-between items-center">
                            <button onClick={()=>{removeFromCart(k, 1, cart[k].price, cart[k].name,cart[k].size, cart[k].variant)}} className='bg-[#0C82E7] w-6 h-6 flex items-center justify-center rounded-md'><FaMinus className='text-white'/></button>
                            <span>{cart[k].qty}</span>
                            <button onClick={()=>{addToCart(k, 1, cart[k].price, cart[k].name,cart[k].size, cart[k].variant)}} className='bg-[#0C82E7] w-6 h-6 flex items-center justify-center rounded-md'><FaPlus className='text-white'/></button>
                          </div>
                          <div className="flex-1 text-center">₹{cart[k].price}</div>
                        </div>
                })}

                <div className="mt-4 flex justify-between">
                  <div className="font-bold flex-1 text-center">Total:</div>
                  <div className="font-bold flex-1 text-center">{qtyTotal}</div>
                  <div className="font-bold flex-1 text-center">₹{subTotal}</div>
                </div>
              </div>
            </div>
            <button type='submit' onClick={handleSubmit} disabled={disable} className={`w-full text-white py-2 rounded font-bold hover:bg-[#2f79b9] ${disable ? 'bg-[#84c0f4] cursor-not-allowed' : 'bg-[#0C82E7]'}`}>
              Place Order
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Options</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center">
              <input onChange={()=>{setMode(true)}} type="radio" id="creditCard" name="payment" className="mr-2" />
              <label htmlFor="creditCard" className="text-gray-600">Credit Card</label>
            </div>
            <div className="flex items-center">
              <input onChange={()=>{setMode(true)}} type="radio" id="paypal" name="payment" className="mr-2" />
              <label htmlFor="paypal" className="text-gray-600">PayPal</label>
            </div>
            <div className="flex items-center">
              <input onChange={()=>{setMode(true)}} type="radio" id="paypal" name="payment" className="mr-2" />
              <label htmlFor="paypal" className="text-gray-600">PhonePe</label>
            </div>
            <div className="flex items-center">
              <input onChange={()=>{setMode(true)}} type="radio" id="paypal" name="payment" className="mr-2" />
              <label htmlFor="paypal" className="text-gray-600">GooglePay</label>
            </div>
            <div className="flex items-center">
              <input onChange={()=>{setMode(true)}} type="radio" id="paypal" name="payment" className="mr-2" />
              <label htmlFor="paypal" className="text-gray-600">PayTM</label>
            </div>
            <div className="flex items-center">
              <input onChange={()=>{setMode(true)}} type="radio" id="cod" name="payment" className="mr-2" />
              <label htmlFor="cod" className="text-gray-600">Cash on Delivery</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
