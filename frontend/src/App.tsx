import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';

// Import i18n (needs to be bundled)
import './utils/i18n';

// Import components
import LanguageSelector from './components/LanguageSelector';
import CandidateForm from './components/CandidateForm';
import CandidatesList from './components/CandidatesList';
import CandidateDetails from './components/CandidateDetails';

// NavLink component with active state
const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
        isActive
          ? 'border-blue-500 text-gray-900'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
    >
      {children}
    </Link>
  );
};

// App component
function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-gray-900">{t('app.title')}</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <NavLink to="/">{t('nav.home')}</NavLink>
                  <NavLink to="/candidates">{t('nav.candidates')}</NavLink>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<div className="p-6 bg-white rounded shadow">Home Page</div>} />
            <Route path="/candidates" element={<CandidatesList />} />
            <Route path="/candidates/add" element={<CandidateForm />} />
            <Route path="/candidates/:id/edit" element={<CandidateForm />} />
            <Route path="/candidates/:id" element={<CandidateDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
