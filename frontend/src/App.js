import AppRouter from "./routes/AppRouter";
import { ApiProvider } from "./context/ApiContext";
import { use, useEffect } from "react";

export default function App() {
  
  return (
    <ApiProvider>
      <AppRouter/>
    </ApiProvider>
  );
}
