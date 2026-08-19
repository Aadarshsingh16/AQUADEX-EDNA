import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Run from './pages/Run';
import Results from './pages/Results';
import MapPage from './pages/mappage';
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentRunId, setCurrentRunId] = useState('demo-abyssal');

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleSelectDemo = (demoId) => {
    setCurrentRunId(demoId);
    setCurrentPage('results');
  };

  const showMapsNav = !!currentRunId && (currentPage === 'results' || currentPage === 'maps');

  return (
    <div className="main-container">
      <Header currentPage={currentPage} onNavigate={navigate} showMapsNav={showMapsNav} />
      <div className="content-container">
        {currentPage === 'home' && (
          <Home 
            onNavigate={navigate} 
            onSelectDemo={handleSelectDemo}
          />
        )}
        {currentPage === 'run' && (
          <Run 
            onNavigate={navigate} 
            setCurrentRunId={setCurrentRunId} 
            onSelectDemo={handleSelectDemo}
          />
        )}
        {currentPage === 'results' && (
          <Results 
            currentRunId={currentRunId} 
            setCurrentRunId={setCurrentRunId}
            onSelectDemo={handleSelectDemo}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'maps' && (
          <MapPage 
            currentRunId={currentRunId} 
            onNavigate={navigate}
          />
        )}
      </div>
    </div>
  );
};

export default App;
