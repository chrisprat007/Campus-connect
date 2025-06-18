import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [cityLogged,setCityLogged]=useState(false);
  const [cityId,setCityId]=useState("");
  const [departmentLogged,setDepartmentLogged]=useState(false);
  const [studentLogged,setStudentLogged]=useState(false);
  const [departmentDetails,setDepartmentDetails]=useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, postsRes] = await Promise.all([
          api.get(`/departments/${cityId}`),
          api.get("/post/"),
        ]);
        setDepartments(departmentsRes.data);
        setPosts(postsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    console.log("Updated Departments State:", departments);
  }, [departments]);

  return (
    <ApiContext.Provider value={{ cities, departments, posts,cityLogged,setCityLogged
      ,cityId,
      setCityId,
      departmentLogged,
      setDepartmentLogged,
      studentLogged,
      setStudentLogged
     }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
