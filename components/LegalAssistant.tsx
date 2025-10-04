import React, { useState } from 'react';
import { getLegalAdvice } from '../services/groqService';

const LegalAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('لطفاً سوال خود را وارد کنید.');
      return;
    }
    setError('');
    setIsLoading(true);
    setResponse('');

    try {
      console.log('Sending query to Groq:', query);
      const result = await getLegalAdvice(query);
      console.log('Received result from Groq:', result);
      if (result.startsWith('متاسفانه')) {
        throw new Error(result);
      }
      setResponse(result);
    } catch (err: any) {
      console.error('Error during API call:', err);
      setError(err.message || 'خطایی در ارتباط با سرویس رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  const formattedResponse = response.split('\n').map((line, index) => {
    line = line.trim();
    const highlightText = 'برای بررسی دقیق‌تر این موضوعات و دریافت راهکار حقوقی مشخص، حتماً یک جلسه مشاوره رسمی با خانم غزاله تقوی رزرو کنید.';
    if (line.includes(highlightText)) {
      const name = 'غزاله تقوی';
      const nameIndex = line.indexOf(name);
      const beforeName = line.substring(0, nameIndex);
      const afterName = line.substring(nameIndex + name.length);

      return (
        <div key={index} className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-3 sm:p-4 rounded-xl my-3 sm:my-4 shadow-2xl overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-indigo-400/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>

          {/* Floating particles effect */}
          <div className="absolute top-2 right-4 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
          <div className="absolute top-4 left-4 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '1.5s' }}></div>
          <div className="absolute bottom-2 right-8 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.5s' }}></div>

          <p className="relative text-sm sm:text-lg font-bold text-center leading-relaxed">
            {beforeName}
            <span className="inline-block animate-pulse text-yellow-200 drop-shadow-lg transform hover:scale-110 transition-transform duration-300">
              {name}
            </span>
            {afterName}
          </p>

          {/* Bottom shine effect */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      );
    }
    if (line.startsWith('* ')) {
      return (
        <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 border-r-4 border-purple-500 p-3 sm:p-3 rounded-xl mb-3 shadow-md">
          <li className="text-center sm:text-right text-sm sm:text-base leading-relaxed text-gray-700">
            ✨ {line.substring(2)}
          </li>
        </div>
      );
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <h4 key={index} className="text-lg sm:text-xl font-bold my-4 sm:my-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 border-b-2 border-gradient-to-r from-purple-200 to-blue-200 pb-3">
          🌟 {line.substring(2, line.length - 2)}
        </h4>
      );
    }
    if (line.trim() !== '') {
      return (
        <div key={index} className="bg-gradient-to-r from-white to-purple-50 p-3 sm:p-3 rounded-xl mb-3 sm:mb-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow duration-300">
          <p className="text-sm sm:text-base leading-relaxed text-center sm:text-right text-gray-700">
            {line}
          </p>
        </div>
      );
    }
    return null;
  }).filter(Boolean);

  return (
    <section id="assistant" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">مشاور حقوقی هوشمند</h2>
          <p className="mt-4 text-xl text-gray-600">
            سوال حقوقی خود را بپرسید و پاسخ اولیه دریافت کنید.
            <br />
            <span className="font-semibold text-red-600 animate-pulse">توجه: این پاسخ جایگزین مشاوره تخصصی با وکیل نیست.</span>
          </p>
          <div className="mt-4 w-24 h-1 bg-blue-700 mx-auto rounded"></div>
        </div>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="سوال حقوقی خود را اینجا بنویسید..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            ></textarea>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              type="submit"
              className="w-full mt-4 bg-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال پردازش...
                </>
              ) : (
                'دریافت پاسخ'
              )}
            </button>
          </form>
          {response && (
            <>
              <div className="mt-8 p-3 sm:p-8 border-t border-gray-200 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 rounded-xl shadow-lg">
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">💡 پاسخ دستیار هوشمند</h3>
                  <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 mx-auto rounded"></div>
                </div>
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-3 sm:p-6 shadow-md border border-purple-100">
                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    {response.includes('* ') ? (
                      <ul className="text-center space-y-3 sm:space-y-3">
                        {formattedResponse}
                      </ul>
                    ) : (
                      <div className="text-center space-y-3 sm:space-y-4">
                        {formattedResponse}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Encouragement Section */}
              <div className="mt-6 p-4 sm:p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl border-2 border-green-200 shadow-lg">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-2xl">🌟</span>
                    <h4 className="text-lg sm:text-xl font-bold text-green-800">
                      قدم بعدی شما برای حل مشکل حقوقی!
                    </h4>
                    <span className="text-2xl">🌟</span>
                  </div>

                  <p className="text-sm sm:text-base text-green-700 leading-relaxed">
                    حالا که پاسخ اولیه را دریافت کردید، برای بررسی دقیق‌تر و دریافت راهکارهای تخصصی،
                    حتماً یک جلسه مشاوره حضوری یا آنلاین با خانم غزاله تقوی رزرو کنید.
                  </p>

                  <div className="bg-green-100 rounded-lg p-3 border border-green-300">
                    <p className="text-sm font-semibold text-green-800 mb-2">
                      💎 چرا مشاوره با خانم تقوی؟
                    </p>
                    <ul className="text-xs sm:text-sm text-green-700 space-y-1 text-right">
                      <li>• بررسی دقیق و شخصی‌سازی شده پرونده شما</li>
                      <li>• ارائه راهکارهای عملی و قابل اجرا</li>
                      <li>• همراهی کامل تا حل نهایی مشکل</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                    <a
                      href="#booking"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-center text-sm sm:text-base"
                    >
                      🕒 رزرو وقت مشاوره حضوری
                    </a>
                    <a
                      href="#contact"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-center text-sm sm:text-base"
                    >
                      📞 تماس برای مشاوره آنلاین
                    </a>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                    <p className="text-xs sm:text-sm text-yellow-800 font-medium">
                      ⏰ ساعات کاری: شنبه تا چهارشنبه ۸:۰۰ تا ۱۸:۰۰
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 text-center rounded-lg">
            <p className="text-base font-semibold animate-pulse">برای استفاده بهتر و بهینه تر از دستیار هوشمند لطفا فیلتر شکن خود را روشن کنید.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalAssistant;
