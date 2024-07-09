import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    const name = localStorage.getItem("userName") || "User";
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserName("");
    navigate("/login");
  };

  const getNavItemClass = (path: string) => {
    return location.pathname === path
      ? "header__nav-item active"
      : "header__nav-item";
  };

  const handleRegisterClick = () => navigate("/register");
  const handleLoginClick = () => navigate("/login");
  const handleHomeClick = () => navigate("/home");
  const handleMeClick = () => navigate("/me");
  const handleFriendClick = () => navigate("/friend");
  const handleGroupClick = () => navigate("/group");
  const handleEventsClick = () => navigate("/events");

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "isAuthenticated" && event.newValue === "true") {
        const name = localStorage.getItem("userName") || "User";
        setIsAuthenticated(true);
        setUserName(name);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleLogin = (event: CustomEvent) => {
      const { userName } = event.detail;
      setIsAuthenticated(true);
      setUserName(userName);
    };

    window.addEventListener("userLoggedIn", handleLogin as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleLogin as EventListener);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__mainbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="header__logo">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/ptit-k5.appspot.com/o/Screenshot_2024-07-04_090459-removebg-preview.png?alt=media&token=e21209cd-aad1-4ffc-97c8-69e7d87fa322"
              alt="HobbyHub Logo"
              className="shoplogo"
            />
          </div>
          <div className="header__search">
            <input
              type="text"
              placeholder="Tìm kiếm trên Hoppy"
              className="header__search-input"
            />
            <span className="material-symbols-outlined">search</span>
          </div>
        </div>
        <div>
          <ul className="header__nav-list" style={{ gap: "80px" }}>
            <li className={getNavItemClass("/home")} onClick={handleHomeClick}>
              <i className="fa-solid fa-house fs-3"></i>
            </li>
            <li className={getNavItemClass("/me")} onClick={handleMeClick}>
              <i className="fa-regular fa-user fs-3"></i>
            </li>
            <li
              className={getNavItemClass("/friend")}
              onClick={handleFriendClick}
            >
              <i className="fa-solid fa-user-group fs-3"></i>
            </li>
            <li
              className={getNavItemClass("/group")}
              onClick={handleGroupClick}
            >
              <i className="fa-solid fa-users-line fs-3"></i>
            </li>
            <li
              className={getNavItemClass("/events")}
              onClick={handleEventsClick}
            >
              <i className="fa-regular fa-calendar fs-3"></i>
            </li>
          </ul>
        </div>
        <nav className="header__nav">
          <ul className="header__nav-list">
            {!isAuthenticated && (
              <>
                <li className="header__nav-item" onClick={handleRegisterClick}>
                  <span className="material-symbols-outlined">person</span> Đăng
                  kí
                </li>
                <li className="header__nav-item" onClick={handleLoginClick}>
                  <span className="material-symbols-outlined">person</span> Đăng
                  nhập
                </li>
              </>
            )}
            {isAuthenticated && (
              <>
                <div className="header__profile">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/ptit-k5.appspot.com/o/kisspng-computer-icons-user-profile-user-account-clip-art-5b07b23ad4dd52.9335900715272310348719.jpg?alt=media&token=1f66fd21-3b78-45bb-bbeb-d10f047d4378"
                    alt="Profile"
                    className="header__profile-img"
                  />
                  <div className="header__profile-name">{userName}</div>
                </div>
                <li className="header__nav-item" onClick={handleLogout}>
                  <span className="material-symbols-outlined">logout</span> Đăng
                  xuất
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
