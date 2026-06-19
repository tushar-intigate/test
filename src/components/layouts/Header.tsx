import { Bot, Save } from 'lucide-react';

interface HeaderProps {
  onSave: () => void;
}

export default function Header({ onSave }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm z-50">
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
          onClick={onSave}
          className="flex items-center gap-1.5 rounded-xl bg-[#075E54] hover:bg-[#054c44] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition cursor-pointer"
        >
          <Save size={14} />
          Save Flow Data
        </button>
      </div>
    </header>
  );
}
