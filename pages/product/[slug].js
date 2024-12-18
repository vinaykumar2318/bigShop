import { useRouter } from 'next/router'
import Image from 'next/image'
import React, {useState, useEffect} from 'react';
import Product from '@/models/Product';
import toast, { Toaster } from 'react-hot-toast';
import Error from 'next/error';
require('dotenv').config();

const productPage = ({addToCart,buyNow}) => {
    const router = useRouter();
    const {slug} = router.query;
    let siteSlug;
    const [prod, setProd] = useState(null);
    const [colorSizeSlug, setColorSizeSlug] = useState({});
    const [sizeColorSlug, setSizeColorSlug] = useState({});
    const [availableSizes, setAvailableSizes] = useState([]);
    const [color, setColor] = useState();
    const [size, setSize] = useState();
    const [like, setLike] = useState(false);
    const [errorT, setErrorT] = useState(null);

    useEffect(() => {
        if (!router.isReady) return;

        siteSlug = router.query.slug;
        const fetchProduct = async () => {
            try {

                const response = await fetch('/api/getProducts');
                const data = await response.json();

                const prod = data.products.find((product) => product.slug === siteSlug);

                if(prod){
                    setProd(prod);
                    let variantList = data.products.filter(
                        product => product.title === prod.title && prod.category === product.category
                    );                    
                    let colorSlugMap = {};
                    let sizeColorMap = {};
                    let availableSizesSet = new Set();

                    for (let item of variantList) {
                        if (colorSlugMap[item.color]) {
                            if (!colorSlugMap[item.color][item.size]) {
                                colorSlugMap[item.color][item.size] = { slug: item.slug };
                            }
                        } else {
                            colorSizeSlug[item.color] = {};
                            colorSlugMap[item.color] = { [item.size]: { slug: item.slug } };
                        }

                        if (!sizeColorMap[item.size]) {
                            sizeColorMap[item.size] = new Set();
                        }
                        sizeColorMap[item.size].add(item.color);
    
                        availableSizesSet.add(item.size);
                    }

                    for (let size in sizeColorMap) {
                        sizeColorMap[size] = Array.from(sizeColorMap[size]);
                    }

                    setSizeColorSlug(sizeColorMap);
                    setColorSizeSlug(colorSlugMap);
                    setAvailableSizes(Array.from(availableSizesSet));
                    setColor(prod.color);
                    setSize(prod.size);
                } else {
                    console.error('Product not found');
                    setErrorT(404);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };
        fetchProduct();
    }, [router.isReady, router.query.slug, errorT]);

    const [pin, setPin] = useState('');
    const [service, setService] = useState();
    const checkServicability = async() => {
        let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
        let pinJson = await pins.json();
        if(Object.keys(pinJson).includes(pin)){
            setService(true);
            toast.success('🦄 Your pincode is servicable',{duration: 2000, position: 'bottom-center',});
        } else{
            setService(false);
            toast.error('🚨 Your pincode is not servicable',{duration: 2000, position: 'bottom-center',});
        }
    }

    const onChangePin = (e)=>{
        setPin(e.target.value);
        setService(null);
    }

    const refreshVariant = (newSize, newColor)=>{
        router.push(`/product/${colorSizeSlug[newColor][newSize].slug}`);
    }

    const changeSize = (newSize)=>{
        setSize(newSize);
        setColor(sizeColorSlug[newSize][0]);
        router.push(`/product/${colorSizeSlug[sizeColorSlug[newSize][0]][newSize].slug}`);
    }

    const handleLike = ()=>{
        setLike(!like);
    }

    if(errorT===404){
        return <Error statusCode={errorT}/>
    }

    return (
        <div>
            <section className="text-gray-600 body-font overflow-hidden mt-16 md:mt-1">
                <Toaster />
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <Image src={prod ? prod.image : "/"} alt="Product Image" style={{ borderRadius: '15px', aspectRatio: '3/3' }} width={500} height={500} className='sm:w-1/2 w-full object-center object-cover rounded' priority/>
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">BigShop</h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{prod ? prod.title : ""} ({prod ? prod.size : ""}/{prod ? prod.color : ""})</h1>
                            <div className="flex mb-4">
                                <span className="flex items-center">
                                    <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-[#0C82E7]" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-[#0C82E7]" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-[#0C82E7]" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-[#0C82E7]" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-[#0C82E7]" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <span className="text-gray-600 ml-3">4 Reviews</span>
                                </span>
                                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                                    <a className="text-gray-500">
                                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                    </svg>
                                    </a>
                                    <a className="text-gray-500">
                                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                    </svg>
                                    </a>
                                    <a className="text-gray-500">
                                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                    </svg>
                                    </a>
                                </span>
                            </div>
                            <p className="leading-relaxed">{prod ? prod.description : ""}</p>
                            <p className='text-sm mt-6'>select size to see available colors</p>
                            <div className=' pb-5 border-b-2 border-gray-100 mb-5'>
                                <div className="flex mt-1 items-center ">
                                    <div className="flex">
                                        <span className="mr-3">Color</span>
                                        {Object.keys(colorSizeSlug).map((colorKey) => {
                                            if (Object.keys(colorSizeSlug[colorKey]).includes(size)) {
                                                return (
                                                    <button key={colorKey} onClick={() => refreshVariant(size, colorKey)} style={{ backgroundColor: colorKey.toLocaleLowerCase()}} className={`border-2 rounded-full w-6 h-6 focus:outline-none ${color === colorKey ? "border-black" : "border-gray-300"}`}></button>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <div className="flex ml-6 items-center">
                                        <span className="mr-3">Size</span>
                                        <div className="relative">
                                            <select value={size} onChange={(e)=>{changeSize(e.target.value)}} className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
                                                {availableSizes.map((sizeOp)=>{
                                                    return (
                                                        <option key={sizeOp} value={sizeOp}>
                                                            {sizeOp}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {prod?.availableQty > 0 ? null : <p className='text-red-500'>Out of Stock</p>}
                            </div>

                            <div className="flex">
                                <span className="title-font font-medium text-2xl text-gray-900">₹{prod ? prod.price : ""}</span>
                                <button onClick={handleLike} className={`ml-auto rounded-full w-10 h-10 p-0 border-0 inline-flex items-center justify-center ${like ? "text-red-500 bg-red-200 scale-110 animate-bounce" : "text-gray-500 bg-gray-200 scale-100"}`}>
                                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                    </svg>
                                </button>
                            </div>
                            <button onClick={()=>{buyNow(slug,1,prod?prod.price:"",prod?prod.title:"",size,color,prod?prod.image:"")}} disabled={!prod || prod.availableQty <= 0} className={`mt-5 text-white border-0 py-2 px-6 focus:outline-none rounded mr-4 w-40 ${(!prod || prod.availableQty <= 0) ? 'bg-[#84c0f4] cursor-not-allowed' : 'bg-[#0C82E7] hover:bg-[#2f79b9]'}`}>Buy Now</button>
                            <button onClick={()=>{addToCart(slug,1,prod?prod.price:"",prod?prod.title:"",size,color,prod?prod.image:"")}} disabled={!prod || prod.availableQty <= 0} className={`mt-5 text-white border-0 py-2 px-6 focus:outline-none rounded  w-40 ${(!prod || prod.availableQty <= 0) ? 'bg-[#84c0f4] cursor-not-allowed' : 'bg-[#0C82E7] hover:bg-[#2f79b9]'}`}>Add to Cart</button>
                            <div className="pincode mt-4">
                                <p className="text-gray-700 font-medium mb-2">Enter your Pincode to check shipment availability</p>
                                <div className="flex items-center space-x-2">
                                    <input onChange={onChangePin} type="text" placeholder="Enter Pincode" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0C82E7]"/>
                                    <button onClick={checkServicability} className="bg-[#0C82E7] text-white px-4 py-2 rounded-lg hover:bg-[#2f79b9] focus:outline-none focus:ring-2 focus:ring-[#2f79b9]">Check</button>
                                </div>
                                {service===false && (<div className="text-red-700 text-sm mt-3">
                                    Sorry! We do not deliver to this pincode yet.
                                </ div>)}
                                {service===true && (<div className="text-green-700 text-sm mt-3">
                                    Yeah! the product is deliverable to the provided pincode.
                                </ div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default productPage;
