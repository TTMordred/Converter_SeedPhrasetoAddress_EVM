import React from 'react';
import { Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-gray-800 border-b border-gray-700 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wallet className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">EVM Wallet Tools</h1>
              <p className="text-gray-400 text-sm">Secure Ethereum wallet management tools</p>
            </div>
          </div>
          <nav className="flex space-x-6">
            <Link
              to="/"
              className={`text-${location.pathname === '/' ? 'blue-400' : 'gray-300'} hover:text-blue-400 transition-colors`}
            >
              Seedphrase Converter
            </Link>
            <Link
              to="/csv-extractor"
              className={`text-${location.pathname === '/csv-extractor' ? 'blue-400' : 'gray-300'} hover:text-blue-400 transition-colors`}
            >
              CSV Key Extractor
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;