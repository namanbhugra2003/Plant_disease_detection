import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "../../src/index.css";
import { FaLeaf } from "react-icons/fa";

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
        <header className="header top-0 sticky backdrop-filter backdrop-blur-lg bg-green-900 flex items-center justify-between mx-auto px-8 left-0 w-full z-10">
          <div className="w-1/4 flex items-center">
        <FaLeaf className="text-green-200 text-3xl mr-2" />
        <h1 className="text-3xl font-bold">
            <Link to="/loghome" className="text-white hover:text-green-500 flex items-center">
                AgriGuard
            </Link>
        </h1>
    </div>
            <nav className="nav font-semibold text-lg">
                <ul className="flex items-center justify-center space-x-6">
                    <li className="p-4 border-b-2 border-green-600 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer">
                        <Link to="/loghome" className="text-white hover:text-green-500">Home</Link>
                    </li>
                    <li className="p-4 border-b-2 border-green-600 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer">
                        <Link to="/viewarticles" className="text-white hover:text-green-500">Articles</Link>
                    </li>
                    <li className="p-4 border-b-2 border-green-600 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer">
                        <Link to="/materials/buy" className="text-white hover:text-green-500">AgriStore</Link>
                    </li>
                    <li className="p-4 border-b-2 border-green-600 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer">
                        <Link to="/dashboard/aitreatment" className="text-white hover:text-green-500">AI Treatments</Link>
                    </li>
                    <li className="p-4 border-b-2 border-green-600 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer">
                        <Link to="/dashboard/userprofile" className="text-white hover:text-green-500">AgriHub</Link>
                    </li>
                    
                </ul>
            </nav>

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