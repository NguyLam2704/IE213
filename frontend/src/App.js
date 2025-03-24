import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import pages from './routes';
import './App.css';
import { useEffect, useState } from "react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
      localStorage.getItem("isAuthenticated") === "false"
    );
    
    return (
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
    );
}

export default App;