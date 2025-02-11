/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useFilter } from "../context/FilterContext";
import { Menu, X } from "lucide-react";

interface Product {
  category: string;
}

interface FetchResponse {
  products: Product[];
}

export default function Sidebar() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    selectedKeyword,
    setKeyword,
  } = useFilter();
  const [categories, setCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([
    "Apple",
    "Watch",
    "Fashion",
    "trend",
    "shoes",
    "shirt",
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data: FetchResponse = await response.json();
        const uniqueCategories = Array.from(
          new Set(data.products.map((product) => product.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchCategories();
  }, []);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value ? parseFloat(value) : undefined);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value ? parseFloat(value) : undefined);
  };

  const handleRadioChangeCategories = (category: string) => {
    setSelectedCategory(category);
  };

  const handleKeywordClick = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedCategory("");
    setKeyword("");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white z-40
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-[280px] overflow-y-auto shadow-lg lg:shadow-none
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]
        `}
      >
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-10 mt-4">E-Commerce</h1>
          <section>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Search Product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                placeholder="Min"
                value={minPrice ?? ""}
                onChange={handleMinPriceChange}
              />
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                placeholder="Max"
                value={maxPrice ?? ""}
                onChange={handleMaxPriceChange}
              />
            </div>
            {/* Categories Section */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Categories</h2>
              {categories.map((category, index) => (
                <label
                  key={index}
                  className={`block mb-2 cursor-pointer border px-4 py-2 rounded ${
                    category === selectedCategory ? "bg-gray-200" : ""
                  } hover:bg-gray-200`}
                  htmlFor={category}
                >
                  <input
                    type="radio"
                    name="category"
                    className="mr-2 w-[16px] h-[16px]"
                    id={category}
                    value={category}
                    onChange={() => handleRadioChangeCategories(category)}
                    checked={category === selectedCategory}
                  />
                  {category.toUpperCase()}
                </label>
              ))}
            </section>
            {/* Keywords Section */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Keywords</h2>
              {keywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleKeywordClick(keyword)}
                  className={`block w-full text-left border rounded px-4 py-2 mb-2 cursor-pointer ${
                    keyword === selectedKeyword ? "bg-gray-200" : ""
                  } hover:bg-gray-200`}
                >
                  {keyword.toUpperCase()}
                </button>
              ))}
            </section>
            <button
              onClick={handleResetFilters}
              className="w-full py-2 bg-black text-white rounded mt-4 cursor-pointer hover:bg-opacity-90"
            >
              Reset Filters
            </button>
          </section>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
