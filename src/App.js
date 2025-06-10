import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import About from './pages/basic-page/About';
import Home from './pages/basic-page/Home';
import Contact from './pages/basic-page/Contact';
import NotFound from './pages/basic-page/NotFound';
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;