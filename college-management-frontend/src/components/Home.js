import React from 'react';

import Slider from './Slider';

const Home = ({ onLoginClick, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100 min-w-screen">
      
      {/* Slider */}
    
        <Slider />
    
    </div>
  );
};

export default Home;
