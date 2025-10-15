
import React, { Suspense, lazy, Component, ReactNode } from 'react';
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
import { AccessibilityProvider } from './components/AccessibilityProvider';

const LazyLegalAssistant = lazy(() => import('./components/LegalAssistant'));
const LazyFAQ = lazy(() => import('./components/FAQ'));
const LazyBooking = lazy(() => import('./components/Booking'));
const LazyPayment = lazy(() => import('./components/Payment'));
const LazyTestimonials = lazy(() => import('./components/Testimonials'));
const LazyBlog = lazy(() => import('./components/Blog'));

// Error Boundary برای مدیریت خطاها
class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="py-8 text-center text-red-600">
          <p>خطایی در بارگذاری این بخش رخ داده است.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>

      <main id="main-content" role="main">
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>

        <ErrorBoundary>
          <Services />
        </ErrorBoundary>

        <ErrorBoundary>
          <About />
        </ErrorBoundary>

        <ErrorBoundary>
          <Process />
        </ErrorBoundary>

        {/* همه کامپوننت‌ها را با Error Boundary و Suspense اضافه کن */}
        <ErrorBoundary>
          <Suspense fallback={<div className="py-4 text-center"><span className="text-sm text-gray-500">در حال بارگذاری دستیار حقوقی...</span></div>}>
            <LazyLegalAssistant />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<div className="py-4 text-center"><span className="text-sm text-gray-500">در حال بارگذاری سوالات متداول...</span></div>}>
            <LazyFAQ />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<div className="py-4 text-center"><span className="text-sm text-gray-500">در حال بارگذاری فرم رزرو...</span></div>}>
            <LazyBooking />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<div className="py-4 text-center"><span className="text-sm text-gray-500">در حال بارگذاری پرداخت...</span></div>}>
            <LazyPayment />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<div className="py-4 text-center"><span className="text-sm text-gray-500">در حال بارگذاری نظرات...</span></div>}>
            <LazyTestimonials />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<div className="py-4 text-center"><span className="text-sm text-gray-500">در حال بارگذاری وبلاگ...</span></div>}>
            <LazyBlog />
          </Suspense>
        </ErrorBoundary>
      </main>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>

      <ErrorBoundary>
        <ThemeSelector currentTheme={currentTheme} onThemeChange={setTheme} />
      </ErrorBoundary>
    </div>
  );
};

// Critical images that should be preloaded for better performance
const criticalImages: string[] = [
  '/1.png',
  '/2.png',
  '/3.jpg',
  '/4.webp',
  '/5.jpg'
];

const App: React.FC = () => {
  const handleImagesPreloaded = () => {
    console.log('Critical images preloaded successfully');
  };

  const handleFontsLoaded = () => {
    console.log('Fonts loaded successfully');
  };

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
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
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default App;
