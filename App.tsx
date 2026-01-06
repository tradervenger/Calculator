
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Delete, 
  History as HistoryIcon, 
  Settings, 
  Sparkles, 
  X, 
  Plus, 
  Minus, 
  Divide, 
  Equal,
  RotateCcw
} from 'lucide-react';
import CalculatorButton from './components/CalculatorButton';
import { solveMathProblem } from './services/geminiService';
import { HistoryItem, Operation } from './types';

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op: Operation) => {
    const current = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const result = calculate(parseFloat(previousValue), current, operation);
      setPreviousValue(result.toString());
      setDisplay(result.toString());
    }
    setOperation(op);
    setExpression(`${display} ${op}`);
    setShouldResetDisplay(true);
  };

  const calculate = (a: number, b: number, op: Operation): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      case '%': return a % b;
      case '^': return Math.pow(a, b);
      default: return b;
    }
  };

  const handleEqual = () => {
    if (!operation || previousValue === null) return;
    
    const current = parseFloat(display);
    const prev = parseFloat(previousValue);
    const result = calculate(prev, current, operation);
    
    const newHistory: HistoryItem = {
      id: Date.now().toString(),
      expression: `${prev} ${operation} ${current} =`,
      result: result.toString(),
      timestamp: Date.now()
    };

    setHistory([newHistory, ...history].slice(0, 50));
    setDisplay(result.toString());
    setExpression('');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const deleteDigit = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const toggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const handleAiSolve = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    const result = await solveMathProblem(aiInput);
    setDisplay(result);
    setExpression(aiInput);
    setShowAiModal(false);
    setAiInput('');
    setIsAiLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white max-w-md mx-auto shadow-2xl relative overflow-hidden">
      
      {/* Status Bar Mockup */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2 text-xs font-medium text-zinc-500">
        <span>9:41</span>
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-zinc-800 rounded-full flex items-center justify-center">●</div>
          <div className="w-4 h-4 bg-zinc-800 rounded-full flex items-center justify-center">●</div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center px-4 py-2">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="p-3 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <HistoryIcon size={20} className="text-zinc-400" />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
          >
            <Sparkles size={16} />
            <span className="text-sm font-semibold">AI Solver</span>
          </button>
          <button className="p-3 rounded-full bg-zinc-900 text-zinc-400">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Display Area */}
      <div className="flex-1 flex flex-col justify-end px-6 pb-6 select-none overflow-hidden">
        <div className="text-right text-zinc-500 text-lg h-8 mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
          {expression}
        </div>
        <div className="text-right text-6xl font-light tracking-tight break-all max-h-48 overflow-y-auto scrollbar-hide">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="bg-zinc-950 p-4 rounded-t-[3rem] shadow-inner grid grid-cols-4 gap-3">
        <CalculatorButton label="AC" onClick={clear} variant="action" />
        <CalculatorButton label="+/-" onClick={toggleSign} variant="action" />
        <CalculatorButton label="%" onClick={() => handleOperation('%')} variant="action" />
        <CalculatorButton label={<Divide size={24} />} onClick={() => handleOperation('/')} variant="operator" />

        <CalculatorButton label="7" onClick={() => handleNumber('7')} />
        <CalculatorButton label="8" onClick={() => handleNumber('8')} />
        <CalculatorButton label="9" onClick={() => handleNumber('9')} />
        <CalculatorButton label={<X size={20} />} onClick={() => handleOperation('*')} variant="operator" />

        <CalculatorButton label="4" onClick={() => handleNumber('4')} />
        <CalculatorButton label="5" onClick={() => handleNumber('5')} />
        <CalculatorButton label="6" onClick={() => handleNumber('6')} />
        <CalculatorButton label={<Minus size={24} />} onClick={() => handleOperation('-')} variant="operator" />

        <CalculatorButton label="1" onClick={() => handleNumber('1')} />
        <CalculatorButton label="2" onClick={() => handleNumber('2')} />
        <CalculatorButton label="3" onClick={() => handleNumber('3')} />
        <CalculatorButton label={<Plus size={24} />} onClick={() => handleOperation('+')} variant="operator" />

        <CalculatorButton label="0" onClick={() => handleNumber('0')} className="col-span-1" />
        <CalculatorButton label="." onClick={() => handleNumber('.')} />
        <CalculatorButton label={<Delete size={20} />} onClick={deleteDigit} />
        <CalculatorButton label={<Equal size={24} />} onClick={handleEqual} variant="special" />
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">History</h2>
            <button onClick={() => setShowHistory(false)} className="p-2 bg-zinc-800 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-50">
                <RotateCcw size={48} className="mb-4" />
                <p>No calculations yet</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="text-right group">
                  <div className="text-zinc-500 text-sm mb-1">{item.expression}</div>
                  <div className="text-2xl font-semibold text-blue-400">{item.result}</div>
                  <div className="h-px bg-zinc-800 mt-4 group-last:hidden" />
                </div>
              ))
            )}
          </div>
          
          {history.length > 0 && (
            <button 
              onClick={() => setHistory([])}
              className="mt-4 py-3 bg-red-500/10 text-red-500 rounded-xl font-semibold hover:bg-red-500/20"
            >
              Clear History
            </button>
          )}
        </div>
      )}

      {/* AI Solver Modal */}
      {showAiModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-zinc-900 w-full rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Sparkles size={20} />
                <h3 className="font-bold">Gemini AI Solver</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-zinc-500">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-zinc-400 mb-4">
              Type a word problem or a complex expression (e.g., "What is 15% of 2500 plus tax?")
            </p>
            
            <textarea
              autoFocus
              className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none mb-4 resize-none h-32"
              placeholder="Type your question..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
            
            <button
              disabled={isAiLoading || !aiInput.trim()}
              onClick={handleAiSolve}
              className={`
                w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                ${isAiLoading || !aiInput.trim() 
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/20'}
              `}
            >
              {isAiLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Solve with Gemini</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Visual Navigation Bar */}
      <div className="h-2 w-32 bg-zinc-800 rounded-full mx-auto mb-2 opacity-30" />
    </div>
  );
};

export default App;
