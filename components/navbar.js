import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'
import { FaCartShopping } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { MdOutlineAccountCircle } from "react-icons/md";
import { FaPlus, FaMinus} from "react-icons/fa";
import { IoBagCheckOutline, IoBagRemoveOutline, IoLogInOutline} from "react-icons/io5";

const Navbar = ({logout,user,cart,addToCart,removeFromCart,clearCart,subTotal,qtyTotal}) => {

  const router = useRouter();
  const [userCurr, setUserCurr] = useState(null);
  const isLoginPage = router.pathname === '/login';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);
  const accRef = useRef(null);
  const [disable, setDisable] = useState(true);
  const [isAcc, setIsAcc] = useState(false);
  const [showSide, setShowSide] = useState(true);

  const toggleCartSidebar = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCartSidebar = () => {
    setIsCartOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleIsAcc = () => {
    setIsAcc(!isAcc);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
    if (cartRef.current && !cartRef.current.contains(event.target) && !event.target.closest('#cart-toggle-button')) {
      closeCartSidebar();
    }
    if (accRef.current && !accRef.current.contains(event.target)) {
      setIsAcc(false);
    }
  };

  useEffect(() => {
    if(subTotal==0){
      setDisable(true);
    } else{
      setDisable(false);
    }
    let exempted = ['/checkout', '/orders', '/order', '/', '/login', '/signup', '/myAccount', '/payment', '/about', '/contact', '/forgot']
    if(exempted.includes(router.pathname)){
      setShowSide(false);
    }
  }, [subTotal]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          setUserCurr(response.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserEmail();
  }, []);

  return (
    <div>
      <header className="text-gray-600 body-font shadow-xl fixed top-0 left-0 w-full z-40 bg-[#B7D5E2] backdrop-blur-sm bg-opacity-50">
        <div className="container mx-auto flex flex-wrap p-2 flex-col md:flex-row items-center">
          <Link href="/" className="pl-5 flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <Image src="/bigShoplogotrim.png" alt="" style={{ borderRadius: '15px'}} width={120} height={50}/>
          </Link>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center font-bold">
            <Link href="/" className="mr-5 hover:text-gray-900">Shop</Link>
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="hover:text-gray-900 focus:outline-none mr-5">
                Categories
              </button>
              {isDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                  <Link href="/hoodies" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>
                    Hoodies
                  </Link>
                  <Link href="/tshirts" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>
                    T-Shirts
                  </Link>
                  <Link href="/stickers" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>
                    Stickers
                  </Link>
                  <Link href="/mugs" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>
                    Mugs
                  </Link>
                </div>
              )}
            </div>
            <Link href="/orders" className="mr-5 hover:text-gray-900">Orders</Link>
            <Link href="/about" className="mr-5 hover:text-gray-900">About</Link>
            <button id="cart-toggle-button" onClick={toggleCartSidebar} className="mr-5 hover:text-gray-900">
              <FaCartShopping className="text-2xl"/>
            </button>
            {user.value && <div className='relative' ref={accRef}>
              <MdOutlineAccountCircle onClick={toggleIsAcc} className='text-xl md:text-2xl mx-2 cursor-pointer'/>
              {isAcc && (
                <div className="absolute top-full right-0 mt-2 w-48 md:w-64 bg-white shadow-lg rounded-lg border border-gray-200">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium text-gray-900">{userCurr?userCurr.username:""}</p>
                      <p className="text-gray-500">{userCurr?userCurr.email:""}</p>
                    </div>
                  </div>
                  <div className='p-4 border-t border-gray-200 space-y-2'>
                    <Link href={'/myAccount'}>
                      <button className="w-full px-4 py-2 bg-[#0C82E7] text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400">
                        My Account
                      </button>
                    </Link>
                    <button onClick={logout} className="w-full px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-400">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>}
          </nav>
          {!user.value && <Link href={isLoginPage ? '/signup' : '/login'}>
            <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 font-bold">
              <div>{isLoginPage ? 'SignUp' : 'Login'}</div>
              <IoLogInOutline className="w-4 h-4 ml-1 text-3xl font-bold"/>
            </button>
          </Link>}
        </div>
      </header>

      {showSide && <div className={`fixed top-32 sm:top-16 right-0 w-full sm:w-3/5 md:w-2/5 h-1/2 bg-white shadow-lg rounded-lg overflow-y-auto transform transition-transform duration-500 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} z-50`} ref={cartRef}>
        <div className="p-4 relative">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>

          <button onClick={closeCartSidebar} className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-900">
            <ImCross />
          </button>
          
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
          <div className="mt-6 flex gap-x-4">
            <button disabled={!qtyTotal} onClick={()=>{clearCart(); closeCartSidebar();}} className={`w-full text-white py-2 rounded font-bold flex justify-center  ${disable ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600'}`}><IoBagRemoveOutline className='text-2xl font-extrabold mr-1'/><span>Clear Cart</span></button>
            <Link href={'/checkout'} className={`w-full text-white py-2 rounded font-bold flex justify-center ${disable ? 'bg-[#84c0f4] cursor-not-allowed' : 'bg-[#0C82E7]'}`}>
              <button disabled={disable} onClick={closeCartSidebar} className={`font-bold flex justify-center ${disable ? 'bg-[#84c0f4] cursor-not-allowed' : 'bg-[#0C82E7]'}`}><IoBagCheckOutline className='text-2xl font-extrabold mr-1'/><span>Checkout</span></button>
            </Link>
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default Navbar;
