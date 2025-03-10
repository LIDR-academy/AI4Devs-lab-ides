import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-cover bg-center h-screen text-white flex items-center justify-center" style={{ backgroundImage: 'url(/path/to/your/image.jpg)' }}>
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Website</h1>
        <p className="text-xl mb-8">Discover amazing content and features.</p>
        <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get Started</a>
      </div>
    </section>
  );
};

export default HeroSection; 