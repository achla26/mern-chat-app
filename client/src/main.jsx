// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Router from "./router.jsx";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <Router />
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </>
);
