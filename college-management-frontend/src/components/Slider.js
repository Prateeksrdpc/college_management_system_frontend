import React, { useState, useEffect } from 'react';
import slide1 from '../images/University-of-Georgia-10.jpg';
import slide2 from '../images/florida.jpg';
import slide3 from '../images/tlk66ul1fraenhwxduii.jpg';

const images = [slide1, slide2, slide3];

function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically change slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Previous Button */}
      <button
        className="absolute top-1/2 left-4 text-white text-3xl font-bold transform -translate-y-1/2 bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        onClick={prevSlide}
      >
        &#10094;
      </button>

      {/* Slide Image */}
      <img
        src={images[currentIndex]}
        alt="slider"
        className="w-full h-full object-cover"
      />

      {/* Next Button */}
      <button
        className="absolute top-1/2 right-4 text-white text-3xl font-bold transform -translate-y-1/2 bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        onClick={nextSlide}
      >
        &#10095;
      </button>
    </div>
  );
}

export default Slider;
