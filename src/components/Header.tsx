import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-20">          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/team">Time</NavLink>
            <NavLink to="/matches">Partidas</NavLink>
            <NavLink to="/news">Notícias</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm uppercase tracking-wider"
    >
      {children}
    </Link>
  );
}