import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";
import MainNav from "./components/Nav/MainNav";
function App() {
  return (
    <BrowserRouter>
      <div className="w-screen bg-primary font-mono">
        <MainNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/events" element={<Events />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
