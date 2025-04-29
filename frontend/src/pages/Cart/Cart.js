import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./Cart.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeItem, updateQuantity } from "../../app/store/cartSlice";
import { apiGetItem } from "../../apis/products";

export default function Cart({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  
  const items = useSelector(state => state.cart.items.items) || [];
  // console.log("items: ",items);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const details = {};
      // Duyệt từng item, fetch chi tiết sản phẩm
      for (const item of items) {
        if (!details[item.product]) { // Nếu chưa fetch
          try {
            const res = await apiGetItem(item.product);
            details[item.product] = res.data; // Giả sử API trả { id, prod_name, price, image }
            // console.log("res: ",res.data);
          } catch (error) {
            console.error("Failed to fetch product: ", item.product, error);
          }
        }
      }
      setProductDetails(details);
    };


    
    // console.log("1 item: ",items);
    if (items.length > 0) {
      // console.log("ok")
      fetchProducts();
    }
  }, [items]);
  // console.log("detail: ",productDetails);
  // console.log("items: ",items);
  
  const cartItemsWithDetails = items.map(item => {
    const product = productDetails[item.product] || {};
    // console.log("product: ",product);
    return {
      ...item,
      prod_name: product.prod_name,
      price: product.price,
      image: product.images?.find(img => img.is_primary_image)?.image 
      || product.images?.[0]?.image 
      || '',
    };
  });
  
  // console.log("cartItemsWithDetails: ",cartItemsWithDetails);
  const handleQuantityChange = (id, delta) => {
    dispatch(updateQuantity({ id, delta }));
  };
  
  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };
  
  const totalPrice = Array.isArray(items) ? items.reduce((total, item) => total + item.price * item.quantity, 0) : 0;
  const totalQuantity = Array.isArray(items) ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  

  return (

    <>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>

      <div className="user-container">
        <div className="user-header-container">
          <p className="user-header">TRANG CHỦ {'>'} GIỎ HÀNG</p>
        </div>
        <div className="cart-table">
        <div className="cart-header">
          <span>Sản phẩm</span>
          <span>Đơn giá</span>
          <span>Số lượng</span>
          <span>Thành tiền</span>
        </div>

        {cartItemsWithDetails.map(item => (
          <div className="cart-item" key={item._id}>
            
            <div className="product-info">
              <img src={item.image} alt="giay" />
              <span>{item.prod_name}</span>
            </div>
            <div>{item.price} đ</div>
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange(item.product, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.product, 1)}>+</button>
            </div>
            <div>{(item.price * item.quantity).toLocaleString()} đ</div>
            <button className="delete-button" onClick={() => handleRemove(item.product)}>Xóa</button>
          </div>
        ))}

        <div className="total-price">
          Tổng tiền: <strong>{totalPrice.toLocaleString()} đ</strong>
        </div>
      </div>

      <div className="bottom-section">
        <div className="discount-box">
          <label>Mã giảm giá</label>
          <input type="text" placeholder="Nhập mã giảm giá" />
          <button>ÁP DỤNG</button>
        </div>
        <div className="summary-box">
          <p><strong>Số lượng:</strong> {totalQuantity}</p>
          <p><strong>Thành tiền:</strong> {totalPrice.toLocaleString()} đ</p>
          <button className="checkout-button"  onClick={() => navigate('/order')}>THANH TOÁN</button>
        </div>
      </div>

      </div>
      
    </>
  );
}
