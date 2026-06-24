import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import api from '../lib/axios';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';

const suggestedPrompts = [
  "What's the best keyboard under ₦20,000?",
  "Build me a streaming setup for under ₦150,000",
  "I play FPS games — what mouse should I use?",
  "Compare mechanical vs membrane keyboards"
];

const Assistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e, forcedInput = null) => {
    if (e) e.preventDefault();
    const text = forcedInput || input;
    if (!text.trim() || isTyping) return;

    ReactGA.event({ category: 'AI Assistant', action: 'Message Sent' });

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Create an empty assistant message to append stream to
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith('data: ')) {
            const content = trimmed.slice(6);
            if (content === '[DONE]') break;

            if (content.startsWith('[ERROR]')) {
              const errMsg = content.slice(7).trim();
              setMessages(prev => {
                const newArr = [...prev];
                const lastIndex = newArr.length - 1;
                newArr[lastIndex] = {
                  ...newArr[lastIndex],
                  content: errMsg
                };
                return newArr;
              });
              break;
            }

            accumulatedContent += content;
            setMessages(prev => {
              const newArr = [...prev];
              const lastIndex = newArr.length - 1;
              newArr[lastIndex] = {
                ...newArr[lastIndex],
                content: accumulatedContent
              };
              return newArr;
            });
          }
        }
      }

      if (buffer && buffer.trim().startsWith('data: ')) {
        const content = buffer.trim().slice(6);
        if (content !== '[DONE]') {
          if (content.startsWith('[ERROR]')) {
            const errMsg = content.slice(7).trim();
            setMessages(prev => {
              const newArr = [...prev];
              const lastIndex = newArr.length - 1;
              newArr[lastIndex] = {
                ...newArr[lastIndex],
                content: errMsg
              };
              return newArr;
            });
          } else {
            accumulatedContent += content;
            setMessages(prev => {
              const newArr = [...prev];
              const lastIndex = newArr.length - 1;
              newArr[lastIndex] = {
                ...newArr[lastIndex],
                content: accumulatedContent
              };
              return newArr;
            });
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].content = 'Sorry, I am experiencing technical difficulties right now. Please try again later.';
        return newArr;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col pb-36 lg:pb-0">
      {/* Header */}
      <div className="bg-bg-surface border-b border-bg-border p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan relative">
          <Bot className="w-6 h-6 text-brand-cyan" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-status-success rounded-full border-2 border-bg-surface"></div>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            NEXUS <Sparkles className="w-4 h-4 text-brand-violet" />
          </h1>
          <p className="font-body text-sm text-text-secondary">Your AI Gaming Advisor</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-bg-base overflow-y-auto p-6 md:p-12 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <Bot className="w-16 h-16 text-text-muted mb-6" />
            <h2 className="font-display text-2xl font-bold mb-2">How can I help you gear up?</h2>
            <p className="font-body text-text-secondary mb-8">
              Ask me about product recommendations, compatibility, or building a full setup within your budget.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(null, prompt)}
                  className="p-3 bg-bg-surface border border-bg-border hover:border-brand-cyan text-sm text-text-primary rounded-lg text-left transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-brand-violet' : 'bg-brand-cyan/20 border border-brand-cyan'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-bg-base" /> : <Bot className="w-4 h-4 text-brand-cyan" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 font-body leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-brand-violet text-bg-base rounded-tr-none' 
                    : 'bg-bg-raised border border-bg-border text-text-primary rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-cyan/20 border border-brand-cyan flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-brand-cyan" />
                </div>
                <div className="bg-bg-raised border border-bg-border rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-surface border-t border-bg-border z-30 lg:static md:px-12">
        <form onSubmit={handleSubmit} className="relative flex items-center max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Type your message..."
            className="w-full bg-bg-base border border-bg-border rounded-lg pl-4 pr-12 py-4 font-body focus:border-brand-cyan outline-none transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-brand-cyan text-bg-base rounded hover:bg-brand-cyan/90 disabled:bg-bg-border disabled:text-text-muted transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-xs text-text-muted mt-3 max-w-5xl mx-auto">
          NEXUS is an AI. Verify important product details on the <Link to="/products" className="hover:underline text-text-secondary">products page</Link>.
        </p>
      </div>
    </div>
  );
};

export default Assistant;
