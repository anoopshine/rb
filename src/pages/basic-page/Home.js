import { Link } from 'react-router-dom';
// Home Page Component
const Home = () => {
  return (
    <div className="page">
      <h1>Welcome to Home Page</h1>
      <p>This is the home page of our React Router DOM application.</p>
      <div className="button-group">
        <Link to="/about" className="btn btn-primary">Learn More</Link>
        <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
      </div>
    </div>
  );
};
export default Home;

