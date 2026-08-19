import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Run from './pages/Run';
import Results from './pages/Results';
import MapPage from './pages/mappage';
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentRunId, setCurrentRunId] = useState('');

  const navigate = (page) => {
    setCurrentPage(page);
  };
  const showMapsNav = !!currentRunId && (currentPage === 'results' || currentPage === 'maps');

  return (
    <div className="main-container">
      <Header currentPage={currentPage} onNavigate={navigate} showMapsNav={showMapsNav} />
      <div className="content-container">
        {currentPage === 'home' && <Home onNavigate={navigate} />}
        {currentPage === 'run' && <Run onNavigate={navigate} setCurrentRunId={setCurrentRunId} />}
        {currentPage === 'results' && <Results currentRunId={currentRunId} />}
        {/* Render Map page */}
        {currentPage === 'maps' && <MapPage currentRunId={currentRunId} />}
      </div>
    </div>
  );
};

export default App;
