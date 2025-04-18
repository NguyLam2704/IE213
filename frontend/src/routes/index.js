import routes from '../configs/routes.config';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import User from '../pages/User/User';
import Profile from '../pages/User/Profile/Profile';
import OrdersHistory from '../pages/User/OrderHistory/OrdersHistory';
import Products from '../pages/Products/Products';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Cart from '../pages/Cart/Cart';
import Order from '../pages/Order/Order';
import { Navigate } from "react-router-dom";

const pages = [
    { path: routes.home, Component: Home },
    { path: routes.login, Component: Login },
    { path: routes.register, Component: Register },
    { path: routes.products, Component: Products },
    { path: routes.product, Component: ProductDetail },
    { path: routes.cart, Component: Cart },
    { path: routes.order, Component: Order },

    { path: `${routes.products}/:category`, Component: Products },

    { 
        path: routes.user, 
        Component: User,
        children: [
            { path: "", Component: () => <Navigate to="/user/profile" replace /> }, 
            { path: "profile", Component: Profile },
            { path: "orders", Component: OrdersHistory },
            // { path: "change-password", Component: ChangePassword },
        ]
    }
];

export default pages;