import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import { UserProvider } from './context/UserContext';
import Footer from './components/Footer';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 pb-24">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;