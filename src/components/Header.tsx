import React from 'react';

export function Header() {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-20">          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#team">Time</NavLink>
            <NavLink href="#matches">Partidas</NavLink>
            <NavLink href="#news">Notícias</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm uppercase tracking-wider"
    >
      {children}
    </a>
  );
}