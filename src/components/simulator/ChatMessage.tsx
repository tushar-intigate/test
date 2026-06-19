import { FileText, ShoppingBag } from 'lucide-react';

interface ChatMessageProps {
  log: any;
  isBot: boolean;
  isLast: boolean;
  simMode: 'single' | 'full';
  isInteractive: boolean;
  onButtonClick: (btn: any) => void;
  onListOptionClick: (opt: any) => void;
  getCurrentTime: () => string;
}

export default function ChatMessage({
  log,
  isBot,
  isLast,
  simMode,
  isInteractive,
  onButtonClick,
  onListOptionClick,
  getCurrentTime,
}: ChatMessageProps) {
  const isMedia = log.type?.startsWith('media_');

  const renderMedia = () => {
    if (log.type === 'media_image') {
      return (
        <div className="rounded-lg overflow-hidden shadow-sm max-w-[200px]">
          <img src={log.url} alt={log.name} className="w-full object-cover" />
          <div className="bg-[#dcf8c6] px-2 py-1 text-[9px] text-right text-slate-400">{getCurrentTime()}</div>
        </div>
      );
    }
    if (log.type === 'media_video') {
      return (
        <div className="rounded-lg overflow-hidden shadow-sm max-w-[200px] bg-[#dcf8c6]">
          <video src={log.url} controls className="w-full rounded-t-lg" />
          <div className="px-2 py-1 text-[9px] text-right text-slate-400">{getCurrentTime()}</div>
        </div>
      );
    }
    if (log.type === 'media_audio') {
      return (
        <div className="bg-[#dcf8c6] rounded-lg px-3 py-2 shadow-sm max-w-[200px]">
          <audio src={log.url} controls className="w-full h-7 text-xs" />
          <div className="text-[9px] text-right text-slate-400 mt-0.5">{getCurrentTime()}</div>
        </div>
      );
    }
    // document
    return (
      <div className="bg-[#dcf8c6] rounded-lg px-3 py-2 shadow-sm flex items-center gap-2 max-w-[200px]">
        <FileText size={20} className="text-blue-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-slate-700 truncate">{log.name}</p>
          <p className="text-[9px] text-slate-400">Document</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-1 ${isBot ? 'items-start' : 'items-end'}`}>
      {isMedia ? (
        renderMedia()
      ) : (
        <div className={`relative max-w-[78%] rounded-2xl px-3 py-2.5 text-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] leading-relaxed ${isBot ? 'bg-white text-[#111] rounded-tl-sm' : 'bg-[#dcf8c6] text-[#111] rounded-tr-sm'
          }`}>
          <p className="whitespace-pre-wrap">{log.text}</p>
          {log.footer && (
            <p className="text-[10px] text-slate-400 mt-1.5">{log.footer}</p>
          )}
          <span className="block text-right text-[9px] text-slate-400 mt-1">{getCurrentTime()}</span>
        </div>
      )}

      {isBot && (isLast || simMode === 'single') && (
        <div className="flex flex-col gap-1.5 w-full max-w-[78%]">
          {log.type === 'message' && log.options?.map((btn: any) => (
            <button
              key={btn.id}
              onClick={() => isInteractive ? onButtonClick(btn) : undefined}
              className={`w-full bg-white text-[#008069] text-[12px] font-semibold text-center py-2.5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-white/80 transition ${isInteractive ? 'hover:bg-[#f0faf7] active:scale-[0.98] cursor-pointer' : 'cursor-default opacity-75'
                }`}
            >
              {btn.text}
            </button>
          ))}

          {log.type === 'list' && log.sections?.map((sec: any) => (
            <div key={sec.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              {sec.title && (
                <div className="bg-slate-50 px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {sec.title}
                </div>
              )}
              {sec.items?.map((opt: any, i: number) => (
                <button
                  key={opt.id}
                  onClick={() => isInteractive ? onListOptionClick(opt) : undefined}
                  className={`flex items-center w-full text-left px-2.5 py-2 gap-2 border-b border-slate-100 last:border-0 transition ${isInteractive ? 'hover:bg-[#f0faf7] cursor-pointer' : 'cursor-default opacity-75'
                    }`}
                >
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-400 shrink-0">{i + 1}</div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-700">{opt.title}</p>
                    {opt.description && <p className="text-[8px] text-slate-400">{opt.description}</p>}
                  </div>
                </button>
              ))}
            </div>
          ))}

          {log.type === 'catalogue' && log.catalogues?.length > 0 && (
            <button
              className={`w-full bg-white text-[#008069] text-[12px] font-semibold text-center py-2.5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-white/80 transition flex items-center justify-center gap-1.5 ${isInteractive ? 'hover:bg-[#f0faf7] active:scale-[0.98] cursor-pointer' : 'cursor-default opacity-75'
                }`}
            >
              <ShoppingBag size={14} /> View Catalog
            </button>
          )}
        </div>
      )}
    </div>
  );
}
