import React, { useState } from 'react';
import AdminLayout from '@/components/adminLayout';
import toast, {Toaster} from 'react-hot-toast';
import Image from 'next/image';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const uploadImage = async () => {
    if (selectedImage) {
        console.log('Uploading:', selectedImage.name);
        toast.success(`🦄 Image uploaded successfully! URL: ${data.imageUrl}`,{duration: 2000, position: 'top-center',});
    } else{
        toast.error("🚨 Failed to upload image",{duration: 2000, position: 'top-center',});
    }
  };
  

  return (
    <AdminLayout>
      <div className="container mx-auto px-6 py-10">
        <Toaster/>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Upload Product Image
        </h1>
        <div className="max-w-lg mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <label
                htmlFor="imageInput"
                className="block text-gray-700 text-lg font-medium mb-3 text-center"
              >
                Select an Image
              </label>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {imagePreview && (
              <div className="mb-6">
                <p className="text-center text-gray-700 font-semibold mb-2">
                  Image Preview
                </p>
                <Image
                  src={imagePreview}
                  alt="Selected"
                  height={200} width={50}
                  className="w-full h-56 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={clearImage}
                  className="block bg-red-500 hover:bg-red-600 text-white mt-4 mx-auto px-4 py-2 rounded-lg font-bold transition-all"
                >
                  Clear Image
                </button>
              </div>
            )}

            <button
              onClick={uploadImage}
              disabled={!selectedImage}
              className={`w-full px-4 py-2 rounded-lg font-bold transition-all ${
                selectedImage
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-400 text-white cursor-not-allowed'
              }`}
            >
              Upload Image
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ImageUpload;
