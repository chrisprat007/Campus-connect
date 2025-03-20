import { useState, useEffect } from "react";
import { FaBuilding, FaCity, FaKey } from "react-icons/fa";
import api from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";

export default function DepartmentLogin() {
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {setDepartmentLogged}=useApi();
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const departmentsRes = await api.get("/departments/");
        const citiesRes = await api.get("/city/");
        console.log("value",departmentsRes.data)
        setDepartments(departmentsRes.data);
        setCities(citiesRes.data);
      } catch (err) {
        console.error("Error fetching options", err);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log(secretKey);
      const response = await api.post("/departments/login", { department, college:city, secretKey });
      
      setDepartmentLogged(true);
      if(response.status===200){
        navigate("/departments/dashboard");
      }
      console.log(response.data);
      sessionStorage.setItem("departmentLogged",true);
      sessionStorage.setItem("departmentId",response.data.departmentId);
      sessionStorage.setItem("departmentName",response.data.departmentName);
      sessionStorage.setItem("cityId",response.data.collegeId);
      sessionStorage.setItem("cityName",response.data.collegeName);
      
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-indigo-900">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Department Login</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaBuilding className="absolute left-3 top-3 text-gray-400" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full pl-10 p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.name}>{dep.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FaCity className="absolute left-3 top-3 text-gray-400" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full pl-10 p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select City</option>
              {cities.map((ct) => (
                <option key={ct.id} value={ct.name}>{ct.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FaKey className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              className="w-full pl-10 p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
        <p className="text-center text-gray-400 text-sm mt-4">
          <Link to="/city/login">
            Login as City
          </Link>
        </p>
      </div>
    </div>
  );
}