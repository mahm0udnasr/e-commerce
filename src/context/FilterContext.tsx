import { createContext, useContext, useState, ReactNode } from "react";

type TPrice = number | undefined;

interface TFilterContext {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  minPrice: TPrice;
  setMinPrice: (price: TPrice) => void;
  maxPrice: TPrice;
  setMaxPrice: (price: TPrice) => void;
  selectedKeyword: string;
  setKeyword: (keyword: string) => void;
}

const FilterContext = createContext<TFilterContext | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<TPrice>(undefined);
  const [maxPrice, setMaxPrice] = useState<TPrice>(undefined);
  const [selectedKeyword, setKeyword] = useState<string>("");
  return (
    <FilterContext.Provider
      value={{
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
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
