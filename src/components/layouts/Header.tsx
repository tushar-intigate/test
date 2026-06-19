import { Bot, Save } from 'lucide-react';

interface HeaderProps {
  onSave: () => void;
  onTestFlow: () => void;
}

export default function Header({ onSave, onTestFlow }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200/60 bg-white/90 backdrop-blur-md px-6 py-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] z-50 relative">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
          <Bot size={22} className="animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 m-0 leading-tight">Intigate Flow Builder & Simulator</h1>
          <p className="text-[11px] text-slate-500 m-0 mt-0.5">
            Active Graph: <span className="font-semibold text-slate-700">Recruitment/Job Bot API</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <button
          onClick={onTestFlow}
          className="flex items-center gap-1.5 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-700 px-5 py-2.5 text-xs font-bold shadow-[0_4px_14px_0_rgba(139,92,246,0.15)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.2)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <Bot size={14} />
          Preview Flow
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#075E54] to-[#128C7E] hover:from-[#054c44] hover:to-[#075E54] px-5 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_0_rgba(7,94,84,0.39)] hover:shadow-[0_6px_20px_rgba(7,94,84,0.23)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <Save size={14} />
          Save Flow Data
        </button>
      </div>
    </header>
  );
}
