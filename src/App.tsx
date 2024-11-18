import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TeamInfo } from './components/TeamInfo';
import { NextMatch } from './components/NextMatch';
import { LandingPage } from './components/LandingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  const [showMain, setShowMain] = useState(false);

  if (!showMain) {
    return <LandingPage onEnter={() => setShowMain(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-black text-white">
      
          
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto space-y-12">
              <Routes>
                <Route path="/" element={
                  <>
                    <TeamInfo />
                    <NextMatch />
                  </>
                } />
                <Route path="/team" element={<TeamInfo />} />
                <Route path="/matches" element={<NextMatch />} />
                {/* Adicione mais rotas conforme necessário */}
              </Routes>
            </div>
          </main>

          <footer className="border-t border-gray-800 py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400 font-medium">© 2024 Sport Club Corinthians Paulista</p>
              <p className="text-gray-500 text-sm mt-2">Fiel até o fim! 🖤</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}