
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Register Service Worker for performance optimization
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    // Measure and log performance metrics
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (perfData) {
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
        const totalLoadTime = perfData.loadEventEnd - perfData.fetchStart;

        console.log('Performance Metrics:', {
          'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
          'TCP Connection': perfData.connectEnd - perfData.connectStart,
          'Server Response': perfData.responseEnd - perfData.responseStart,
          'DOM Processing': perfData.domContentLoadedEventEnd - perfData.responseEnd,
          'Resource Loading': perfData.loadEventStart - perfData.domContentLoadedEventEnd,
          'Total Load Time': totalLoadTime,
          'DOM Content Loaded': domContentLoaded,
          'Full Load Time': loadTime
        });

        // Send performance metrics to analytics (if needed)
        if (totalLoadTime > 3000) {
          console.warn('Page load time is high:', totalLoadTime + 'ms');
        }

        // نمایش زمان لود برای کاربر در کنسول
        console.log('🚀 صفحه با موفقیت لود شد!', {
          'زمان کل لود': Math.round(totalLoadTime) + 'ms',
          'زمان DOM': Math.round(domContentLoaded) + 'ms',
          'زمان منابع': Math.round(loadTime) + 'ms'
        });
      }
    }, 0);
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Could not find root element to mount to");
  document.body.innerHTML = '<div style="color: red; padding: 20px;">خطا: المان root یافت نشد!</div>';
} else {
  console.log('Root element found, creating React root...');
  const root = ReactDOM.createRoot(rootElement);

  console.log('Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App component rendered successfully');
}
