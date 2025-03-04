import React, { useState } from 'react';
import { Upload, Download } from 'lucide-react';

const CsvExtractor: React.FC = () => {
  const [csvContent, setCsvContent] = useState('');
  const [extractedKeys, setExtractedKeys] = useState('');

  const handleLoadCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
      document.getElementById('extractBtn')?.removeAttribute('disabled');
    };
    reader.readAsText(file);
  };

  const handleExtractKeys = () => {
    if (!csvContent) {
      alert('Please load a CSV file first.');
      return;
    }

    // Parse CSV and extract private keys
    const lines = csvContent.split('\n');
    const privateKeys: string[] = [];

    // Skip header row if it exists
    const startIndex = lines[0].includes('Private Key') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;

      // Split by comma, but handle commas inside quotes
      const row = parseCSVLine(lines[i]);

      // Private key should be the last column
      if (row.length > 0) {
        const privateKey = row[row.length - 1].trim();
        if (privateKey && privateKey.startsWith('0x')) {
          privateKeys.push(privateKey);
        }
      }
    }

    setExtractedKeys(privateKeys.join('\n'));
    document.getElementById('downloadBtn')?.removeAttribute('disabled');
  };

  const handleDownload = () => {
    if (!extractedKeys) {
      alert('No private keys to download.');
      return;
    }

    const blob = new Blob([extractedKeys], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Private_Keys.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper function to parse CSV line properly handling quoted fields
  const parseCSVLine = (text: string) => {
    const result: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cell);
        cell = '';
      } else {
        cell += char;
      }
    }

    // Add the last cell
    result.push(cell);
    return result;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">CSV Private Key Extractor</h2>
        
        <div className="info bg-gray-700/50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
          <p className="mb-2">This tool extracts private keys from a CSV file with the format: "Seed Phrase,Address,Private Key"</p>
          <p className="mb-2">The extracted private keys will be formatted one per line, which you can save to a Private_Key.txt file.</p>
          <p>All processing happens in your browser - no data is sent to any server.</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Step 1: Import CSV File</h3>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              className="hidden"
              onChange={handleLoadCsv}
            />
            <label
              htmlFor="csvFile"
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </label>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">CSV Content:</label>
            <textarea
              id="csvContent"
              value={csvContent}
              readOnly
              className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-3 font-mono text-sm"
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Step 2: Extract Private Keys</h3>
          <button
            id="extractBtn"
            onClick={handleExtractKeys}
            disabled={!csvContent}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Extract Private Keys
          </button>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Extracted Keys:</label>
            <textarea
              id="extractedKeys"
              value={extractedKeys}
              readOnly
              className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-3 font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Step 3: Download Private Keys</h3>
          <button
            id="downloadBtn"
            onClick={handleDownload}
            disabled={!extractedKeys}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Private_Keys.txt
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvExtractor;