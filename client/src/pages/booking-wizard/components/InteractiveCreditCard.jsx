import React from 'react';
import { motion } from 'framer-motion';

const InteractiveCreditCard = ({ isFlipped, cardNumber, cardName, expiryDate, cvv }) => {
  const maskNumber = (num) => {
    const clean = num.replace(/\D/g, '');
    const padded = clean.padEnd(16, '#');
    const groups = padded.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  return (
    <div className="perspective-1000 w-96 h-56 cursor-pointer" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-full transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] rounded-2xl shadow-2xl p-6 text-white overflow-hidden backface-hidden border border-[#d4af37]/30" style={{ backfaceVisibility: 'hidden' }}>
          {/* Premium Texture/Gradient - Cleaner Look */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40 opacity-80"></div>
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl opacity-40"></div>

          {/* Subtle Grain */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'%3Chttp://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-7 bg-gradient-to-r from-[#d4af37] to-[#f9e5a4] rounded-md shadow-sm flex items-center justify-center overflow-hidden relative ring-1 ring-white/20">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="w-6 h-4 border border-black/20 rounded-sm"></div>
                </div>
                <span className="font-accent font-bold text-lg tracking-wide text-white/90">UrbanDrive</span>
              </div>
              <span className="text-lg font-bold font-accent tracking-widest italic text-[#d4af37] drop-shadow-md">VISA</span>
            </div>

            <div className="space-y-5">
              <div className="text-xl sm:text-2xl font-mono tracking-[0.12em] drop-shadow-lg text-gray-100 whitespace-nowrap">
                {cardNumber ? maskNumber(cardNumber) : '#### #### #### ####'}
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <div className="text-[8px] uppercase text-[#d4af37] tracking-widest font-bold">Card Holder</div>
                  <div className="font-medium tracking-wider uppercase truncate max-w-[180px] text-sm text-white/90">
                    {cardName || 'YOUR NAME'}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[8px] uppercase text-[#d4af37] tracking-widest font-bold">Expires</div>
                  <div className="font-medium tracking-wider font-mono text-sm text-white/90">
                    {expiryDate || 'MM/YY'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden backface-hidden border border-white/10"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-full h-12 bg-black mt-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>
          <div className="px-6 mt-6">
            <div className="space-y-2 text-right">
              <div className="text-[9px] uppercase text-gray-400 tracking-widest font-semibold mr-2">CVV / CVC</div>
              <div className="w-full h-10 bg-white rounded flex items-center justify-end px-3 text-black font-mono font-bold tracking-widest shadow-inner">
                {cvv || '***'}
              </div>
            </div>
            <div className="mt-8 flex justify-center opacity-30">
              <div className="w-3/4 h-8 border-b border-white/20 flex items-end justify-center pb-1">
                <span className="text-[8px] uppercase tracking-widest">Authorized Signature</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveCreditCard;