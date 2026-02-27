import React, { useEffect, useState, useMemo } from 'react';
import { PixelCat } from './PixelCat';
import { motion } from 'motion/react';

export const Background: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; duration: string }[]>([]);

  const scatteredCats = useMemo(() => {
    const items: { id: number; type: any; top: string; left: string; delay: number; rotate: number }[] = [];
    
    const getSafePos = () => {
      let top, left;
      let attempts = 0;
      do {
        top = Math.random() * 90 + 5;
        left = Math.random() * 90 + 5;
        attempts++;
        // Avoid center area (where home buttons are)
        // Home buttons are roughly in the center 20% to 80% height and 15% to 85% width
      } while (attempts < 50 && top > 20 && top < 80 && left > 15 && left < 85);
      return { top: `${top}%`, left: `${left}%` };
    };

    let id = 0;
    // 6 Calico cats
    for (let i = 0; i < 6; i++) {
      const pos = getSafePos();
      items.push({ id: id++, type: 'calico', ...pos, delay: Math.random() * 5, rotate: Math.random() * 360 });
    }
    // 6 Ragdoll cats
    for (let i = 0; i < 6; i++) {
      const pos = getSafePos();
      items.push({ id: id++, type: 'ragdoll', ...pos, delay: Math.random() * 5, rotate: Math.random() * 360 });
    }
    // 1 Tabby cat
    for (let i = 0; i < 1; i++) {
      const pos = getSafePos();
      items.push({ id: id++, type: 'tabby', ...pos, delay: Math.random() * 5, rotate: Math.random() * 360 });
    }
    // 3 Crystal Balls
    for (let i = 0; i < 3; i++) {
      const pos = getSafePos();
      items.push({ id: id++, type: 'crystal-ball', ...pos, delay: Math.random() * 5, rotate: Math.random() * 360 });
    }
    // 3 Magic Hats
    for (let i = 0; i < 3; i++) {
      const pos = getSafePos();
      items.push({ id: id++, type: 'magic-hat', ...pos, delay: Math.random() * 5, rotate: Math.random() * 360 });
    }
    // 3 Magic Wands
    for (let i = 0; i < 3; i++) {
      const pos = getSafePos();
      items.push({ id: id++, type: 'magic-wand', ...pos, delay: Math.random() * 5, rotate: Math.random() * 360 });
    }
    
    return items;
  }, []);

  useEffect(() => {
    const newStars = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <>
      <div className="star-field">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              '--duration': star.duration,
            } as any}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-magic-purple/5 to-magic-black" />
      </div>
      
      {/* Scattered Pixel Cats - Moved outside star-field and given higher z-index */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {scatteredCats.map((cat) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              y: [0, -20, 0],
              rotate: [cat.rotate, cat.rotate + 20, cat.rotate]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8 + Math.random() * 5, 
              delay: cat.delay,
              ease: "easeInOut" 
            }}
            className="absolute"
            style={{ top: cat.top, left: cat.left }}
          >
            <PixelCat type={cat.type} className="w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>
        ))}
      </div>
    </>
  );
};


