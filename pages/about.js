import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-50 py-10 mt-24 md:mt-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8" style={{maxWidth:"1200px"}}>
        <h1 className="text-4xl font-extrabold text-center text-[#0C82E7] mb-10">About BigShop</h1>

        <div className="bg-white shadow-md rounded-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#0C82E7] mb-4">Welcome to BigShop</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At <span className="font-semibold text-[#0C82E7]">BigShop</span>, we are dedicated to making your shopping experience seamless and delightful. From the latest fashion trends to must-have electronics and everyday essentials, we offer an extensive range of quality products at competitive prices. Shop with us and discover why we're your trusted shopping partner.
          </p>
        </div>

        <div className="bg-blue-50 shadow-md rounded-lg p-8 mb-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-[#0C82E7] mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Our mission at BigShop is to redefine the way you shop online. We aim to deliver top-quality products, reliable customer service, and lightning-fast delivery. BigShop is more than just a store; it's a promise of excellence, value, and convenience.
          </p>
        </div>

        <div className="bg-gray-100 shadow-md rounded-lg p-8 mb-8 border border-gray-300">
          <h2 className="text-2xl font-bold text-[#0C82E7] mb-4">Why Choose BigShop?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Extensive variety across all product categories.</li>
            <li>Competitive pricing to fit your budget.</li>
            <li>Reliable and fast shipping to your doorstep.</li>
            <li>Hassle-free returns and secure payment options.</li>
            <li>Unmatched customer support whenever you need help.</li>
          </ul>
        </div>

        <div className="bg-blue-50 shadow-md rounded-lg p-8 mb-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-[#0C82E7] mb-4">Our Values</h2>
          <p className="text-gray-700 leading-relaxed">
            At BigShop, we prioritize trust, quality, and customer satisfaction. Our core values inspire everything we do, ensuring that your experience with us is always exceptional. We strive to make shopping not just easy, but truly enjoyable.
          </p>
        </div>

        <div className="bg-gray-100 shadow-md rounded-lg p-8 border border-gray-300">
          <h2 className="text-2xl font-bold text-[#0C82E7] mb-4 text-center">Contact Us</h2>
          <p className="text-gray-700 text-center mb-4">
            Have any questions or feedback? We’re here to help! Reach out to us at{' '}
            <a href="mailto:support@bigshop.com" className="text-[#0C82E7] underline">support@bigshop.com</a> 
            or call us at <span className="font-semibold">🇮🇳 +91 84XXXXXX51</span>.
          </p>
          <p className="text-gray-700 text-center">
            Stay connected and follow us on social media for the latest updates, deals, and more!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
