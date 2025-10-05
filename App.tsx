
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Process from './components/Process';
import Footer from './components/Footer';
import HonorsPage from './pages/HonorsPage';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import ThemeSelector from './components/ThemeSelector';
import ImagePreloader from './components/ImagePreloader';
import FontOptimizer from './components/FontOptimizer';

const LazyLegalAssistant = lazy(() => import('./components/LegalAssistant'));
const LazyFAQ = lazy(() => import('./components/FAQ'));
const LazyBooking = lazy(() => import('./components/Booking'));
const LazyPayment = lazy(() => import('./components/Payment'));
const LazyTestimonials = lazy(() => import('./components/Testimonials'));
const LazyBlog = lazy(() => import('./components/Blog'));

const MainPage: React.FC = () => {
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
        <Hero />
        <Services />
        <About />
        <Process />
        <Suspense fallback={<div className="py-20 text-center">در حال بارگذاری...</div>}>
          <LazyLegalAssistant />
          <LazyFAQ />
          <LazyBooking />
          <LazyPayment />
          <LazyTestimonials />
          <LazyBlog />
        </Suspense>
      </main>
      <Footer />
      <ThemeSelector currentTheme={currentTheme} onThemeChange={setTheme} />
    </div>
  );
};

// Critical images that should be preloaded for better performance
const criticalImages = [
  '/1.png',
  '/2.png',
  '/3.jpg',
  '/4.webp',
  '/5.jpg',
  '/Font/IranNastaliq.ttf'
];

const App: React.FC = () => {
  const handleImagesPreloaded = () => {
    console.log('Critical images preloaded successfully');
  };

  const handleFontsLoaded = () => {
    console.log('Fonts loaded successfully');
  };

  return (
    <ThemeProvider>
      <FontOptimizer onFontsLoaded={handleFontsLoaded} />
      <ImagePreloader images={criticalImages} onComplete={handleImagesPreloaded} />
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/honors" element={<HonorsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
