import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AppProvider>
      <ScrollToTopOnRouteChange />
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
