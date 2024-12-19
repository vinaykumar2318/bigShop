import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingBar from 'react-top-loading-bar';
import toast, { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [qtyTotal, setQtyTotal] = useState(0);
  const [user, setUser] = useState({value: null});
  const [key, setKey] = useState(0);
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  useEffect(()=>{
    router.events.on('routeChangeStart', ()=>{
      setProgress(40);
    })
    router.events.on('routeChangeComplete', ()=>{
      setProgress(100);
    })
    try {
      if(localStorage.getItem("cart")){
        setCart(JSON.parse(localStorage.getItem("cart")));
        setSubTotal(parseFloat(localStorage.getItem("subTotal")));
        setQtyTotal(parseInt(localStorage.getItem("qtyTotal")));
      }
    } catch(err){
      console.log(err);
      localStorage.removeItem("cart");
      localStorage.removeItem("subTotal");
      localStorage.removeItem("qtyTotal");
    }
    const token = localStorage.getItem('token');
    if(token){
      setUser({value:token});
    }
    setKey(Math.random());
  },[router.query])

  const saveCart = (myCart,subTotal,qtyTotal)=>{
    localStorage.setItem("cart",JSON.stringify(myCart));
    localStorage.setItem("subTotal",subTotal);
    localStorage.setItem("qtyTotal",qtyTotal);
  }

  const addToCart = (itemCode, qty, price, name, size, variant,image) =>{
    let newCart = cart;
    let newSubTotal, newQtyTotal;
    if(itemCode in cart){
      newCart[itemCode].qty = cart[itemCode].qty + qty;
      newSubTotal = subTotal + (price*qty);
      newQtyTotal = qtyTotal + qty;
      setSubTotal(newSubTotal);
      setQtyTotal(newQtyTotal);
    } else{
      newCart[itemCode] = {qty: 1, price, name, size, variant, image};
      newSubTotal = subTotal + price;
      newQtyTotal = qtyTotal + 1;
      setSubTotal(newSubTotal);
      setQtyTotal(newQtyTotal);
    }
    setCart(newCart);
    saveCart(newCart,newSubTotal,newQtyTotal);
    toast.success('🦄 Product is added to your cart',{duration: 2000, position: 'top-center',});
  }

  const clearCart = ()=>{
    setCart({});
    setSubTotal(0);
    setQtyTotal(0);
    saveCart({},0,0);
    toast.success('🦄 Cart has been cleared',{duration: 2000, position: 'top-center',});
  }

  const buyNow = async (itemCode, qty, price, name, size, variant, image)=>{
    saveCart({});
    let newCart = {};
    newCart[itemCode] = {qty: 1, price, name, size, variant, image}
    setCart(newCart)
    const newSubTotal = newCart[itemCode].price;
    const newQtyTotal = newCart[itemCode].qty;
    setSubTotal(newSubTotal)
    setQtyTotal(newQtyTotal)
    saveCart(newCart,newSubTotal,newQtyTotal);
    router.push('/checkout');
  }

  const removeFromCart = (itemCode, qty, price, name, size, variant) =>{
    let newCart = cart;
    let newSubTotal, newQtyTotal;
    if(itemCode in cart){
      newCart[itemCode].qty = cart[itemCode].qty - qty;
      newSubTotal = subTotal - (price*qty);
      newQtyTotal = qtyTotal - 1;
      if(newCart[itemCode].qty==0){
        toast.success('🦄 Product is removed from your cart',{duration: 2000, position: 'top-center',});
      }
      setSubTotal(newSubTotal);
      setQtyTotal(newQtyTotal);
    }
    if(newCart[itemCode].qty==0){
      delete newCart[itemCode];
    }
    setCart(newCart);
    saveCart(newCart,newSubTotal,newQtyTotal);
  }

  const logout = ()=>{
    localStorage.removeItem("token");
    setCart({});
    setQtyTotal(0);
    setSubTotal(0);
    setUser({value:null});
    saveCart({},0,0);
    setKey(Math.random());
    router.push('/');
  }

  return <>
  <LoadingBar color='#0C82E7' progress={progress} waitingTime={500} onLoaderFinished={()=>setProgress(0)} />
  {!isAdminRoute && key && <Navbar logout={logout} key={key} user={user} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} qtyTotal={qtyTotal}/>}
  <Component {...pageProps} buyNow={buyNow} logout={logout} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} qtyTotal={qtyTotal}/>
  {!isAdminRoute && <Footer/>}
  </>
}
