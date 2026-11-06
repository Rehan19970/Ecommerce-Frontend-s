import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { sendChatMessage } from '../services/chatbotService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Salam! Main Roshys AI hoon. How can I help you today?',
      products: null,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const greetingMessages = [
    "How can I help you today? 😊",
    "Looking for a new lawn suit? 🌸",
    "Kya aapko koi product dhoondna hai? 🛍️"
  ];
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [showGreeting, setShowGreeting] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen && showGreeting) {
      const interval = setInterval(() => {
        setGreetingIndex((prev) => (prev + 1) % greetingMessages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, showGreeting, greetingMessages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage, products: null }]);
    setLoading(true);

    try {
      const data = await sendChatMessage(userMessage);
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, products: data.products },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, masla ho gaya.', products: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Right side, thora upar (WhatsApp ke upar) */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
        {!isOpen && showGreeting && (
          <div className="bg-white text-brand-black px-4 py-3 rounded-2xl shadow-xl border border-gray-100 text-sm relative animate-fade-up max-w-[250px]">
            {greetingMessages[greetingIndex]}
            {/* Bubble pointer right side */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
            <button 
              onClick={() => setShowGreeting(false)}
              className="absolute -top-2 -right-2 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-gray-600 hover:bg-gray-200 shadow-sm"
            >
              ✕
            </button>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowGreeting(false);
          }}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isOpen ? 'bg-brand-gold hover:scale-105' : 'bg-brand-black hover:scale-110'
          } ${!isOpen && 'animate-bounce'}`}
        >
          {isOpen ? (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              <circle cx="8" cy="13" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="16" cy="13" r="1.5" fill="currentColor" stroke="none"/>
              <path d="M9 18h6"/>
            </svg>
          )}
        </button>
      </div>

      {/* Chat Window - right side, thora aur upar */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-40 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white shadow-2xl border border-gray-200 flex flex-col rounded-2xl overflow-hidden animate-fade-up">
          <div className="bg-brand-black text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-6 h-6 text-brand-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                  <circle cx="8" cy="13" r="1.5" fill="currentColor" stroke="none"/>
                  <circle cx="16" cy="13" r="1.5" fill="currentColor" stroke="none"/>
                  <path d="M9 18h6"/>
                </svg>
              </div>
              <div>
                <p className="font-heading text-base leading-tight font-bold">Roshys AI</p>
                <p className="text-[10px] text-brand-gold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-black text-white rounded-2xl rounded-tr-sm'
                      : 'bg-white text-brand-black border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm w-full'
                  }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.products.map((p) => (
                        <Link
                          key={p.id}
                          to={p.link}
                          className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <img src={p.image} alt={p.name} className="w-12 h-16 object-cover rounded" />
                          <div>
                            <p className="font-semibold text-sm">{p.name}</p>
                            <p className="text-brand-gold font-bold">Rs. {p.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-brand-gold rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-2 h-2 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white shrink-0">
            <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-1 focus-within:border-brand-gold focus-within:bg-white transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Apna sawal likhein..."
                className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-full bg-brand-black text-white flex items-center justify-center hover:bg-brand-gold transition disabled:opacity-50 shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;