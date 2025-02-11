import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  images: string[];
  category?: string;
}

export default function ProductView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      async function getProduct() {
        try {
          const response = await axios.get<IProduct>(
            `https://dummyjson.com/products/${id}`
          );
          setProduct(response.data);
          setSelectedImage(response.data.images[0]);
          // Fetch related products from the same category
          const relatedResponse = await axios.get<{ products: IProduct[] }>(
            `https://dummyjson.com/products/category/${response.data.category}`
          );
          setRelatedProducts(
            relatedResponse.data.products
              .filter(p => p.id !== response.data.id)
              .slice(0, 4)
          );
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data", error);
          setLoading(false);
        }
      }
      getProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-gray-800">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button container with proper spacing from edges */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 rounded-lg shadow transition duration-200 ease-in-out"
          >
            <IoArrowBack className="text-xl" />
            <span>Back to Products</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={selectedImage}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 ${
                    selectedImage === image
                      ? "ring-2 ring-indigo-500"
                      : "ring-1 ring-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Middle Column - Product Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`${
                          index < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } w-5 h-5`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.rating})
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  In Stock
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-gray-500">Category</div>
                    <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                    <div className="text-sm font-medium text-gray-500">Brand</div>
                    <div className="text-sm text-gray-900">Premium Brand</div>
                    <div className="text-sm font-medium text-gray-500">Rating</div>
                    <div className="text-sm text-gray-900">{product.rating} out of 5</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    className="w-16 text-center border-x border-gray-300 py-2"
                    min="1"
                    value={quantity}
                    readOnly
                  />
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaTruck className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-500">2-4 Business Days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaShieldAlt className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">2 Year Warranty</p>
                    <p className="text-sm text-gray-500">Full coverage</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaUndo className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-500">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 ease-in-out flex items-center justify-center space-x-2">
                  <span>Add to Cart</span>
                </button>
                <button className="w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-lg transition duration-200 ease-in-out flex items-center justify-center space-x-2">
                  <span>Add to Wishlist</span>
                </button>
              </div>
            </div>

            {/* Secure Shopping */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Secure Shopping</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Encrypted Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`w-5 h-5 text-yellow-400`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Based on {Math.floor(Math.random() * 100) + 50} reviews</span>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Write a Review
              </button>
            </div>
            
            {/* Sample Reviews */}
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="border-t border-gray-200 pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          className={`w-4 h-4 ${
                            starIndex < 4 ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">Great product!</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    Posted by John D. on {new Date().toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.title}
                      className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {relatedProduct.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500">
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
