// About Page Component
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="page">
      <h1>About Us</h1>
      <p>We are a team of developers passionate about creating amazing web applications using React and React Router DOM.</p>
      <h2>Our Mission</h2>
      <p>To build scalable and user-friendly applications that provide exceptional user experiences.</p>
      <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
    </div>
  );
};
export default About;