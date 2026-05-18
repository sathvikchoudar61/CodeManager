import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, Code2, Clock, CheckCircle, XCircle, History } from 'lucide-react';
import api from '../services/api';

const Compiler = () => {
  const boilerplates = {
    'c': '#include <stdio.h>\n\nint main() {\n    printf("Hello CodeManager!\\n");\n    return 0;\n}',
    'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello CodeManager!" << endl;\n    return 0;\n}',
    'java': 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello CodeManager!");\n    }\n}',
    'python': 'print("Hello CodeManager!")',
    'javascript': 'console.log("Hello CodeManager!");'
  };

  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(boilerplates['cpp']);
  const [input, setInput] = useState('');
  
  const [output, setOutput] = useState('');
  const [errorText, setErrorText] = useState('');
  const [executionTime, setExecutionTime] = useState('');
  const [success, setSuccess] = useState(null);
  
  const [isRunning, setIsRunning] = useState(false);
  
  const [history, setHistory] = useState([]);

  const languages = [
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' },
    { id: 'java', name: 'Java' },
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' }
  ];

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(boilerplates[newLang]);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setErrorText('');
    setExecutionTime('');
    setSuccess(null);
    
    try {
      const res = await api.post('/compiler', { language, code, input });
      const data = res.data;
      
      setOutput(data.output || '');
      setErrorText(data.error || '');
      setSuccess(data.success);
      setExecutionTime(data.executionTime || '');
      
      // Add to history
      setHistory(prev => [{
        id: Date.now(),
        language,
        time: new Date().toLocaleTimeString(),
        success: data.success,
        executionTime: data.executionTime
      }, ...prev].slice(0, 10)); // Keep last 10
      
    } catch (err) {
      setErrorText(err.response?.data?.message || err.message || 'Network error occurred');
      setSuccess(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(boilerplates[language]);
    setOutput('');
    setErrorText('');
    setInput('');
    setSuccess(null);
    setExecutionTime('');
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 animate-fade-in pb-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-[#161b22] p-3 rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-4 pl-2">
          <div className="flex items-center gap-2 text-white/50">
            <Code2 size={20} className="text-accent" />
            <span className="font-bold text-white tracking-wide">CodeEditor</span>
          </div>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <select 
            className="bg-[#151521] border border-white/10 rounded-lg px-4 py-1.5 text-sm font-medium text-white outline-none focus:border-accent hover:border-white/20 transition-colors cursor-pointer"
            value={language}
            onChange={handleLanguageChange}
          >
            {languages.map(lang => (
               <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          <button 
            onClick={handleReset} 
            className="text-textDark hover:text-white transition-colors bg-[#151521] p-1.5 rounded-lg border border-white/5 hover:border-white/20" 
            title="Reset to boilerplate"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        
        <button 
          onClick={handleRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            isRunning 
              ? 'bg-accent/30 text-white/50 cursor-not-allowed' 
              : 'bg-accent hover:bg-accent/80 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
          }`}
        >
          <Play size={16} className={isRunning ? 'animate-pulse' : ''} />
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Editor Area (Left) */}
        <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#1e1e1e]">
          <div className="bg-[#252538] px-4 py-2 border-b border-white/5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-xs text-textDark ml-2 font-mono">main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}</span>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language === 'c' ? 'c' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language === 'python' ? 'python' : 'javascript'}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val)}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                formatOnPaste: true,
              }}
              className="absolute inset-0"
            />
          </div>
        </div>
        
        {/* I/O Area (Right) */}
        <div className="w-full lg:w-[450px] flex flex-col gap-4">
          
          {/* Input Panel */}
          <div className="flex flex-col h-1/3 bg-[#161b22] rounded-xl border border-white/10 shadow-lg overflow-hidden">
            <div className="bg-[#21262d] px-4 py-2 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-white/80 font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
                <Terminal size={14} className="text-accent" /> Custom Input
              </h3>
            </div>
            <textarea 
              className="flex-1 w-full bg-transparent p-4 text-white resize-none outline-none custom-scrollbar text-sm font-mono placeholder-white/20"
              placeholder="Enter input here..."
              value={input}
              onChange={e => setInput(e.target.value)}
              spellCheck="false"
            />
          </div>
          
          {/* Output Panel */}
          <div className="flex flex-col flex-1 bg-[#161b22] rounded-xl border border-white/10 shadow-lg overflow-hidden relative">
            <div className="bg-[#21262d] px-4 py-2 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-white/80 font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
                <Code2 size={14} className={success === false ? "text-red-400" : success === true ? "text-green-400" : "text-white/50"} /> 
                Output
              </h3>
              {executionTime && (
                <span className="text-xs text-textDark bg-black/20 px-2 py-0.5 rounded flex items-center gap-1 border border-white/5">
                  <Clock size={10} /> {executionTime}
                </span>
              )}
            </div>
            
            <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-[#0d1117]">
              {isRunning ? (
                <div className="flex flex-col items-center justify-center h-full text-textDark gap-3">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm animate-pulse">Executing code on server...</span>
                </div>
              ) : (
                <div className="font-mono text-sm h-full">
                  {errorText ? (
                    <div className="text-red-400 whitespace-pre-wrap font-medium">{errorText}</div>
                  ) : output ? (
                    <div className="text-green-400 whitespace-pre-wrap">{output}</div>
                  ) : success !== null ? (
                    <div className="text-textDark italic">Program finished with no output.</div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-textDark/40 italic">
                      Run your code to see the output here
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Compiler;
