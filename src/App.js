import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import FooterNavigation from './components/FooterNavigation';
import Home from './pages/basic-page/Home';
import About from './pages/basic-page/About';
import Contact from './pages/basic-page/Contact';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import NotFound from './pages/basic-page/NotFound';
import AddProduct from './pages/product/Create';  
import EditProduct from './pages/product/Edit';
import ProductIndex from './pages/product/Index';
import './App.css';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<ProductIndex />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <FooterNavigation />
      </div>
    </Router>
  );
};

export default App;