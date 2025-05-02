import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrderThunk } from '../../app/store/orderThunk';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { clearCart } from '../../app/store/cartSlice';
export default function PaymentSuccess() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const responseCode = params.get('vnp_ResponseCode');

        if (responseCode === '00') {
          Swal.fire({
            icon: 'success',
            title: 'Thanh toán thành công!',
            text: 'Cảm ơn bạn đã thanh toán.',
            confirmButtonText: 'OK'
          });
          dispatch(clearCart());
          // Tùy chọn: Gửi đơn hàng lên hệ thống nếu chưa lưu trước
          // dispatch(createOrderThunk({ shipping, items, paymentMethod: 'vnpay' }));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Thanh toán không thành công',
            text: 'Vui lòng thử lại sau.',
            confirmButtonText: 'OK'
          });
        }

        setTimeout(() => navigate("/"), 3000);
    }, []);

  return <div>Đang xử lý thanh toán...</div>;
}
