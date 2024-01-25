import React, { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Card from "./Components/Card";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Mycontext from "./FireBase/Context";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <BrowserRouter>
      <Mycontext>
        <Toaster />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegisterPage />} />
          <Route path="/card" element={<Card />} />
          <Route path="/UpdateTask/:ID" element={<Card />} />
        </Routes>
      </Mycontext>
    </BrowserRouter>
  );
}

export default App;
