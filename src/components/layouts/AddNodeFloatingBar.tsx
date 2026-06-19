import { PanelLeftClose, Plus } from 'lucide-react';

interface AddNodeFloatingBarProps {
  openBuilder: boolean;
  setOpenBuilder: (openBuilder: boolean) => void;
}

export default function AddNodeFloatingBar({ openBuilder, setOpenBuilder }: AddNodeFloatingBarProps) {
  return (
    <div className={`absolute top-4 left-4 transition-all duration-300 z-40 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-1.5 flex items-center`}>
      <button 
        onClick={() => setOpenBuilder(!openBuilder)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${openBuilder ? 'bg-slate-100/50 text-slate-500 hover:bg-slate-200/50 hover:text-slate-800' : 'bg-[#00A884] text-white hover:bg-[#008f6f] hover:shadow-[0_4px_12px_rgba(0,168,132,0.3)]'}`}
        title={openBuilder ? "Close Palette" : "Open Palette"}
      >
        {openBuilder ? <PanelLeftClose size={18} /> : <Plus size={22} strokeWidth={2.5} />}
      </button>
    </div>
  );
}
