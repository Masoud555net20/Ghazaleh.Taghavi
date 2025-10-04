
import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Process from './components/Process';
import Footer from './components/Footer';

const LazyLegalAssistant = lazy(() => import('./components/LegalAssistant'));
const LazyFAQ = lazy(() => import('./components/FAQ'));
const LazyBooking = lazy(() => import('./components/Booking'));
const LazyPayment = lazy(() => import('./components/Payment'));
const LazyTestimonials = lazy(() => import('./components/Testimonials'));
const LazyBlog = lazy(() => import('./components/Blog'));

const App: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
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
    </div>
  );
};

export default App;
