import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser , FaLeaf } from "react-icons/fa";
import "../../src/index.css";

const NavigationBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkLoginStatus = () => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");
  
        if (storedUser && token) {
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      };
  
      checkLoginStatus();
      window.addEventListener('storage', checkLoginStatus);
  
      return () => {
        window.removeEventListener('storage', checkLoginStatus);
      };
    }, []);
  
    const handleSignOut = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      setUser(null);
      setIsLoggedIn(false);
      navigate("/");
    };

    return (
        <header className="header top-0 h-14 sticky backdrop-filter backdrop-blur-lg bg-green-900 flex items-center justify-between mx-auto px-8 left-0 w-full z-10">
            <div className="w-1/4 flex items-center">
                    <FaLeaf className="text-green-200 text-3xl mr-2" />
                    <h1 className="text-3xl font-bold">
                        <Link to="/loghome" className="text-white hover:text-green-500 flex items-center">
                            AgriGuard
                        </Link>
                    </h1>
                </div>

            

            <div className="w-3/12 flex justify-end items-center">
                <div className="relative group">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-green-800 text-white hover:bg-green-600 transition duration-300">
                        <FaUser size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default NavigationBar;