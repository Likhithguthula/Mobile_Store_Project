import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Mobiles from "../pages/Mobiles";
import MobileDetails from "../pages/MobileDetails";
import AddMobile from "../pages/AddMobile";
import EditMobile from "../pages/EditMobile";
import Cart from "../pages/Cart";
import Compare from "../pages/Compare";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mobiles" element={<Mobiles />} />
      <Route path="/mobiles/:id" element={<MobileDetails />} />
      <Route path="/add-mobile" element={<AddMobile />} />
      <Route path="/edit-mobile/:id" element={<EditMobile />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
