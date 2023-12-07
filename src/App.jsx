import "./App.scss";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useAuth } from "./config/AuthContext";

function App() {
    const { isLoggedIn } = useAuth();
    const user = isLoggedIn || localStorage.getItem("user");

    return (
        <div>
            <div className="blur" style={{ top: "-18%", right: "0" }}></div>
            <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
            <Routes>
                <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
                <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
