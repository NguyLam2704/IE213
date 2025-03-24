import ProductsList from "../../components/ProductsList/ProductsList";
import products from "../../data/products";
import "./Products.css";
import Header from "../../components/Header/Header";

const Products = ({isAuthenticated}) => {
  return (
    <>
    <Header isAuthenticated={isAuthenticated}/>
    <div className="products-header-container">
          <p className="products-header"> SẢN PHẨM</p>
          <div className="products-filter-top"> Filters</div>

    </div>
    <div className="product-page">
      <aside className="filter-section">Filters</aside>
      <ProductsList products={products} fullWidth={false} isPaginated={true} />
    </div>
    </>
  );
};

export default Products;
