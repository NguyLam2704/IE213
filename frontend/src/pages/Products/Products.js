  import ProductsList from "../../components/ProductsList/ProductsList";
  // import products from "../../data/products";
  import "./Products.css";
  import Header from "../../components/Header/Header";
  import Footer from "../../components/Footer/Footer.js";
  import { useState, useEffect, use } from "react";
  import { useParams, useNavigate, useSearchParams  } from "react-router-dom";
  import routes from "../../configs/routes.config";
  import axios from "axios";
  import { useDispatch, useSelector } from "react-redux";

  import {fetchAllProducts} from '../../features/product/productSlice.js'
  import { useGetProductsQuery } from "../../features/product/productApi.js";
  const Products = ({isAuthenticated}) => {
    const { category } = useParams();
    //TÌM KIẾM
    const [searchParams] = useSearchParams();
    const globalSearchTerm = useSelector((state) => state.search.searchTerm);
    const searchQuery = searchParams.get("search")?.toLowerCase() || globalSearchTerm.toLowerCase();

    const navigate = useNavigate();
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOption, setSortOption] = useState('Giá');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // const [products, setProducts] = useState([]);
    // useEffect(() => {
    //   const fetchProducts = async () => {
    //     try {
    //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products`);
    //       setProducts(response.data.data);
    //       setFilteredProducts(response.data.data);
    //       console.log('Response Data:', response.data.data);
    //     } catch (error) { 
    //       console.error("Error fetching products:", error);
    //     }
    //   };
    //     fetchProducts();},[]);
    const {data: products = [], isLoading} = useGetProductsQuery({
      page: currentPage,
      limit: itemsPerPage,
    });

    // const products = data || [];  // if (isLoading) return <p>Loading...</p>;
    // if (error) return <p>Failed to load products</p>;
    // const products = data
  //
    // const dispatch = useDispatch();

    // useEffect(()=>{
    //     dispatch(fetchAllProducts()); //gọi thunk 
    // }, [dispatch]);

    // const products = useSelector(state => state.products.items);

    // useEffect(() => {
    //   setFilteredProducts(products); // cập nhật khi redux cập nhật
    // }, [products]);
    const sortProducts = (productsToSort) => {
      switch (sortOption) {
        case 'Phổ biến':
          return [...productsToSort].sort((a, b) => b.quantity_sold - a.quantity_sold);
        case 'Mới nhất':
          return [...productsToSort].sort((a, b) => new Date(b.create_at) - new Date(a.create_at));
        case 'Giá tăng dần':
          return [...productsToSort].sort((a, b) => a.price - b.price);
        case 'Giá giảm dần':
          return [...productsToSort].sort((a, b) => b.price - a.price);
        case 'Giá mặc định': //không sort
        default:
          return productsToSort;
      }
    };
    
    const applyFilter = () => {
      if (!products.length) return;
    // Lọc theo giá
      let filtered = [...products];
      if (minPrice || maxPrice) {
        filtered = filtered.filter(product => {
          const price = parseFloat(product.price);
          return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
        });
      }
      // Lọc theo brand
      if (selectedBrands.length > 0) {
        filtered = filtered.filter(product => selectedBrands.includes(product.brand_id.brand_name));
      }
      // Lọc theo type
      if (selectedTypes.length > 0) {
        filtered = filtered.filter(product => selectedTypes.includes(product.type_id.type_name));
      }
      // Lọc theo category từ URL
      if (category) {
        filtered = filtered.filter(product => product.category_id.category_name === category);
      }
      //  Lọc theo từ khóa tìm kiếm
      if (searchQuery) {
        filtered = filtered.filter(product =>
          product.prod_name.toLowerCase().includes(searchQuery)
        );
      }
      const sorted = sortProducts(filtered);
      setFilteredProducts(sorted);
    };
    useEffect(() => {
      applyFilter();
    }, [minPrice, maxPrice, products, category, sortOption, selectedBrands, selectedTypes, searchQuery]);

  
    //// SORT - HEADER
    const handleSortChange = (value) => {
      setSortOption(value);
      // dispatch(fetchAllProducts({ sort: sortMap[value] }));
    };
    const toggleBrandFilter = (brand) => {
      setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    };
  
    const toggleTypeFilter = (type) => {
      setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };
    const allBrands = [...new Set(products.map(p => p.brand_id.brand_name))];
    const allTypes = [...new Set(products.map(p => p.type_id.type_name))];
    return (
      <>
      <Header isAuthenticated={isAuthenticated}/>
      {/* HEADER - FILTER */}

      <div className="products-header-container">
            <p className="products-header"> SẢN PHẨM</p>
            <div className="products-filter-top"> 
              <div className="category-filter">
                <div className="sort-options">
                  <label>Sắp xếp theo:</label>
                  {['Phổ biến', 'Mới nhất'].map((option) => (
                    <button key={option} className={sortOption === option ? 'active' : ''} onClick={() => handleSortChange(option)}>
                      {option}
                    </button>
                  ))}
                  <select value={sortOption} onChange={(e) => handleSortChange(e.target.value)}>
                    <option value="Giá mặc định">Giá mặc định</option> {/* <-- mặc định */}
                    <option value="Giá tăng dần">Giá tăng dần</option>
                    <option value="Giá giảm dần">Giá giảm dần</option>
                  </select>
                </div>
              </div>
            </div>

      </div>
      <div className="product-page">


        <aside className="filter-section">
          {/* SIDEBAR - FILTER */}
          <div className="price-filter">
            <h3>Chọn mức giá</h3>
            <label>Từ:</label>
            <input type="number" placeholder="Nhập giá" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <label>Đến:</label>
            <input type="number" placeholder="Nhập giá" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>

          <div className="brand-type-filter">
            <h3>Thương hiệu</h3>
            {allBrands.map((brand) => (
              <label key={brand}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrandFilter(brand)}
                />
                {brand}
              </label>
            ))}
            <h3>Loại</h3>
            {allTypes.map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleTypeFilter(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </aside>
        <ProductsList 
          products={filteredProducts} 
          fullWidth={false} 
          isPaginated={true} 
          // currentPage={currentPage}
          // setCurrentPage={setCurrentPage}
        />
      </div>
      <Footer/>
      </>
    );
  };

  export default Products;
