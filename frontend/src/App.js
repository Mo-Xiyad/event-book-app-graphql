import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";
import MainNav from "./components/Nav/MainNav";
import Auth from "./pages/Auth";
import { useState } from "react";
import { useSelector } from "react-redux";
function App() {
  const { token } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <div className="w-screen bg-primary font-mono">
        <MainNav />
        <Routes>
          <Route path="/" element={!token && <Navigate to="/auth" />} />
          <Route path="/" exact element={<Home />} />
          {!token && <Route path="/auth" exact element={<Auth />} />}
          <Route path="/events" exact element={<Events />} />
          <Route
            path="/bookings"
            exact
            element={!token ? <Navigate to="/auth" /> : <Bookings />}
          />
          {/* NoMatch */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
