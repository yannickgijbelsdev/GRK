import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

/**
 * Speaker icon that reveals a horizontal volume slider on hover (desktop)
 * or on click (mobile / touch).
 *
 *  - value: number between 0 and 1
 *  - onChange: (newValue) => void
 *  - muted: boolean
 *  - onToggleMute: () => void
 */
const VolumeControl = ({ value = 1, onChange, muted = false, onToggleMute }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const closeTimer = useRef(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  };

  useEffect(() => () => cancelClose(), []);

  // Close when clicking outside (helps mobile)
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const Icon = muted || value === 0 ? VolumeX : (value < 0.5 ? Volume1 : Volume2);
  const pct = Math.round((muted ? 0 : value) * 100);

  return (
    <div
      ref={wrapperRef}
      className="relative flex-shrink-0"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => {
          // On touch devices toggle the slider open; click toggles mute on desktop hover already.
          if (window.matchMedia('(hover: none)').matches) {
            setOpen((o) => !o);
          } else if (onToggleMute) {
            onToggleMute();
          }
        }}
        aria-label={muted ? 'Geluid aan' : 'Geluid uit'}
        data-testid="volume-icon-btn"
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#2a5d99] hover:bg-[#e4ecf5] transition"
      >
        <Icon size={20} />
      </button>

      {/* Hover popover with horizontal slider */}
      <div
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={`absolute right-0 bottom-full mb-2 z-50 transition-all duration-200 ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'}`}
      >
        <div className="bg-white rounded-full shadow-xl ring-1 ring-black/5 px-4 py-3 flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : value}
            onChange={(e) => onChange && onChange(parseFloat(e.target.value))}
            aria-label="Volume"
            data-testid="volume-slider"
            className="grk-volume-slider w-32 md:w-40"
            style={{ '--pct': `${pct}%` }}
          />
          <span className="text-[10px] font-bold text-[#062a4a] tabular-nums w-7 text-right">{pct}%</span>
        </div>
      </div>
    </div>
  );
};

export default VolumeControl;
