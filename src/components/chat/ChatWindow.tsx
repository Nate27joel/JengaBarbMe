import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, User, Check, CheckCheck, Paperclip, Smile } from 'lucide-react';
import { Message, User as UserType } from '../../types';

interface ChatWindowProps {
  recipient: UserType;
  bookingId?: string;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ recipient, bookingId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulated initial messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        conversationId: 'c1',
        senderId: recipient.id,
        text: `Hi! I'm looking forward to our appointment regarding booking #${bookingId?.slice(0, 5) || '12345'}.`,
        createdAt: new Date(Date.now() - 3600000),
        isRead: true
      },
      {
        id: '1',
        conversationId: 'c1',
        senderId: 'currentUser', // Local state representation
        text: `Awesome, just wanted to confirm the location on the map is accurate.`,
        createdAt: new Date(Date.now() - 1800000),
        isRead: true
      }
    ];
    setMessages(initialMessages);
  }, [recipient.id, bookingId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId: 'c1',
      senderId: 'currentUser',
      text: inputText,
      createdAt: new Date(),
      isRead: false
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate reply
    setTimeout(() => {
      setIsTyping(true);
    }, 800);

    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: Math.random().toString(36).substr(2, 9),
        conversationId: 'c1',
        senderId: recipient.id,
        text: "Got it! I'll be there on time. See you soon!",
        createdAt: new Date(),
        isRead: false
      };
      setMessages(prev => [...prev, reply]);
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-full max-w-[400px] bg-bg-deep rounded-2xl shadow-2xl border border-border-muted flex flex-col z-[100] overflow-hidden h-[500px]"
    >
      {/* Header */}
      <div className="p-4 bg-bg-sidebar border-b border-border-muted flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-border-muted">
              <img src={recipient.avatarUrl || `https://ui-avatars.com/api/?name=${recipient.fullName}`} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-bg-sidebar rounded-full shadow-lg" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight leading-none mb-1">{recipient.fullName}</h4>
            <p className="text-[9px] font-black uppercase tracking-widest text-brand">Online Now</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-bg-surface rounded-lg transition-colors">
          <X className="w-4 h-4 text-[#555]" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border-muted scrollbar-track-transparent"
      >
        {messages.map((msg, i) => {
          const isMe = msg.senderId === 'currentUser';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                isMe 
                ? 'bg-brand text-bg-deep font-medium rounded-tr-none' 
                : 'bg-bg-surface text-white border border-border-muted rounded-tl-none'
              }`}>
                {msg.text}
                <div className={`flex items-center gap-1 mt-1 justify-end opacity-60 text-[8px] font-bold uppercase tracking-widest ${isMe ? 'text-bg-deep' : 'text-[#555]'}`}>
                  {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && (msg.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                 </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-bg-surface text-brand italic text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl rounded-tl-none border border-border-muted flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1 h-1 bg-brand rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-brand rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 h-1 bg-brand rounded-full animate-bounce [animation-delay:0.4s]" />
              </span>
              Typing...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-bg-sidebar border-t border-border-muted">
        <div className="relative group">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..." 
            className="w-full bg-bg-surface border border-border-muted rounded-xl pl-4 pr-12 py-3 text-xs text-white outline-none focus:border-brand transition-all font-medium"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand text-bg-deep rounded-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-3">
           <button type="button" className="text-[#444] hover:text-brand transition-colors"><Paperclip className="w-4 h-4" /></button>
           <button type="button" className="text-[#444] hover:text-brand transition-colors"><Smile className="w-4 h-4" /></button>
           <p className="text-[8px] font-black text-[#333] uppercase tracking-widest ml-auto">Direct encrypted channel</p>
        </div>
      </form>
    </motion.div>
  );
};
