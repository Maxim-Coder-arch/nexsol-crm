'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../styles/chat/chat.scss";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Короче меня зовут Arcee AI. Задавай любой вопрос о бизнесе, маркетинге или разработке. Я обязательно помогу 😄',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || 'Извините, не удалось получить ответ',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Произошла ошибка. Попробуйте позже.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <h1>AI Ассистент</h1>
        <p>Помощник на базе искусственного интеллекта</p>
      </div>

      <div className="chat__container">
        <div className="chat__messages" id="chat-messages">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`chat__message chat__message--${message.sender}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="chat__message-content">
                  <div className="chat__message-header">
                    <span className="chat__message-sender">
                      {message.sender === 'ai' ? 'Arcee' : 'Вы'}
                    </span>
                    <span className="chat__message-time">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="chat__message-text">
                    {message.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              className="chat__message chat__message--ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="chat__message-content">
                <div className="chat__message-header">
                  <span className="chat__message-sender">Arcee AI</span>
                </div>
                <div className="chat__typing">
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat__input-area">
          <textarea
            className="chat__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение... (Enter для отправки)"
            rows={1}
            disabled={loading}
          />
          <button
            className="chat__send-btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : '→'}
          </button>
        </div>

        <div className="chat__footer">
          <span>Нейросеть Arcee AI</span>
          <span>{messages.length - 1} сообщений</span>
        </div>
      </div>
    </div>
  );
}