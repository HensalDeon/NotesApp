import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [user, setUser] = useState();

    return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
