import AppRouter from "./routes/AppRouter";
import { ApiProvider, useApi } from "./context/ApiContext";
import { useEffect } from "react";

function AppContent() {
  const { setCityLogged, setCityId, setDepartmentLogged,setStudentLogged } = useApi(); 

  useEffect(() => {
    if (sessionStorage.getItem("cityLogged")) {
      setCityLogged(true);
      setCityId(sessionStorage.getItem("cityId"));
    }
    if (sessionStorage.getItem("departmentLogged")) {
      setDepartmentLogged(true);
    }
    if(sessionStorage.getItem("studentLogged")){
      setStudentLogged(true);
    }
  }, []);

  return <AppRouter />;
}

export default function App() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  );
}
