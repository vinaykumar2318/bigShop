import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'

const Tshirts = () => {
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/getProducts');
        const data = await response.json();
        const rawData = data.products.filter(product => product.category === 'Tshirt');
        let tshirts = {};
        for (let item of rawData) {
          if (item.title in tshirts) {
            if (!tshirts[item.title].color.includes(item.color.toLowerCase())) {
              tshirts[item.title].color.push(item.color.toLowerCase());
            }
            if (!tshirts[item.title].size.includes(item.size)) {
              tshirts[item.title].size.push(item.size);
            }
          } else {
            tshirts[item.title] = JSON.parse(JSON.stringify(item));
            tshirts[item.title].color = [item.color.toLowerCase()]
            tshirts[item.title].size = [item.size]
          }
        }
        setProducts(tshirts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className='mt-36 md:mt-14'>
      <section className="text-gray-600 body-font">
        <h1 className="text-4xl font-bold text-center text-gray-800 pt-10">T-Shirts</h1>
        <div className="container px-5 py-16 mx-auto" style={{ maxWidth: '1200px' }}>
          <div className="flex flex-wrap -m-4 justify-center">
            {Object.keys(products).map((i) => (
              <Link href={`/product/${products[i].slug}`} key={products[i]._id} passHref className="lg:w-1/4 md:w-1/2 p-4 w-full cursor-pointer shadow-lg" style={{ maxWidth: '297px' }}>
                <div className="block relative h-48 rounded overflow-hidden">
                  <Image src={products[i].image} alt={products[i].title} style={{ borderRadius: '15px' }} width={340} height={50} />
                </div>
                <div className="mt-4 flex flex-col justify-between items-center">
                  <div className='w-full flex justify-between'>
                    <div>
                      <h2 className="text-gray-900 title-font text-lg font-medium">{products[i].title}</h2>
                      <p className="mt-1">₹{products[i].price}</p>
                    </div>
                    <div>
                      <Image src="/bigShopmono.png" alt="Small Logo" width={30} height={30} className="rounded-full" />
                    </div>
                  </div>
                  <div className='w-full flex justify-between'>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {products[i].size.map((s) => (
                        <span key={s} className='border border-gray-200 px-2 py-1 text-sm'>{s}</span>
                      ))}
                    </div>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {products[i].color.map((color) => (
                        <button key={color} className="border-2 border-gray-300 ml-1 rounded-full w-6 h-6 focus:outline-none" style={{ backgroundColor: color }}></button>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Tshirts
