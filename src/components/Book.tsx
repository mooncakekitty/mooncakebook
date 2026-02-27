import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { PixelCat } from './PixelCat';

interface BookProps {
  isFlipped: boolean;
  answer?: string;
  onFlipEnd?: () => void;
  className?: string;
}

export const Book: React.FC<BookProps> = ({ isFlipped, answer, onFlipEnd, className }) => {
  const [displayedAnswer, setDisplayedAnswer] = useState('');

  useEffect(() => {
    if (isFlipped && answer) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedAnswer(answer.slice(0, i + 1));
        i++;
        if (i >= answer.length) {
          clearInterval(interval);
          if (onFlipEnd) onFlipEnd();
        }
      }, 60);
      return () => clearInterval(interval);
    } else {
      setDisplayedAnswer('');
    }
  }, [isFlipped, answer, onFlipEnd]);

  return (
    <div className={cn("relative w-[260px] h-[360px] sm:w-[300px] sm:h-[400px] perspective-1000", className)}>
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full magic-gradient border-magic-gold/50 border-2 rounded-2xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="text-white font-bold text-3xl text-center px-4 leading-tight -mt-12">
              小月饼的<br />答案书
            </div>
            <div className="mt-6 flex items-center gap-3">
              <PixelCat type="calico" className="w-10 h-10" />
              <div className="text-magic-gold font-bold text-xl tracking-widest">MOONCAKE</div>
            </div>
            <div className="absolute bottom-8 text-white/40 text-[10px] tracking-[0.3em]">SINCE 2026</div>
            
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-magic-gold/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-magic-gold/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-magic-gold/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-magic-gold/30 rounded-br-lg" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full bg-white paper-texture rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
          >
            {/* Magical Flash Effect */}
            <motion.div 
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 3 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-white rounded-full z-50 pointer-events-none"
            />
            
            <div className="text-slate-800 font-medium text-xl sm:text-2xl leading-relaxed z-10">
              {displayedAnswer}
            </div>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="w-20 h-px bg-magic-pink/40 mt-8 z-10" 
            />
            
            {/* Subtle page texture/lines */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex flex-col justify-center gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="w-full h-px bg-black" />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


