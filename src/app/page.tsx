'use client';

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TextareaAutosize from 'react-textarea-autosize';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  content: string;
}

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const ZarashiAvatar = () => (
  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#5B5E77] text-white text-sm font-semibold">
    Z
  </div>
);

export default function Page() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [messages, isLoading, isDarkMode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt || isLoading) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    const aiMessageId = Date.now() + 1;
    const aiMessage: Message = { id: aiMessageId, sender: 'ai', content: '' };
    setMessages(prev => [...prev, aiMessage]);

    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, content: msg.content + chunk } : msg
          )
        );
      }
    } catch (error: any) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, content: `Error: ${error.message}` } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''} bg-light-bg dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-500`}>
      <header className="relative z-10 w-full p-4 flex justify-end items-center bg-transparent">
        <div className="flex items-center p-2 rounded-full bg-gray-200 dark:bg-gray-800 shadow-md">
          <span className="font-semibold text-gray-800 dark:text-gray-200 ml-2">Zarashi</span>
          <div
            className="relative w-14 h-8 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full mx-3 cursor-pointer"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            <div
              className={`absolute left-1 bg-white dark:bg-blue-500 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}
            ></div>
          </div>
          <div className="mr-2 text-gray-800 dark:text-gray-200">
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
          </div>
        </div>
      </header>

      {messages.length === 0 && !isLoading && (
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-500 ">Zarashi</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">Ask me anything...</p>
        </div>
      )}

      <main className="relative z-10 flex-grow w-full max-w-2xl mx-auto p-4 md:p-8 pb-32">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-start`}>
              {msg.sender === 'ai' && (
                <div className="flex-shrink-0 mr-3">
                  <ZarashiAvatar />
                </div>
              )}
              <div className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100'
              }`}>
                <article className="prose prose-sm dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </article>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="z-10 w-full p-4 bg-transparent backdrop-blur-sm sticky bottom-0">
        <div className="max-w-2xl mx-auto flex items-center bg-white dark:bg-gray-800 rounded-full px-5 py-3 shadow-lg border border-gray-300 dark:border-gray-700">
          <TextareaAutosize
            className="flex-grow bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none pr-3"
            placeholder="Ask me anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            maxRows={4}
            disabled={isLoading}
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="p-2 rounded-full bg-blue-500 text-white disabled:bg-gray-400 disabled:text-gray-200 hover:bg-blue-600 transition-colors"
            disabled={isLoading || !prompt}
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">Powered by Azryan</p>
      </footer>
    </div>
  );
}