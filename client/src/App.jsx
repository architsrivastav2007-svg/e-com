import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import MyOrders from './pages/MyOrders.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import Profile from './pages/Profile.jsx';
import Wishlist from './pages/Wishlist.jsx';
import NotFound from './pages/NotFound.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;
