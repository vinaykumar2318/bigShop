import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/adminLayout";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image: "",
    category: "",
    size: "",
    color: "",
    price: "",
    availableQty: "",
  });

  const router = useRouter();

  useEffect(()=>{
    if(!localStorage.getItem("admintoken")){
      router.push('/admin/login');
    }
  },[])  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/getProducts");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleOpenModal = (type, product = null) => {
    setModalType(type);
    if (type === "edit" && product) {
      setFormData(product);
      setProduct(product);
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        image: "",
        category: "",
        size: "",
        color: "",
        price: "",
        availableQty: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType("");
    setFormData({
      title: "",
      slug: "",
      description: "",
      image: "",
      category: "",
      size: "",
      color: "",
      price: "",
      availableQty: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(modalType==="add"){
      const data = [formData];
      const res = await fetch("/api/addProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let response = await res.json();

      if(response.success){
        toast.success("🦄 Product added successfully!....",{duration: 2000, position: 'top-center',});
        setShowModal(false);
      } else {
        toast.error("🚨 Product not added, give a unique slug",{duration: 2000, position: 'top-center',});
      }
    } else{
      const data = {formData, id:product._id};
      const res = await fetch("/api/updateProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let response = await res.json();

      if(response.success){
        toast.success("🦄 Product updated successfully!....",{duration: 2000, position: 'top-center',});
        setShowModal(false);
      } else {
        toast.error("🚨 Product not updated",{duration: 2000, position: 'top-center',});
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <Toaster />
        <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
        <p className="mb-6">
          Here you can view, add, edit, or delete products in your inventory.
        </p>

        {/* Add Product Button */}
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          Add New Product
        </button>

        {/* Product Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b">Product ID</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Price</th>
                <th className="p-4 border-b">Stock</th>
                <th className="p-4 border-b">Category</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="p-4 border-b">{product._id}</td>
                  <td className="p-4 border-b">{product.title}</td>
                  <td className="p-4 border-b">₹{product.price}</td>
                  <td className="p-4 border-b">{product.availableQty}</td>
                  <td className="p-4 border-b">{product.category}</td>
                  <td className="p-4 border-b">
                    <button
                      onClick={() => handleOpenModal("edit", product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{ top: "70px" }}>
            <div className="bg-white rounded-lg p-6 w-1/3 max-w-4xl">
              <h2 className="text-2xl font-bold mb-4">
                {modalType === "add" ? "Add Product" : "Edit Product"}
              </h2>
              <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col col-span-2">
                  <label className="mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md"
                    required
                  ></textarea>
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Available Quantity</label>
                  <input
                    type="number"
                    name="availableQty"
                    value={formData.availableQty}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    {modalType === "add" ? "Add Product" : "Update Product"}
                  </button>
                </div>
            </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
