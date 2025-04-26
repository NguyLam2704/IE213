import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCake } from "@fortawesome/free-solid-svg-icons";
import './ProductDetail.css';
import Header from '../../components/Header/Header';
// import products from '../../data/products';
import { useGetProductsQuery } from "../../features/product/productApi.js";
import { apiAddItem } from '../../apis/cart.js';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../../app/store/cartSlice.js';



const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [itemCart,setitemCart] = useState();
  const { id } = useParams();
  const {data: products = []} = useGetProductsQuery();
  const product = products.find((p) => p._id === id);
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState(null);
  const status = useSelector(state => state.cart.status);
  const dispatch = useDispatch();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Gọi API thêm sản phẩm vào giỏ
      const result = await dispatch(addItemToCart({
        product_id: product._id,
        quantity
      }));

      if (addItemToCart.fulfilled.match(result)) {
        Swal.fire(`Thêm ${quantity} sản phẩm thành công!`, '', 'success');
      }
    } catch (err) {
      console.error('Lỗi khi thêm vào giỏ:', err);
      setError('Thêm vào giỏ thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  if (!product) {
    return <div className="container">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="breadcrumb">
          TRANG CHỦ {'>'} {product.category_id.category_name} {'>'} {product.prod_name}
        </div>

        <div className="product">
          <div className="images">
            <img src={`${product.images.find(img => img.is_primary_image)?.image}`} alt={product.prod_name} />
          </div>

          <div className="info">
            <h1>{product.prod_name}</h1>
            <div className="price">{product.price.toLocaleString('vi-VN')} ₫</div>
            <p>Đánh giá: {/* Chưa có dữ liệu */}</p>

            <div className="quantity">
              <label>Số lượng: </label>
              
              <button 
              className="qty-btn"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >-</button>

              <input 
              type="number" 
              min="1" 
              max= {product.stock}
              value={quantity} 
              // readOnly
              onChange={e => {
                const val = Number(e.target.value);
                // Giới hạn val trong khoảng [1, product.stock]
                const clamped = Math.min(product.stock, Math.max(1, val));
                setQuantity(clamped);
              }}

              />
              <button 
              className="qty-btn"
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              >
              +
              </button>
              
              <button 
              className="btn"
              onClick={handleAddToCart}
              disabled={loading}
              >
              Thêm vào giỏ
              </button>
            </div>
            <p>Số lượng trong kho: {product.stock}</p>
            <p>Tình trạng: {/* Chưa có dữ liệu */}</p>
            
            <div className="note">Chia sẻ:</div>
          </div>
        </div>

        <div className="section-heading">THÔNG TIN CHI TIẾT</div>
        <div className="details">
          <ul>
            <li>{product.description || ''}</li>
            <li>{product.details || ''}</li>
          </ul>
          <ul>
            <li>Thương hiệu: {product.brand_id.brand_name || ''}</li>
            <li>Danh mục: {product.category_id.category_name || ''}</li>
            <li>Mẫu mã: {/* Chưa có dữ liệu */}</li>
            <li>Xuất xứ: {/* Chưa có dữ liệu */}</li>
          </ul>
        </div>

        <div className="home-section-title">Sản phẩm tương tự</div>
        <div className="similar-products">
          {products
            .filter((p) => p.category_id.category_name === product.category_id.category_name && p._id !== product._id)
            .slice(0, 4)
            .map((prod, i) => (
              <div key={i} className="product-item" onClick={() => navigate(`/product/${prod.id}`)}>
                <img src={`${prod.images.find(img => img.is_primary_image)?.image}`} alt={prod.name} />
                <div>{prod.prod_name}</div>
                <div className="price">{prod.price.toLocaleString('vi-VN')} ₫</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
