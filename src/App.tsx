import React, { useState, useCallback } from 'react';
import { Wallet } from 'ethers';
import { Clipboard, Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';

interface WalletInfo {
  seedPhrase: string;
  address: string;
  privateKey: string;
}

function App() {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      
      const newWallets: WalletInfo[] = [];
      
      for (const line of lines) {
        try {
          // Check if the line contains a valid seed phrase (12, 15, 18, 21, or 24 words)
          const words = line.trim().split(/\s+/);
          const validWordCounts = [12, 15, 18, 21, 24];
          
          if (!validWordCounts.includes(words.length)) {
            console.warn(`Skipping invalid seed phrase: "${line.substring(0, 10)}..."`);
            continue;
          }
          
          const wallet = Wallet.fromMnemonic(line.trim());
          
          newWallets.push({
            seedPhrase: line.trim(),
            address: wallet.address,
            privateKey: wallet.privateKey,
          });
        } catch (err) {
          console.error(`Error processing line: ${line.substring(0, 10)}...`, err);
        }
      }
      
      setWallets(newWallets);
      
      if (newWallets.length > 0) {
        setSuccess(`Successfully processed ${newWallets.length} seed phrases.`);
      } else {
        setError('No valid seed phrases found in the file.');
      }
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Error reading file. Please make sure it contains valid seed phrases.');
    } finally {
      setLoading(false);
      // Reset the file input
      event.target.value = '';
    }
  }, []);

  const copyToClipboard = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const exportToCSV = useCallback(() => {
    if (wallets.length === 0) return;
    
    const csvContent = [
      ['Seed Phrase', 'Address', 'Private Key'].join(','),
      ...wallets.map(wallet => 
        [
          `"${wallet.seedPhrase}"`, 
          wallet.address, 
          wallet.privateKey
        ].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'wallet_addresses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [wallets]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Upload Seed Phrases</h2>
            <p className="mb-4 text-gray-300">
              Upload a .txt file containing one seed phrase per line. Each phrase will be converted to an Ethereum wallet address.
            </p>
            
            <div className="mb-6">
              <label 
                htmlFor="file-upload" 
                className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-700 border-2 border-gray-600 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-500 focus:outline-none"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="font-medium text-gray-300">
                    {loading ? 'Processing...' : 'Drop your seedphrase.txt file here or click to browse'}
                  </span>
                </div>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".txt" 
                  onChange={handleFileUpload}
                  disabled={loading}
                />
              </label>
            </div>
            
            {error && (
              <div className="mb-4 p-4 bg-red-900/50 border border-red-800 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-4 bg-green-900/50 border border-green-800 rounded-lg flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-green-300">{success}</p>
              </div>
            )}
          </div>
          
          {wallets.length > 0 && (
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Generated Wallets</h2>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Seed Phrase</th>
                      <th className="px-4 py-3 text-left">Wallet Address</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallets.map((wallet, index) => (
                      <tr key={index} className="border-t border-gray-700">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs truncate">
                            {wallet.seedPhrase}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-mono text-sm truncate max-w-xs">
                            {wallet.address}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(wallet.address, index)}
                              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                              title="Copy address"
                            >
                              {copiedIndex === index ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <Clipboard className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="mt-4 text-sm text-gray-400">
                Note: All processing is done locally in your browser. Your seed phrases and private keys are never sent to any server.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;