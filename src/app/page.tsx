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
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
  </svg>
);

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt || isLoading) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content }),
      });

      const raw = await response.text();
      console.log('Raw response from server:', raw);
      let data;

      try {
        data = JSON.parse(raw);
      } catch (err) {
        throw new Error('Invalid JSON response from server.');
      }

      if (!response.ok) {
        const errorMessage = data?.error || raw || 'An unknown error occurred.';
        throw new Error(errorMessage);
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        content: data.text || 'Maaf, tidak ada jawaban yang tersedia.',
      };


      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        content: `Error: ${error.message}`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {messages.length === 0 && !isLoading && (
        <header className="text-center pt-10">
          <h1 className="text-5xl font-bold">Zarashi</h1>
          <p className="mt-4 text-gray-500 dark:text-white/60">Ask me anything...</p>
        </header>
      )}

      <main className="flex-grow w-full max-w-3xl mx-auto p-4 md:p-8 pb-32">
        <div className="space-y-8">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div className="font-bold text-lg mb-2">
                {msg.sender === 'user' ? 'You' : 'Zarashi'}
              </div>
              <div className="text-gray-800 dark:text-gray-300">
                <article className="prose dark:prose-invert prose-lg max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </article>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col">
              <div className="font-bold text-lg mb-2">Zarashi</div>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="w-full p-4 bg-white dark:bg-[#0D0D0D] sticky bottom-0 border-t border-gray-200 dark:border-transparent">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-end">
            <TextareaAutosize
              className="w-full bg-gray-100 dark:bg-[#1F1F1F] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 resize-none px-5 py-3 pr-16 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-lg"
              placeholder="Type your question here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              maxRows={5}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-3 bottom-1.5 bg-[#323537] disabled:bg-gray-300 dark:disabled:bg-[#1F1F1F] text-white disabled:text-gray-400 dark:disabled:text-gray-500 rounded-full p-2.5 transition-colors"
              disabled={isLoading || !prompt}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
