import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import ErrorPage from './pages/ErrorPage';  
import Navbar from './components/Navbar';
import SiteLoader from './components/SiteLoader';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SiteLoader />;
  }

  return (
    <ProfileProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="*" element={<ErrorPage />} />  
            </Routes>
          </div>
        </div>
      </Router>
    </ProfileProvider>
  );
}

export default App;
