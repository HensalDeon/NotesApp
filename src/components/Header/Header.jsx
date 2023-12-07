import "./Header.scss";
import logout from "../../assets/logout.svg";
import logo from "../../assets/logo.svg";
import { useAuth } from "../../config/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const Header = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAuth();
    const handleLogout = () => {
        console.log("log");
        localStorage.removeItem("user");
        setIsLoggedIn((prev) => !prev);
        setTimeout(() => {
            navigate("/auth");
        }, 0);
    };
    return (
        <section className="header p-2">
            <div className="px-3">
                <motion.div
                    className="d-flex gap-2"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        damping: 5,
                        stiffness: 40,
                        restDelta: 0.001,
                        duration: 0.3,
                    }}
                >
                    <img style={{ width: "2rem" }} src={logo} alt="logo" />
                    <h4>Notes App</h4>
                </motion.div>
                <div className="user">
                    <motion.img
                        src={logout}
                        onClick={handleLogout}
                        alt="logout"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    />
                </div>
            </div>
        </section>
    );
};

export default Header;
