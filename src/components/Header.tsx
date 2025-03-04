import React from 'react';
import { Wallet } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wallet className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">EVM Wallet Seedphrase Converter</h1>
              <p className="text-gray-400 text-sm">Securely generate Ethereum addresses from seed phrases</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;