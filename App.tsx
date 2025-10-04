
import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Process from './components/Process';
import Footer from './components/Footer';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import ThemeSelector from './components/ThemeSelector';

const LazyLegalAssistant = lazy(() => import('./components/LegalAssistant'));
const LazyFAQ = lazy(() => import('./components/FAQ'));
const LazyBooking = lazy(() => import('./components/Booking'));
const LazyPayment = lazy(() => import('./components/Payment'));
const LazyTestimonials = lazy(() => import('./components/Testimonials'));
const LazyBlog = lazy(() => import('./components/Blog'));

const AppContent: React.FC = () => {
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

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
