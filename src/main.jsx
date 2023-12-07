import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "../node_modules/bootstrap-scss/bootstrap.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./config/AuthContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<App />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);
