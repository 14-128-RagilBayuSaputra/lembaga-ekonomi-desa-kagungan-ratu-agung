import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast"; // <--- Tambahkan Import ini
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Pasang Toaster di sini */}
    <Toaster position="top-center" reverseOrder={false} />
    <App />
  </React.StrictMode>
);