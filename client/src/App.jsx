import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useParams,
  useLocation,
} from "react-router-dom";
import "./app.css";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Products from "./components/products";
import Sell from "./components/sell";
import Show from "./components/show";
import LoginForm from "./components/loginForm";
import Profile from "./components/profile.jsx";
import AccountDashboard from "./components/dashboard.jsx";
import Myproducts from "./components/myProducts.jsx";
import Footer from "./components/footer.jsx";
import Edit from "./components/edit.jsx";
import RestaurantsList from "./restaurant/restaurants.jsx";
import HindanVegMenu from "./restaurant/one.jsx";
import Urban from "./restaurant/urban.jsx";
import AadhaarAuthScreen from "./test.jsx";

function App() {
  const [user, setUser] = useState(false);
  const [search, setsearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")).status);
    }
  }, []);

  // paths where navbar/footer should be hidden
  const hideLayoutOn = ["/restaurants","/urban","/aa"];

  const hideLayout = hideLayoutOn.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideLayout && <Navbar setsearch={setsearch} />}

      {/* If search has value → force show Products */}
      {search ? (
        <Products search={search} />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aa" element={<AadhaarAuthScreen></AadhaarAuthScreen>} />
          <Route
            path="/restaurants"
            element={<RestaurantsList></RestaurantsList>}
          />
          <Route
            path="/restaurants/:id"
            element={<HindanVegMenu></HindanVegMenu>}
          />

          <Route path="/urban" element={<Urban></Urban>} />

          <Route path="/products" element={<Products search={search} />} />

          <Route
            path="/myProducts"
            element={<Myproducts search={search} myProd={true} />}
          />

          <Route path="/sell" element={!user ? <LoginForm /> : <Sell />} />

          <Route path="/products/:id" element={<Show />} />

          <Route path="/edit-product/:id" element={<Edit />} />

          <Route path="/category/:id" element={<Products search={search} />} />

          <Route path="/account" element={<AccountDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      )}
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;