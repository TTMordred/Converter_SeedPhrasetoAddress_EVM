import React from 'react';
import { Shield, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">About This Tool</h3>
            <p className="text-gray-400 mb-4">
              The EVM Wallet Seedphrase Converter is a secure tool for generating Ethereum-compatible 
              wallet addresses from seed phrases. It supports all EVM-compatible blockchains including 
              Ethereum, Binance Smart Chain, Polygon, and more.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Security Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <Shield className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>All processing is done locally in your browser</span>
              </li>
              <li className="flex items-start">
                <Lock className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>Your seed phrases and private keys are never sent to any server</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>Open-source code for transparency and security</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} EVM Wallet Seedphrase Converter. All rights reserved.</p>
          <p className="mt-1">This tool is for educational purposes only. Always keep your seed phrases secure.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;