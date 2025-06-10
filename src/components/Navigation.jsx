import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-title">My App</h1>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={location.pathname === '/contact' ? 'nav-link active' : 'nav-link'}
            >
              Contact
            </Link>
          </li>
            <li>
            <Link 
              to="/register" 
              className={location.pathname === '/register' ? 'nav-link active' : 'nav-link'}
            >
              Register
            </Link>
          </li>
            <li>
            <Link 
              to="/login" 
              className={location.pathname === '/login' ? 'nav-link active' : 'nav-link'}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navigation;