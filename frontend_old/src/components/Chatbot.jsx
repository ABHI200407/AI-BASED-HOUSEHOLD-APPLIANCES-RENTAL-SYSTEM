import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Video, LogIn, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm Furlo, your personal AI assistant. Here to help you with all things Novorent.", sender: 'bot' },
    { id: 2, text: "Pick an option below or type your query to get started. What can I do for you?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleQuickReply = (action) => {
    setMessages(prev => [...prev, { id: Date.now(), text: action, sender: 'user' }]);
    
    setTimeout(() => {
      let response = '';
      if (action === 'Schedule a Video Call') {
        response = 'Connecting you to our video scheduling calendar...';
      } else if (action === 'Existing Customer Login') {
        response = 'Sure! Taking you to the login page now.';
        setTimeout(() => { navigate('/login'); setIsOpen(false); }, 1500);
      } else if (action === 'Our Offerings') {
        response = 'We offer premium furniture and appliances on rent across 10+ Indian cities! Check out our catalog.';
        setTimeout(() => { navigate('/category/all'); setIsOpen(false); }, 1500);
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
    }, 500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "I'm currently a demo bot! But our support team will reach out to you shortly regarding your query.", 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-teal-600 text-white shadow-2xl flex items-center justify-center hover:bg-teal-700 transition-all z-40 hover:scale-105 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[360px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl z-50 flex flex-col border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-inner">
                  F
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900">Furlo</h3>
                  <p className="text-xs text-slate-500 font-medium">Hi! How can I help?</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              <div className="text-center text-xs font-bold text-slate-400 mb-6">TODAY 4:14 PM</div>
              
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-teal-600 text-white rounded-br-sm font-medium' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm font-medium leading-relaxed'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <button onClick={() => handleQuickReply('Schedule a Video Call')} className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-teal-700 transition-colors flex items-center gap-1.5">
                  <Video size={14} /> Schedule a Video Call
                </button>
                <button onClick={() => handleQuickReply('Existing Customer Login')} className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-teal-700 transition-colors flex items-center gap-1.5">
                  <LogIn size={14} /> Existing Customer Login
                </button>
                <button onClick={() => handleQuickReply('Our Offerings')} className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-teal-700 transition-colors flex items-center gap-1.5">
                  <Sparkles size={14} /> Our Offerings
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type here..." 
                  className="w-full bg-teal-50 border-none rounded-full py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-medium placeholder-teal-600/50"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-teal-600 hover:bg-teal-100 rounded-full transition-colors">
                  <Send size={16} className="ml-1" />
                </button>
              </form>
              <div className="text-center mt-3 text-[10px] text-slate-400 font-bold tracking-wider">
                Powered by <strong className="text-slate-500">haptik</strong>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
