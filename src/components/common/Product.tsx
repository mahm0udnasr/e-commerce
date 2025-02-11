import { Link } from "react-router-dom";

interface IProduct {
  id: string;
  title: string;
  image: string;
  price: number;
}

const Product : React.FC<IProduct> = ({ id, title, price, image }) =>  {
  return <div className="border p-4 rounded">
    <Link to={`/product/${id}`}>
      <img src={image} alt={title} className="w-full h-32 object-cover mb-2" />
      <h2 className="font-bold">{title}</h2>
      <p>${price}</p>
    </Link>
  </div>;
}

export default Product;