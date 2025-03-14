import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import api from "../../utils/api";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const {setCityLogged,setCityId}=useApi();
  const navigate=useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");


    try {
      const response = await api.post("/city/login", { email, password });
      console.log("Login Success:", response.data);
      setLoading(false);
      setCityLogged(true);
      sessionStorage.setItem("cityId",response.data.id);
      sessionStorage.setItem("cityName",response.data.name);
      setCityId(response.data.id);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-indigo-900">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
         
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

         
          <div className="flex items-center justify-between text-gray-300">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2 accent-blue-500"
              />
              Remember Me
            </label>
            <a href="#" className="text-blue-400 hover:underline">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-400 text-sm mt-4">
          <Link to="/department/login">
            Login as Department
          </Link>
        </p>
      </div>
    </div>
  );
}
