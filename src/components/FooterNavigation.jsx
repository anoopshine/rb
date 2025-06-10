import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
const FooterNavigation = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar footer-navbar">
      <div className="nav-container footer-nav-container">
        <h1 className="nav-title footer-tile">RB</h1>
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
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default FooterNavigation;