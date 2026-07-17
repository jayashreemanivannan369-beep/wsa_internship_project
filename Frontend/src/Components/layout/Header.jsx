import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCartItems } from "../../redux/actions/cartActions";
import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Search from "./Search";
import "../../App.css";
import { logout } from "../../redux/actions/userActions";

const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
  dispatch(fetchCartItems());
  }, [dispatch]);
  const logoutHandler = async () => {
  await dispatch(logout());
  navigate("/users/login");
  };
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  console.log("Header cartItems:", cartItems);


  return (
    <>
      <nav className="navbar row sticky-top">
        {/* logo */}
        <div className="col-12 col-md-3">
          <Link to="/">
            <img src="/images/logo.webp" alt="logo" className="logo" />
          </Link>
        </div>

        {/* search bar and search icon */}

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/eats/stores/search/:keyword" element={<Search />} />
          </Routes>
        </div>

        {/* Login */}
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          {/* ml-> margin left (3unit from left) */}
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span className="ml-3" id="cart">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {cartItems.length}
            </span>
          </Link>
              <span
                className="material-symbols-outlined web_logo"
                onClick={logoutHandler}
                style={{ cursor: "pointer" }}
              >
                logout
              </span>
            
         
        </div>
      </nav>
    </>
  );
};

export default Header;