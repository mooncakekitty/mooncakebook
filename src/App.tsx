import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  PenTool, 
  History, 
  ChevronLeft, 
  Trash2, 
  RotateCcw, 
  MessageSquare,
  Download,
  Upload,
  Share2,
  FileSpreadsheet,
  Wand2,
  Moon,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import { Background } from './components/Background';
import { Book } from './components/Book';
import { PixelCat } from './components/PixelCat';
import { OracleRecord, AppMode } from './types';
import answersData from './answers.json';
import { cn } from './lib/utils';

export default function App() {
  const [mode, setMode] = useState<AppMode>('home');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<OracleRecord[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OracleRecord | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isCatGirlMode, setIsCatGirlMode] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('oracle_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('oracle_history', JSON.stringify(history));
  }, [history]);

  const getRandomAnswer = () => {
    const randomIndex = Math.floor(Math.random() * answersData.length);
    return answersData[randomIndex];
  };

  const catify = (text: string) => {
    if (!isCatGirlMode) return text;
    
    let newText = text;
    
    // 1. Cat-girl vocabulary and phrasing
    const vocab = [
      { pattern: /我/g, replacement: '人家' },
      { pattern: /你/g, replacement: '主人大人' },
      { pattern: /。/g, replacement: '喵~ ' },
      { pattern: /！/g, replacement: '喵呜！ ' },
      { pattern: /？/g, replacement: '喵？ ' },
      { pattern: /是/g, replacement: '是喵~ ' },
      { pattern: /的/g, replacement: '哒' },
      { pattern: /了/g, replacement: '啦' },
      { pattern: /好/g, replacement: '好喵' },
      { pattern: /不/g, replacement: '才不' },
      { pattern: /想/g, replacement: '想喵~ ' },
      { pattern: /去/g, replacement: '去喵~ ' },
    ];
    
    vocab.forEach(v => {
      newText = newText.replace(v.pattern, v.replacement);
    });

    // 2. Add random cat girl interjections and emojis
    const interjections = ['喵~', '呜喵！', '喵喵~', '的说~', '（歪头喵）', '（蹭蹭主人）', '（摇尾巴喵）'];
    const randomInter = interjections[Math.floor(Math.random() * interjections.length)];
    
    const emojis = ['(≈>ω<≈)', '(=^･ω･^=)', '(ฅ´ω`ฅ)', '(=｀ω´=)', '(^・ω・^ )', 'ฅ(๑*д*๑)ฅ'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    return `主人大人~ ${newText}${randomInter} ${randomEmoji}`;
  };

  const handleSeekAnswer = (q?: string) => {
    if (isFlipped) {
      setIsFlipped(false);
      setCurrentAnswer('');
      return;
    }

    setIsThinking(true);
    
    // Simulate magic ritual
    setTimeout(() => {
      let answer = getRandomAnswer();
      if (isCatGirlMode) {
        answer = catify(answer);
      }
      setCurrentAnswer(answer);
      setIsFlipped(true);
      setIsThinking(false);

      if (q) {
        const newRecord: OracleRecord = {
          id: Date.now().toString(),
          question: q,
          answer: answer,
          timestamp: Date.now(),
        };
        setHistory([newRecord, ...history]);
      }

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#db2777', '#6b21a8', '#fbbf24', '#ffffff']
      });
    }, 1200);
  };

  const deleteRecord = (id: string) => {
    setHistory(history.filter(r => r.id !== id));
  };

  const addComment = (id: string, text: string) => {
    if (!text.trim()) return;
    const comment = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: Date.now(),
    };
    setHistory(history.map(r => r.id === id ? { ...r, comments: [comment, ...(r.comments || [])] } : r));
    setNewComment('');
  };

  const redrawAnswer = (id: string) => {
    const record = history.find(r => r.id === id);
    if (!record) return;

    if (window.confirm('是否要重新询问星空？这将生成一条新的记录。')) {
      setMode('write');
      setQuestion(record.question);
      setIsFlipped(false); // Crucial: reset flip state
      setCurrentAnswer('');
      
      // Small delay to ensure mode switch and state reset completes
      setTimeout(() => {
        handleSeekAnswer(record.question);
      }, 300);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(history.map(r => ({
      '时间': new Date(r.timestamp).toLocaleString(),
      '问题': r.question,
      '答案': r.answer,
      '感悟': r.comments && r.comments.length > 0 ? r.comments.map(c => `[${new Date(c.timestamp).toLocaleString()}] ${c.text}`).join(' | ') : ''
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "历史记录");
    XLSX.writeFile(workbook, `小月饼的答案书_记录_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `oracle_history_${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setHistory(imported);
      } catch (err) {
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
  };

  const shareCard = async (id: string) => {
    const element = document.getElementById(`record-${id}`);
    if (!element) return;
    
    // Add temporary branding for screenshot
    const branding = document.createElement('div');
    branding.innerHTML = `
      <div style="margin-top: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
        <div style="color: #fbbf24; font-weight: bold; font-size: 18px;">🥮 小月饼的魔法书</div>
        <div style="color: rgba(255,255,255,0.4); font-size: 10px; letter-spacing: 2px; margin-top: 4px;">MOONCAKE MAGIC BOOK</div>
      </div>
    `;
    element.appendChild(branding);

    const canvas = await html2canvas(element, { 
      backgroundColor: '#0a0a0a',
      scale: 2,
      logging: false,
      useCORS: true,
      onclone: (clonedDoc) => {
        // 1. Hide the action buttons in the screenshot to avoid oklab issues and clutter
        const actionButtons = clonedDoc.querySelectorAll('button');
        actionButtons.forEach(btn => (btn as HTMLElement).style.display = 'none');

        // 2. Fix for "oklab" / "oklch" unsupported color function in html2canvas
        const allElements = clonedDoc.getElementsByTagName('*');
        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i] as HTMLElement;
          
          // Force standard colors for the capture by setting inline styles
          if (el.classList.contains('text-magic-gold')) el.style.setProperty('color', '#fbbf24', 'important');
          if (el.classList.contains('text-magic-pink')) el.style.setProperty('color', '#db2777', 'important');
          if (el.classList.contains('bg-magic-black')) el.style.setProperty('background-color', '#0f172a', 'important');
          if (el.classList.contains('text-magic-purple')) el.style.setProperty('color', '#6b21a8', 'important');
          
          // Generic strip for any remaining oklch/oklab in computed styles
          const style = window.getComputedStyle(el);
          ['color', 'background-color', 'border-color', 'outline-color', 'fill', 'stroke'].forEach(prop => {
            const val = style.getPropertyValue(prop);
            if (val && (val.includes('oklch') || val.includes('oklab'))) {
              // Fallback to solid colors
              if (prop === 'background-color') el.style.setProperty(prop, '#1a1a1a', 'important');
              else if (prop === 'color') el.style.setProperty(prop, '#ffffff', 'important');
              else el.style.setProperty(prop, 'transparent', 'important');
            }
          });
        }
      }
    });
    
    element.removeChild(branding);

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `小月饼的魔法记录_${id}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-magic-black">
      <Background />
      
      {/* Back Button - Top Left */}
      {mode !== 'home' && (
        <div className="fixed top-6 left-6 z-50">
          <button 
            onClick={() => {
              setMode('home');
              setIsFlipped(false);
              setCurrentAnswer('');
              setQuestion('');
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all backdrop-blur-md"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium hidden sm:inline">返回</span>
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {mode === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center z-10 w-full max-w-md px-6"
          >
            {/* Magic Hat Element */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="flex justify-center mb-6 relative"
            >
              <div className="relative">
                <Moon className="text-magic-gold w-16 h-16" />
                <Zap className="absolute -top-2 -right-2 text-magic-pink w-8 h-8 wand-glow" />
              </div>
              {/* Pixel Cats on Home Screen - Moved much closer to center */}
              <PixelCat type="calico" className="absolute -left-4 sm:-left-8 bottom-0 w-16 h-16 z-20" />
              <PixelCat type="ragdoll" className="absolute -right-4 sm:-right-8 bottom-0 w-16 h-16 z-20" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">小月饼的答案书</h1>
            <p className="text-magic-pink font-medium text-lg mb-8 tracking-widest">MOONCAKE ORACLE</p>

            {/* Cat Girl Mode Toggle */}
            <div className="flex justify-center mb-8">
              <button 
                onClick={() => setIsCatGirlMode(!isCatGirlMode)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300",
                  isCatGirlMode 
                    ? "bg-magic-pink/20 border-magic-pink text-magic-pink shadow-[0_0_15px_rgba(219,39,119,0.3)]" 
                    : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
                )}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isCatGirlMode ? "bg-magic-pink animate-pulse" : "bg-white/20"
                )} />
                <span className="text-sm font-bold tracking-widest">猫娘模式 {isCatGirlMode ? 'ON' : 'OFF'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setMode('mind')}
                className="group relative flex items-center justify-between px-6 py-5 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 hover:border-magic-gold/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-magic-purple/20 rounded-xl text-magic-gold group-hover:scale-110 transition-transform">
                    <Sparkles size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">冥想模式</div>
                    <div className="text-xs text-white/40">闭上眼，默念你的困惑</div>
                  </div>
                </div>
                <ChevronLeft className="rotate-180 text-white/20" size={20} />
              </button>

              <button 
                onClick={() => setMode('write')}
                className="group relative flex items-center justify-between px-6 py-5 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 hover:border-magic-pink/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-magic-pink/20 rounded-xl text-magic-pink group-hover:scale-110 transition-transform">
                    <PenTool size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">记录模式</div>
                    <div className="text-xs text-white/40">书写你的困惑，祈求指引</div>
                  </div>
                </div>
                <ChevronLeft className="rotate-180 text-white/20" size={20} />
              </button>

              <button 
                onClick={() => setMode('chronicle')}
                className="group relative flex items-center justify-between px-6 py-5 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 hover:border-white/30"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl text-white group-hover:scale-110 transition-transform">
                    <History size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">历史记录</div>
                    <div className="text-xs text-white/40">回溯星空的指引</div>
                  </div>
                </div>
                <ChevronLeft className="rotate-180 text-white/20" size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {(mode === 'mind' || mode === 'write') && (
          <motion.div 
            key="oracle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 sm:gap-8 z-10 w-full max-w-lg"
          >
            {/* Crystal Ball Element - Smaller for mobile */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="crystal-ball mb-0 sm:mb-4"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-magic-pink/40 to-magic-purple/60 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Wand2 className="text-magic-gold w-8 h-8 sm:w-10 sm:h-10 wand-glow" />
              </div>
            </motion.div>

            <div className="text-center px-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {mode === 'mind' ? '冥想你的问题' : '书写你的困惑'}
              </h2>
              <p className="text-white/40 text-xs sm:text-sm">
                {mode === 'mind' ? '“闭上眼，默念三遍你的困惑...”' : '“将你的困惑书写于此，祈求指引...”'}
              </p>
            </div>

            {mode === 'write' && !isFlipped && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full px-6"
              >
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="在此输入你的问题..."
                  className="w-full h-20 sm:h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-magic-pink/50 transition-all resize-none text-base sm:text-lg"
                />
              </motion.div>
            )}

            <div className="relative w-full flex justify-center scale-90 sm:scale-100">
              <Book isFlipped={isFlipped} answer={currentAnswer} />
              
              {!isFlipped && !isThinking && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40">
                  <button
                    onClick={() => handleSeekAnswer(mode === 'write' ? question : undefined)}
                    disabled={mode === 'write' && !question.trim()}
                    className="cursor-pointer group"
                  >
                    <motion.div 
                      animate={{ boxShadow: ['0 0 0px rgba(219,39,119,0)', '0 0 20px rgba(219,39,119,0.4)', '0 0 0px rgba(219,39,119,0)'] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-magic-pink/40 px-8 py-3 rounded-full border border-magic-pink/50 backdrop-blur-md transition-all hover:bg-magic-pink/60 hover:scale-105 active:scale-95"
                    >
                      <span className="text-white font-bold tracking-widest shadow-sm">开启答案书</span>
                    </motion.div>
                  </button>
                </div>
              )}

              {isThinking && (
                <div className="absolute inset-0 z-40 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-12 h-12 border-2 border-magic-pink/20 border-t-magic-pink rounded-full"
                  />
                </div>
              )}
            </div>

            {isFlipped && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentAnswer('');
                  setQuestion('');
                }}
                className="px-8 py-2.5 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-bold tracking-widest"
              >
                合上书本
              </motion.button>
            )}
          </motion.div>
        )}

        {mode === 'chronicle' && (
          <motion.div 
            key="chronicle"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="z-10 w-full max-w-2xl h-[85vh] flex flex-col px-4"
          >
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">历史记录</h2>
                <p className="text-magic-pink text-xs tracking-widest uppercase mt-1">THE CHRONICLE</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={exportToExcel}
                  className="p-2.5 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 transition-all"
                  title="导出 Excel"
                >
                  <FileSpreadsheet size={20} />
                </button>
                <button 
                  onClick={exportData}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  title="导出 JSON"
                >
                  <Download size={20} />
                </button>
                <label className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer">
                  <Upload size={20} />
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-12">
              {history.length === 0 ? (
                <div className="text-center py-20 text-white/10 font-medium tracking-widest">
                  星空中尚未留下你的痕迹
                </div>
              ) : (
                history.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    id={`record-${record.id}`}
                    className="relative pl-6 border-l-2 border-magic-purple/30"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-[-7px] top-0 w-3 h-3 rounded-full bg-magic-pink shadow-[0_0_8px_rgba(219,39,119,0.5)]" />
                    
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-5 hover:border-magic-pink/50 transition-all group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="text-xs text-white/60 font-medium tracking-widest">
                          {new Date(record.timestamp).toLocaleString()}
                        </span>
                        <div className="flex gap-2 opacity-100 transition-opacity relative z-50 pointer-events-auto">
                          <button 
                            onClick={(e) => { 
                              e.preventDefault();
                              e.stopPropagation(); 
                              shareCard(record.id); 
                            }} 
                            className="p-2 text-white/60 hover:text-white transition-colors bg-white/20 rounded-lg active:scale-95 shadow-lg cursor-pointer"
                            title="分享"
                          >
                            <Share2 size={18} />
                          </button>
                          <button 
                            onClick={(e) => { 
                              e.preventDefault();
                              e.stopPropagation(); 
                              redrawAnswer(record.id); 
                            }} 
                            className="p-2 text-white/60 hover:text-magic-gold transition-colors bg-white/20 rounded-lg active:scale-95 shadow-lg cursor-pointer"
                            title="重新提问"
                          >
                            <RotateCcw size={18} />
                          </button>
                          <button 
                            onClick={(e) => { 
                              e.preventDefault();
                              e.stopPropagation(); 
                              deleteRecord(record.id); 
                            }} 
                            className="p-2 text-white/60 hover:text-red-400 transition-colors bg-white/20 rounded-lg active:scale-95 shadow-lg cursor-pointer"
                            title="删除"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Clickable area for details - moved below buttons in DOM but absolute positioned */}
                      <div 
                        className="absolute inset-0 z-0 cursor-pointer" 
                        onClick={() => setSelectedRecord(record)} 
                      />

                      <div className="mb-4">
                        <div className="text-xs text-white/40 uppercase tracking-widest mb-1 font-bold">你的困惑</div>
                        <div className="text-lg font-medium text-white">{record.question || '（冥想模式）'}</div>
                      </div>

                      <div className="mb-4 p-4 bg-magic-black/60 rounded-xl border border-white/10">
                        <div className="text-xs text-magic-pink/60 uppercase tracking-widest mb-1 font-bold">星空的指引</div>
                        <div className="text-xl font-bold text-magic-gold leading-relaxed">{record.answer}</div>
                      </div>

                      {record.comments && record.comments.length > 0 && (
                        <div className="relative pt-2 border-t border-white/5">
                          <MessageSquare size={14} className="absolute left-0 top-3.5 text-white/40" />
                          <div className="pl-6 text-sm text-white/70 italic line-clamp-1">
                            {record.comments[0].text}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setSelectedRecord(null);
              setNewComment('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-magic-black border border-white/10 rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-xs text-white/40 font-medium tracking-widest">
                    {new Date(selectedRecord.timestamp).toLocaleString()}
                  </div>
                  <button 
                    onClick={() => setSelectedRecord(null)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white"
                  >
                    <ChevronLeft className="rotate-90" size={20} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-bold">你的困惑</div>
                  <div className="text-xl font-medium text-white leading-relaxed">
                    {selectedRecord.question || '（冥想模式）'}
                  </div>
                </div>

                <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-magic-gold/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={48} className="text-magic-gold" />
                  </div>
                  <div className="text-xs text-magic-pink/60 uppercase tracking-widest mb-2 font-bold">星空的指引</div>
                  <div className="text-2xl font-bold text-magic-gold leading-relaxed">
                    {selectedRecord.answer}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-xs text-white/40 uppercase tracking-widest font-bold">记录此刻的感悟</div>
                  
                  <div className="flex gap-2">
                    <textarea
                      placeholder="添加新的感悟..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-magic-pink/50 transition-all resize-none h-16"
                    />
                    <button 
                      onClick={() => {
                        addComment(selectedRecord.id, newComment);
                        // Update the local selectedRecord to show the new comment immediately
                        setSelectedRecord({
                          ...selectedRecord,
                          comments: [{
                            id: Date.now().toString(),
                            text: newComment,
                            timestamp: Date.now()
                          }, ...(selectedRecord.comments || [])]
                        });
                        setNewComment('');
                      }}
                      className="px-4 bg-magic-pink/20 hover:bg-magic-pink/30 text-magic-pink rounded-xl transition-all flex items-center justify-center"
                    >
                      <PenTool size={20} />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedRecord.comments?.map(comment => (
                      <div key={comment.id} className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[9px] text-white/30 mb-1">
                          {new Date(comment.timestamp).toLocaleString()}
                        </div>
                        <div className="text-sm text-white/80 leading-relaxed">
                          {comment.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(219, 39, 119, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(219, 39, 119, 0.4);
        }
      `}} />
    </div>
  );
}

