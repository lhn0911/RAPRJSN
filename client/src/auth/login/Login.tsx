import React, { useState } from "react";
import { FaLock, FaFacebook, FaTwitter, FaGoogle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/reducers/Login";
import "bootstrap/dist/css/bootstrap.min.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, status, user } = useSelector((state: any) => state.auth);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  const handleSignup = () => {
    navigate("/register");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (user) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", user.name);
    navigate("/home");
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-info-subtle">
      <div>
        <h1 className="text-black text-center mb-4">ĐĂNG NHẬP</h1>
        <div
          className="bg-white p-4 rounded shadow text-center w-100"
          style={{ maxWidth: "400px" }}
        >
          <div className="mb-3 position-relative">
            <AiOutlineMail className="position-absolute top-50 start-0 translate-middle-y text-primary ms-2" />
            <input
              type="email"
              placeholder="Email"
              className={`form-control ps-5 ${
                status === "failed" && email === "" ? "is-invalid" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3 position-relative">
            <FaLock className="position-absolute top-50 start-0 translate-middle-y text-primary ms-2" />
            <input
              type="password"
              placeholder="Mật khẩu"
              className={`form-control ps-5 ${
                status === "failed" && password === "" ? "is-invalid" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FiEye
              className="position-absolute top-50 translate-middle-y text-primary me-2"
              style={{ right: "10px", cursor: "pointer" }}
              onClick={() => setPassword((prev) => (prev ? "" : password))}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-primary w-100 mb-2" onClick={handleLogin}>
            ĐĂNG NHẬP
          </button>
          <a href="#" className="d-block mb-3 text-primary">
            Quên mật khẩu?
          </a>
          <a href="#" onClick={handleSignup}>
            Bạn chưa có tài khoản? Đăng kí
          </a>
        </div>
        <div className="d-flex gap-2 align-items-center mt-4">
          <button className="btn btn-primary d-flex align-items-center">
            <FaFacebook className="me-2" /> Facebook
          </button>
          <button className="btn btn-info d-flex align-items-center">
            <FaTwitter className="me-2" /> Twitter
          </button>
          <button className="btn btn-danger d-flex align-items-center">
            <FaGoogle className="me-2" /> Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
