import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="relative py-20 bg-slate-900 text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative container mx-auto px-6 z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mx-auto mb-2"></div>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl mb-6 font-medium text-white">
            درباره من
          </h2>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent w-16"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-spin"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent w-16"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Section - Modern Card Design */}
            <div className="order-2 lg:order-1">
              <div className="relative group">
                {/* Main card container */}
                <div className="relative bg-gradient-to-br from-slate-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-lg"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.5s' }}></div>

                  {/* Image container with modern effects */}
                  <div className="relative mx-auto w-fit">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

                    {/* Floating accent elements */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>

                    <img
                      src="/Pic.png"
                      alt="غزاله تقوی"
                      className="relative w-48 sm:w-56 md:w-64 lg:w-72 h-auto object-cover rounded-full shadow-2xl border-4 border-slate-600/50 hover:border-blue-400/50 transition-all duration-500 hover:scale-105"
                      onError={(e) => {
                        console.error('Image failed to load:', e);
                        console.log('Image src:', e.target.src);
                        // Try alternative paths
                        const altPaths = ['/Pic.png', './Pic.png', 'Pic.png', '/public/Pic.png'];
                        let currentIndex = altPaths.indexOf(e.target.src);
                        if (currentIndex < altPaths.length - 1) {
                          e.target.src = altPaths[currentIndex + 1];
                        }
                      }}
                      onLoad={() => console.log('Image loaded successfully')}
                    />
                  </div>


                </div>
              </div>
            </div>

            {/* Text Content - Modern Cards Layout */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="text-center lg:text-right mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  💎 داستان من، رسالت من
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto lg:mx-0 rounded"></div>
              </div>

              {/* Content cards */}
              <div className="space-y-4">
                <div className="group relative bg-gradient-to-br from-blue-900/90 to-blue-800/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/60 hover:border-blue-400/70 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/20">
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-blue-500 border-t-[20px] border-t-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="text-white leading-relaxed">
                    <span className="text-blue-300 font-semibold">من غزاله تقوی‌ام،</span>
                    وکیل پایه یک دادگستری که باور دارم وکالت چیزی فراتر از یک حرفه است. این یک مسئولیت اجتماعی است برای کمک به کسانی که در پیچیده‌ترین شرایط زندگی به دنبال عدالت می‌گردند.
                  </p>
                </div>

                <div className="group relative bg-gradient-to-br from-blue-900/90 to-blue-800/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/60 hover:border-purple-400/70 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20">
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-purple-500 border-t-[20px] border-t-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="text-white leading-relaxed">
                    هر پرونده برای من یک داستان منحصربه‌فرد است. من فقط به قوانین نگاه نمی‌کنم، بلکه با تمام وجود سعی می‌کنم شرایط و احساسات موکلانم را درک کنم و بهترین راه‌حل را ارائه دهم.
                  </p>
                </div>

                <div className="group relative bg-gradient-to-br from-blue-900/90 to-blue-800/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/60 hover:border-emerald-400/70 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/20">
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-emerald-500 border-t-[20px] border-t-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="text-white leading-relaxed">
                    اعتماد شما برای من مقدس است. من متعهد هستم که با صداقت کامل، تخصص حرفه‌ای و تعهد قلبی در کنار شما باشم تا به بهترین نتیجه ممکن دست پیدا کنیم.
                  </p>
                </div>

                {/* Special quote card */}
                <div className="relative group bg-gradient-to-br from-slate-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-600/40 hover:border-blue-400/30 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[12px] border-l-blue-400 border-t-[12px] border-t-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="text-center text-white text-sm font-medium leading-relaxed">
                    ✨ "عدالت بدون عشق، فقط یک کلمه است"
                  </p>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
      <style>{`
        /* About image modern styling */
        .about-img-wrap {
          position: relative;
          display: inline-block;
          border-radius: 9999px;
          transition: transform 300ms cubic-bezier(.2,.9,.2,1);
          will-change: transform;
          overflow: hidden;
          background: transparent;
        }
        .about-img {n
          display: block;
          border-radius: 9999px;
          background: transparent;
          padding: 0;
          box-shadow: none;
          transition: filter 200ms ease, box-shadow 200ms ease, transform 200ms ease;
          border: none;
          /* continuous gentle motion (float + tiny rotate) */
          animation: float-slow 6s ease-in-out infinite;
          will-change: transform;
        }
        .about-img-wrap::after { content: none; }
        .about-img-wrap:hover {
          /* keep wrapper stable; no scale or movement that hides parts of the photo */
          transform: none;
        }
        .about-img:hover {
          /* keep image size unchanged on hover; add a subtle glow only */
          transform: translateZ(0);
          box-shadow: 0 22px 56px rgba(59,130,246,0.10);
          filter: none;
          transform: scale(1.05);
        }
        @media (max-width: 640px) {
          .about-img {
            animation-duration: 4s;
          }
        }

        @keyframes float-slow {
          0% { transform: translateY(0) rotate(0.0deg); }
          25% { transform: translateY(-6px) rotate(-0.4deg); }
          50% { transform: translateY(-10px) rotate(0.6deg); }
          75% { transform: translateY(-6px) rotate(-0.2deg); }
          100% { transform: translateY(0) rotate(0.0deg); }
        }
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3)) hue-rotate(0deg);
          }
          25% {
            background-position: 25% 50%;
            filter: drop-shadow(0 0 25px rgba(124, 58, 237, 0.4)) hue-rotate(90deg);
          }
          50% {
            background-position: 50% 50%;
            filter: drop-shadow(0 0 30px rgba(5, 150, 105, 0.5)) hue-rotate(180deg);
          }
          75% {
            background-position: 75% 50%;
            filter: drop-shadow(0 0 25px rgba(220, 38, 38, 0.4)) hue-rotate(270deg);
          }
        }
        @keyframes textGlow {
          0% {
            text-shadow:
              0 0 10px rgba(255, 255, 255, 0.8),
              0 0 20px rgba(255, 255, 255, 0.6),
              0 0 30px rgba(59, 130, 246, 0.8),
              0 0 40px rgba(147, 51, 234, 0.6),
              0 0 50px rgba(16, 185, 129, 0.4),
              2px 2px 10px rgba(0, 0, 0, 0.9);
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
          }
          100% {
            text-shadow:
              0 0 5px rgba(255, 255, 255, 0.9),
              0 0 15px rgba(255, 255, 255, 0.8),
              0 0 25px rgba(59, 130, 246, 0.9),
              0 0 35px rgba(147, 51, 234, 0.7),
              0 0 45px rgba(16, 185, 129, 0.5),
              1px 1px 8px rgba(0, 0, 0, 0.8);
            filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.7));
          }
        }
        @keyframes floatText {
          0%, 100% {
            transform: perspective(500px) rotateX(5deg) translateY(0px);
          }
          50% {
            transform: perspective(500px) rotateX(5deg) translateY(-8px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .about-img { animation: none !important; transform: none !important; }
        }
        @media (max-width: 1024px) {
          .about-img { width: auto; /* Remove fixed small width, let Tailwind classes handle sizing */ }
        }
        @media (min-width: 1280px) {
          /* on very large screens allow a smaller inset so more of the photo shows */
          .about-img { clip-path: inset(4% round 50%); -webkit-clip-path: inset(4% round 50%); }
        }
        @media (min-width: 1024px) {
          /* shift image slightly left to sit closer to the text */
          .about-img-wrap { margin-left: -56px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .about-img-wrap, .about-img { transition: none !important; animation: none !important; transform: none !important; }
        }

      `}</style>
    </section>
  );
};

export default About;
