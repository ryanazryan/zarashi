'use client';

import React, { useState, FormEvent } from 'react';

// Icon for the send button (simple SVG)
const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.statusText}`);
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
    <div className="flex flex-col h-screen bg-white dark:bg-black text-black dark:text-white">
      <main className="flex-grow overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto h-full">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black dark:border-white"></div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              <p className="font-bold">Error:</p>
              <p>{errorMessage}</p>
            </div>
          )}

          {story && !isLoading && (
            <article className="prose dark:prose-invert prose-lg max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">{story}</p>
            </article>
          )}

          {!story && !isLoading && !errorMessage && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-200% text-transparent bg-clip-text animate-gradient-flow">
                Zarashi
              </h1>
              <p className="mt-2 text-black/60 dark:text-white/60">Let's create a story. What's on your mind?</p>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 bg-white dark:bg-black border-t border-black/10 dark:border-white/10">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center bg-white dark:bg-black rounded-xl p-2 shadow-sm border border-black/20 dark:border-white/20">
            <textarea
              className="w-full bg-transparent text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none resize-none px-3 py-2"
              placeholder="Type your story idea here..."
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
              className="bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 disabled:bg-black/20 dark:disabled:bg-white/20 text-white dark:text-black rounded-lg p-2 ml-2 transition-colors"
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