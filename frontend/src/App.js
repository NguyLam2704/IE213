import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import pages from './routes';
import './App.css';
import { useEffect, useState } from "react";
import { Provider, useDispatch } from 'react-redux';
import { store } from './app/store/store';
import api from './apis/axios';
import { fetchCartThunk, fetchCartWithProductsThunk } from './app/store/cartThunks';

function App() {
    const dispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
    );
    useEffect(() => {
        dispatch(fetchCartThunk());
        dispatch(fetchCartWithProductsThunk());
        const checkAuth = async () => {
            try {
                const res = await api.post('api/v1/users/refreshtoken', {}, { withCredentials: true });
                localStorage.setItem("authToken", res.data.accessToken);
                localStorage.setItem("isAuthenticated", "true");
                setIsAuthenticated(true);
            } catch (err) {
                setIsAuthenticated(false);
                localStorage.setItem("isAuthenticated", "false");
            }
        };
    // Kiểm tra trạng thái authToken có sẵn không
    const token = localStorage.getItem("authToken");
    if (token) {
        setIsAuthenticated(true);
    } else {
        checkAuth();  // Gọi refresh token nếu không có authToken
    }
}, []);
    
    
    return (
        <Provider store={store}>
            <div className="App font-body">
                <Router>
                <Routes>
                {pages.map(({ path, Component, children }, index) => (
                    <Route 
                    key={index} 
                    path={path} 
                    element={<Component isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
                    >
                    {/* children  */}
                    {children && children.map(({ path: childPath, Component: ChildComponent }, childIndex) => (
                        <Route key={childIndex} path={childPath} element={<ChildComponent />} />
                    ))}
                    </Route>
                ))}
                </Routes>
                </Router>
            </div>
        </Provider>
    );
}

export default App;