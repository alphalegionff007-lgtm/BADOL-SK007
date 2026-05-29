import React, { useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ToastProps {
  text: string;
  onClose: () => void;
}

export default function Toast({ text, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center justify-between p-4 rounded-xl border bg-slate-900 border-emerald-500/30 text-emerald-100 shadow-2xl backdrop-blur-md animate-slide-in duration-300 max-w-sm w-full">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-sm font-medium">{text}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white transition-colors ml-3 p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
        id="toast-close-btn"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
