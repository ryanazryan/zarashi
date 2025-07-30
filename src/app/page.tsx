'use client';

import React, { useState, FormEvent } from 'react';

// Ikon untuk tombol kirim (SVG sederhana)
const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setStory('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Terjadi kesalahan saat menghasilkan cerita.');
      }

      const data = await response.json();
      setStory(data.story);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <main className="flex-grow overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto h-full">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-800/50 p-4 rounded-lg text-red-300">
              <p className="font-bold">Error:</p>
              <p>{errorMessage}</p>
            </div>
          )}

          {story && !isLoading && (
            <article className="prose prose-invert prose-lg max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">{story}</p>
            </article>
          )}

          {!story && !isLoading && !errorMessage && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-4xl font-bold text-white">Azryan AI</h1>
              <p className="mt-2 text-white">Mari kita ciptakan sebuah kisah. Apa yang ada di pikiranmu?</p>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center bg-gray-800 rounded-xl p-2">
            <textarea
              className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none px-3 py-2"
              placeholder="Ketik ide cerita Anda di sini..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg p-2 ml-2 transition-colors"
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