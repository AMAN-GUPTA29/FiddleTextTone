import { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [sliderPosition, setSliderPosition] = useState({ x: 0.5, y: 0.5 });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewText, setPreviewText] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    addToHistory(newText);
  };

  const handleSliderChange = async (position) => {
    setSliderPosition(position);
    await analyzeTone(position);
  };

  const addToHistory = (newText) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  const handleReset = () => {
    setText(originalText);
    setSliderPosition({ x: 0.5, y: 0.5 });
    setHistory([originalText]);
    setHistoryIndex(0);
    setError('');
  };

  const analyzeTone = async (position) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Sending request to backend...');
      const response = await fetch('http://localhost:8000/api/tone/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          toneLevel: Math.round(position.y * 100),
          styleLevel: Math.round(position.x * 100),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(errorData.error || 'Failed to analyze tone');
      }

      const data = await response.json();
      if (data.adjustedText) {
        if (originalText === '') {
          setOriginalText(text);
        }
        setText(data.adjustedText);
        addToHistory(data.adjustedText);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Error analyzing tone. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    updateSliderPosition(e);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setSliderPosition({ x, y });
    
    // Update preview text
    const toneLevel = Math.round(y * 100);
    const styleLevel = Math.round(x * 100);
    setPreviewText(`Adjusting to ${toneLevel}% tone, ${styleLevel}% style...`);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      analyzeTone(sliderPosition);
    }
  }, [isDragging, sliderPosition]);

  const updateSliderPosition = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setSliderPosition({ x, y });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isDragging) return;
      const sliderArea = document.querySelector('.slider-area');
      if (!sliderArea) return;
      
      const rect = sliderArea.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      setSliderPosition({ x, y });
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, handleMouseUp]);

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center w-full text-gray-100">
            Tone Slider Text Tool
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Text Editor Section */}
          <div className="flex-1">
            <div className="text-editor-card">
              <h2 className="text-editor-title">Text Editor</h2>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Type your text here..."
                  className="text-input"
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-dark-900 bg-opacity-50 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                      <span className="text-blue-500">Processing tone adjustment...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tone Slider Section */}
          <div className="tone-slider-section">
            <div className="tone-slider-card">
              <h2 className="tone-slider-title">2D Tone Slider</h2>

              <div className="tone-slider-wrapper">
                <div className="slider-container">
                  <div className="slider-labels">
                    <div className="label-top">Professional</div>
                    <div className="label-bottom">Casual</div>
                    <div className="label-left">Concise</div>
                    <div className="label-right">Expanded</div>
                  </div>

                  <div 
                    className="slider-area"
                    onMouseDown={handleMouseDown}
                  >
                    <div
                      className="slider-handle"
                      style={{
                        left: `${sliderPosition.x * 100}%`,
                        top: `${sliderPosition.y * 100}%`,
                        cursor: isDragging ? 'grabbing' : 'grab',
                      }}
                    />
                    {isDragging && (
                      <div className="preview-text">
                        {previewText}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-12">
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={handleUndo} 
                    disabled={historyIndex <= 0 || isLoading}
                    className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Undo
                  </button>
                  <button 
                    onClick={handleRedo} 
                    disabled={historyIndex >= history.length - 1 || isLoading}
                    className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Redo
                  </button>
                </div>
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-red-900 hover:bg-red-800 text-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
              </div>

              {isLoading && (
                <div className="mt-4 p-3 bg-blue-900 text-blue-100 rounded-lg text-center flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-100"></div>
                  Adjusting tone...
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-900 text-red-100 rounded-lg text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
