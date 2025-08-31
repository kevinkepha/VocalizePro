import React, { useState, useRef } from 'react';
import { Upload, Play, Pause, Download, FileText, Headphones, Settings, Zap, Clock, DollarSign } from 'lucide-react';

const VocalizePro = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [settings, setSettings] = useState({
    voice: 'nova',
    model: 'tts-1-hd',
    apiKey: ''
  });
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef(null);

  const voices = [
    { value: 'alloy', label: 'Alloy - Neutral' },
    { value: 'echo', label: 'Echo - Male' },
    { value: 'fable', label: 'Fable - British Male' },
    { value: 'onyx', label: 'Onyx - Deep Male' },
    { value: 'nova', label: 'Nova - Female' },
    { value: 'shimmer', label: 'Shimmer - Soft Female' }
  ];

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'text/plain') {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target.result);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const estimateCost = (text) => {
    const charCount = text.length;
    const costPer1K = settings.model === 'tts-1' ? 0.015 : 0.030;
    return (charCount / 1000) * costPer1K;
  };

  const estimateTime = (text) => {
    const chunks = Math.ceil(text.length / 4096);
    return chunks * 3; // Rough estimate: 3 seconds per chunk
  };

  const splitTextIntoChunks = (text) => {
    const maxChars = 4096;
    const paragraphs = text.split('\n\n');
    const chunks = [];
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      if (paragraph.length > maxChars) {
        const sentences = paragraph.split(/(?<=[.!?])\s+/);
        
        for (const sentence of sentences) {
          if ((currentChunk + sentence).length < maxChars) {
            currentChunk += sentence + ' ';
          } else {
            if (currentChunk) {
              chunks.push(currentChunk.trim());
            }
            currentChunk = sentence + ' ';
          }
        }
      } else {
        if ((currentChunk + paragraph).length < maxChars) {
          currentChunk += paragraph + '\n\n';
        } else {
          if (currentChunk) {
            chunks.push(currentChunk.trim());
          }
          currentChunk = paragraph + '\n\n';
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  };

  const handleConvert = async () => {
    if (!text || !settings.apiKey) {
      alert('Please provide text and API key');
      return;
    }

    setIsConverting(true);
    const chunks = splitTextIntoChunks(text);
    const newAudioChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      // Simulate API call (replace with actual OpenAI API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      newAudioChunks.push({
        id: i + 1,
        text: chunks[i].substring(0, 100) + '...',
        audioUrl: null, // In real implementation, this would be the generated audio URL
        status: 'completed'
      });
    }

    setAudioChunks(newAudioChunks);
    setIsConverting(false);
  };

  const playAudio = (chunkId) => {
    setCurrentPlaying(currentPlaying === chunkId ? null : chunkId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Headphones className="w-12 h-12 text-purple-400 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              VocalizePro
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your text into professional audiobooks with AI-powered voice synthesis
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-2" />
                  Input Text
                </h2>
                
                {/* File Upload */}
                <div className="mb-4">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed border-purple-400 rounded-lg hover:border-purple-300 transition-colors flex items-center justify-center text-purple-300 hover:text-purple-200"
                  >
                    <Upload className="w-6 h-6 mr-2" />
                    Upload Text File (.txt)
                  </button>
                  {file && (
                    <p className="mt-2 text-green-400 text-sm">
                      ✓ Loaded: {file.name}
                    </p>
                  )}
                </div>

                {/* Text Area */}
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here or upload a .txt file above..."
                  className="w-full h-64 p-4 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                />

                {/* Text Stats */}
                {text && (
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-400">{text.length.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Characters</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-400">{Math.ceil(text.length / 4096)}</div>
                      <div className="text-sm text-gray-400">Audio Chunks</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-2xl font-bold text-yellow-400">{Math.ceil(estimateTime(text) / 60)}</div>
                      <div className="text-sm text-gray-400">Est. Minutes</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Settings & Controls */}
            <div className="space-y-6">
              {/* Settings Panel */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </h3>
                
                {/* API Key */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                    placeholder="sk-proj-..."
                    className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* Voice Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Voice
                  </label>
                  <select
                    value={settings.voice}
                    onChange={(e) => setSettings({...settings, voice: e.target.value})}
                    className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {voices.map(voice => (
                      <option key={voice.value} value={voice.value} className="bg-gray-800">
                        {voice.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quality
                  </label>
                  <select
                    value={settings.model}
                    onChange={(e) => setSettings({...settings, model: e.target.value})}
                    className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="tts-1" className="bg-gray-800">Standard (tts-1)</option>
                    <option value="tts-1-hd" className="bg-gray-800">High Quality (tts-1-hd)</option>
                  </select>
                </div>

                {/* Cost Estimate */}
                {text && (
                  <div className="bg-black/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <DollarSign className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-sm font-medium text-gray-300">Estimated Cost</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      ${estimateCost(text).toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Convert Button */}
                <button
                  onClick={handleConvert}
                  disabled={!text || !settings.apiKey || isConverting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Converting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Convert to Audio
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Audio Chunks Output */}
          {audioChunks.length > 0 && (
            <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Headphones className="w-6 h-6 mr-2" />
                Generated Audiobook ({audioChunks.length} chapters)
              </h3>
              
              <div className="grid gap-4">
                {audioChunks.map((chunk) => (
                  <div key={chunk.id} className="bg-black/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">Chapter {chunk.id}</h4>
                      <p className="text-gray-400 text-sm">{chunk.text}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => playAudio(chunk.id)}
                        className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                      >
                        {currentPlaying === chunk.id ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <button className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download Complete Audiobook
                </button>
              </div>
            </div>
          )}

          {/* Sample Text */}
          {!text && (
            <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Try with Sample Text</h3>
              <button
                onClick={() => setText(`Chapter 1: The Digital Revolution

In the early 21st century, artificial intelligence began to transform how we create and consume content. What once required expensive recording studios and professional voice actors could now be accomplished with sophisticated text-to-speech technology.

The democratization of audiobook creation opened new possibilities for authors, educators, and content creators worldwide. With just a few clicks, anyone could transform their written words into professional-quality audio content.

Chapter 2: The Power of Voice

Different voices carry different emotions and meanings. The choice of narrator can completely transform how a story is perceived and experienced by the listener. AI voices, while synthetic, have become remarkably human-like in their expressiveness and natural flow.

This technological advancement represents more than just convenience—it's about accessibility, reaching audiences who prefer audio content, and breaking down barriers between creators and their audience.`)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Load Sample Text
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400">
          <p>© 2025 VocalizePro - Transform text into professional audiobooks</p>
        </div>
      </div>
    </div>
  );
};

export default VocalizePro;