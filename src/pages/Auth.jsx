import "./Page.scss";
import Logo from "../assets/logo.svg";
import { useState } from "react";
import PropTypes from "prop-types";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../config/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

const loginValidation = Yup.object().shape({
    email: Yup.string().trim().email("Invalid email fromat").required("email cannot be empty"),
    password: Yup.string()
        .trim()
        .min(8, "Minimum 6 characters required")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain at least one letter", "and one number")
        .required("Password cannot be empty"),
});
const signupValidation = Yup.object().shape({
    email: Yup.string().trim().email("Invalid email fromat").required("email cannot be empty"),
    password: Yup.string()
        .trim()
        .min(8, "Minimum 6 characters required")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain at least one letter and one number")
        .required("Password cannot be empty"),
    confPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Confirm password is not same")
        .required("Confirm password is required"),
});

const Auth = () => {
    const [toggle, setToggle] = useState(false);
    const handleToggle = () => {
        setToggle((prev) => !prev);
    };

    return (
        <div className="Auth d-flex">
            <div className="a-left col-lg-5 col-12">
                <img src={Logo} alt="" />
                <div className="Webname">
                    <h1>Notes App</h1>
                    <h6>Create the Extraordinary!</h6>
                </div>
            </div>
            <AuthForm handleToggle={handleToggle} toggle={toggle} />
        </div>
    );
};
function AuthForm({ handleToggle, toggle }) {
    const [loading, setLoading] = useState();
    const auth = getAuth();
    const navigate = useNavigate();
    const { setIsLoggedIn, setUser } = useAuth();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confPassword: "",
        },
        validationSchema: toggle ? signupValidation : loginValidation,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values) => {
            setLoading(true);
            if (toggle) {
                createUserWithEmailAndPassword(auth, values.email, values.password)
                    .then((userCredential) => {
                        if (userCredential) {
                            const user = userCredential.user;
                            setUser(user);
                            localStorage.setItem("user", user.uid);
                            setIsLoggedIn(true);
                            navigate("/");
                            setLoading(false);
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        console.error("Sign up error:", error);
                    });
            } else {
                signInWithEmailAndPassword(auth, values.email, values.password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        setUser(user);
                        setLoading(false);
                        localStorage.setItem("user", user.uid);
                        setIsLoggedIn(true);
                        navigate("/");
                    })
                    .catch((error) => {
                        setLoading(false);
                        alert("email is not found! please sign in");
                        console.error("Sign in error:", error);
                    });
            }
        },
    });

    return (
        <motion.div
            className="a-right col-lg-5 col-12"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <form className="infoForm authForm" onSubmit={formik.handleSubmit}>
                <h3>{toggle ? "Signup" : "Log In"}</h3>

                <div style={{ display: "flow" }}>
                    <input
                        {...formik.getFieldProps("email")}
                        type="text"
                        placeholder="email"
                        className="infoInput"
                        name="email"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div style={{ color: "red" }}>{formik.errors.email}</div>
                    )}
                </div>

                <div style={{ display: "flow" }}>
                    <input
                        {...formik.getFieldProps("password")}
                        type="password"
                        className="infoInput"
                        placeholder="Password"
                        name="password"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div style={{ color: "red" }}>{formik.errors.password}</div>
                    )}
                </div>
                {toggle && (
                    <motion.div
                        style={{ display: "flow" }}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <input
                            {...formik.getFieldProps("confPassword")}
                            type="password"
                            className="infoInput"
                            placeholder="Confirm Passowrd"
                            name="confPassword"
                        />
                        {formik.touched.confPassword && formik.errors.confPassword && (
                            <div style={{ color: "red" }}>{formik.errors.confPassword}</div>
                        )}
                    </motion.div>
                )}

                <div>
                    <span style={{ fontSize: "12px" }}>
                        {!toggle ? `Don't have an account` : `Already have an account`}{" "}
                        {!toggle && <b onClick={() => handleToggle()}>Sign up</b>}
                        {toggle && <b onClick={() => handleToggle()}>Log In</b>}
                    </span>
                    {!toggle && (
                        <button type="submit" className="button infoButton" disabled={loading}>
                            {loading ? "loging..." : "Login"}
                        </button>
                    )}
                    {toggle && (
                        <button type="submit" className="button infoButton" disabled={loading}>
                            {loading ? "Signing...:" : "Sign Up"}
                        </button>
                    )}
                </div>
            </form>
        </motion.div>
    );
}

AuthForm.propTypes = {
    handleToggle: PropTypes.func.isRequired,
    toggle: PropTypes.bool.isRequired,
};
export default Auth;
