import React from 'react';

function Card({ title, count }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 m-4 flex flex-col justify-center items-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-4xl font-bold text-blue-600">{count}</p>
    </div>
  );
}

export default Card;
