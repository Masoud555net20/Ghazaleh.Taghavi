import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import HonorsGallery from '../components/HonorsGallery';
import Footer from '../components/Footer';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import ThemeSelector from '../components/ThemeSelector';

const HonorsPageContent: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  // Temporary default styles since themes are disabled
  const defaultStyles = {
    background: '#ffffff',
    color: '#000000'
  };

  return (
    <div
      className="min-h-screen transition-all duration-500"
      style={defaultStyles}
    >
      <Header />
      <main>
        <div className="relative">
          <div className="flex justify-center py-4 bg-gray-50">
            <Link
              to="/"
              className="bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition-transform duration-300 hover:scale-105 text-sm"
            >
              ← بازگشت به صفحه اصلی
            </Link>
          </div>
          <HonorsGallery />
        </div>
      </main>
      <Footer />
      <ThemeSelector currentTheme={currentTheme} onThemeChange={setTheme} />
    </div>
  );
};

const HonorsPage: React.FC = () => {
  return (
    <ThemeProvider>
      <HonorsPageContent />
    </ThemeProvider>
  );
};

export default HonorsPage;
