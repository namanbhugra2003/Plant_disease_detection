import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import BackgroundSvg from "../images/117.svg";
import "../../src/index.css";
import WelcomeOverlay from "../components/WelcomeOverlay";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Update the URL to match your backend login endpoint
      const response = await axios.post('http://localhost:5557/api/auth/login', formData);
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        
        setUserData({
          name: response.data.username,
          role: response.data.role
        });

        setShowWelcome(true);
        
        // Redirect based on user role
        setTimeout(() => {
          setShowWelcome(false);
        switch(response.data.role) {
          case 'admin':
            navigate('/admin');
            break;
            case 'manager':
              navigate('/manager-dashboard');
              break;
            case 'supplier':
              navigate('/materials');
              break;  
          case 'farmer':
          case 'OrganicFarmer':
          case 'cropFarmer':
          case 'greenhouseFarmer':
          case 'forester':
          case 'gardener':
          case 'soilTester':
          case 'agriculturalResearcher':
            navigate('/loghome');
            break;
          default:
            navigate('/loghome');
        }
      }, 2000);
      } else {
        setError('Login failed. Please try again.');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      <WelcomeOverlay show={showWelcome} userData={userData} />
      {/* Background Layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BackgroundSvg})`, // Use the imported SVG
          backgroundSize: "cover",
          filter: "blur(5px)", // Apply blur only to the background
          zIndex: -1, // Ensure it stays behind all content
        }}
      ></div>

      {/* Login Form */}
      <div className="w-full max-w-xs m-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 justify-center text-green-600 align-middle flex mt-10">
          Login
        </h1>
        <form
          className="rounded-3xl px-10 pt-8 pb-10 mb-6 mt-auto bg-slate-20 border-spacing-4 shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
  <label
    className="block text-gray-700 text-sm font-bold mb-2"
    htmlFor="email"
  >
    Email
  </label>
  <input
    className="shadow my-3 focus:border-green-600 focus:ring-6 appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="email"
    name="email"
    type="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
    required
  />
</div>
<div className="mb-6 relative">
  <label
    className="block text-gray-700 text-sm font-bold mb-2"
    htmlFor="password"
  >
    Password
  </label>
  <input
    className="shadow focus:border-green-600 focus:ring-6 appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="password"
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="********"
    value={formData.password}
    onChange={handleChange}
    required
  />
  {/* Password visibility toggle icon */}
  <span
    className="absolute inset-y-0 right-3 flex mt-7 items-center cursor-pointer text-gray-400 hover:text-green-600"
    onClick={() => setShowPassword((prev) => !prev)}
  >
    {showPassword ? <MdVisibilityOff size={24} /> : <MdVisibility size={24} />}
  </span>
  {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
  {successMessage && (
    <p className="text-green-500 text-xs italic mt-2">{successMessage}</p>
  )}
</div>
          <div className="items-center justify-between">
            <button
              className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 rounded-xl mx-3 px-20 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
          <div className="text-center mt-5">
            <a
              className="inline-block align-baseline mr-4 text-xs text-green-600 hover:text-green-900"
              href="#"
            >
              Forgot Password?
            </a>
            <a
              href="/register"
              className="text-xs inline-block align-baseline text-black-500 hover:text-green-900"
            >
              Create an Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;