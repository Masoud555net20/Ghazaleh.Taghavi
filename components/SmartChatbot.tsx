import React, { useState, useRef, useEffect } from 'react';
import { MaterialButton, MaterialCard } from './MaterialDesign';
import { FadeInOnScroll } from './AdvancedAnimations';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const SmartChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'سلام! من دستیار هوشمند حقوقی غزاله تقوی هستم. چطور می‌تونم کمکتون کنم؟',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response (in real app, this would call the Groq API)
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('سلام') || input.includes('درود')) {
      return 'سلام! خوشحال می‌شم بتونم کمکتون کنم. در مورد چه موضوع حقوقی می‌تونم راهنمایی‌تون کنم؟';
    }

    if (input.includes('طلاق') || input.includes('جدایی')) {
      return 'برای مشاوره طلاق، پیشنهاد می‌کنم با سرکار خانم تقوی مستقیماً تماس بگیرید. ایشون در زمینه حقوق خانواده تخصص دارن و می‌تونن راهنمایی دقیق‌تری ارائه بدن.';
    }

    if (input.includes('ملک') || input.includes('خونه') || input.includes('مستغلات')) {
      return 'در زمینه دعاوی ملکی، سرکار خانم تقوی تجربه زیادی دارن. می‌تونید برای مشاوره حضوری وقت رزرو کنید تا جزئیات پرونده‌تون بررسی بشه.';
    }

    if (input.includes('وقت') || input.includes('مشاوره') || input.includes('ملاقات')) {
      return 'برای رزرو وقت مشاوره می‌تونید از طریق دکمه "رزرو وقت مشاوره" در سایت اقدام کنید یا مستقیماً با دفتر تماس بگیرید.';
    }

    if (input.includes('هزینه') || input.includes('قیمت') || input.includes('تعرفه')) {
      return 'هزینه مشاوره بسته به نوع پرونده و پیچیدگی موضوع متفاوته. برای اطلاع دقیق از تعرفه‌ها لطفاً با دفتر تماس بگیرید.';
    }

    if (input.includes('آدرس') || input.includes('مکان') || input.includes('دفتر')) {
      return 'دفتر وکالت سرکار خانم تقوی در [آدرس دفتر] قرار داره. برای دیدن نقشه دقیق، از بخش نقشه تعاملی در سایت استفاده کنید.';
    }

    // Default responses
    const responses = [
      'متشکرم از سؤال‌تون. برای مشاوره دقیق‌تر، پیشنهاد می‌کنم با سرکار خانم تقوی مستقیماً در تماس باشید.',
      'این موضوع نیاز به بررسی جزئیات بیشتری داره. همکارانم در دفتر می‌تونن راهنمایی دقیق‌تری ارائه بدن.',
      'سؤال خوبی پرسیدید! برای پاسخ دقیق به این موضوع، بهتره که جزئیات بیشتری بدونم یا با وکیل‌مون مشورت کنید.',
      'هر پرونده شرایط خاص خودش رو داره. سرکار خانم تقوی بعد از بررسی مدارک می‌تونن مشاوره دقیق‌تری بدن.'
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <FadeInOnScroll delay={1000}>
          <MaterialButton
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl"
            size="lg"
          >
            {isOpen ? '✕' : '💬'}
          </MaterialButton>
        </FadeInOnScroll>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <FadeInOnScroll direction="up" delay={200}>
          <div className="fixed bottom-24 left-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg">دستیار هوشمند حقوقی</h3>
                <p className="text-sm opacity-90">غزاله تقوی - وکیل پایه یک دادگستری</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-md border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-md shadow-md border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isTyping}
                />
                <MaterialButton
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="px-4 py-2"
                  size="sm"
                >
                  ارسال
                </MaterialButton>
              </div>
            </div>
          </div>
        </FadeInOnScroll>
      )}
    </>
  );
};

export default SmartChatbot;
