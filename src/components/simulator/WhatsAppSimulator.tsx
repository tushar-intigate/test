import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, X, MoreVertical, Paperclip, Mic, Send, CheckCircle2, Image as ImageIcon, Video, Music, FileText, ChevronUp, ChevronDown } from 'lucide-react';

interface WhatsAppSimulatorProps {
  chatLog: any[];
  simLoading: boolean;
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  onSendMessage: (text?: string) => void;
  onButtonClick: (btn: any) => void;
  onListOptionClick: (row: any) => void;
  simVariables: Record<string, string>;
  onReset: () => void;
  simMode: 'single' | 'full';
  onSimModeChange: (mode: 'single' | 'full') => void;
}

function getCurrentTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const wallpaperStyle = {
  backgroundColor: '#dfe7d2',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='304' height='304'%3E%3Cg fill='%23c8d5b9' fill-opacity='0.35'%3E%3Cpath d='M44 20a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm16 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm16 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm16 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm16 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm16 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm16 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm16 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8z'/%3E%3C/g%3E%3C/svg%3E")`,
};

type AttachType = 'image' | 'video' | 'audio' | 'document';

const ATTACH_OPTIONS: { type: AttachType; label: string; icon: any; color: string; bg: string; accept: string }[] = [
  { type: 'image',    label: 'Image',    icon: ImageIcon,  color: 'text-purple-600', bg: 'bg-purple-100', accept: 'image/*' },
  { type: 'video',    label: 'Video',    icon: Video,      color: 'text-red-600',    bg: 'bg-red-100',    accept: 'video/*' },
  { type: 'audio',    label: 'Audio',    icon: Music,      color: 'text-orange-600', bg: 'bg-orange-100', accept: 'audio/*' },
  { type: 'document', label: 'Document', icon: FileText,   color: 'text-blue-600',   bg: 'bg-blue-100',   accept: '*/*' },
];

export default function WhatsAppSimulator({
  chatLog,
  simLoading,
  inputMessage,
  setInputMessage,
  onSendMessage,
  onButtonClick,
  onListOptionClick,
  simVariables,
  onReset,
  simMode,
}: WhatsAppSimulatorProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showAttach, setShowAttach] = useState(false);
  const [showVars, setShowVars] = useState(false);
  const [localChatLog, setLocalChatLog] = useState<any[]>([]);
  const fileInputRefs = useRef<Record<AttachType, HTMLInputElement | null>>({
    image: null, video: null, audio: null, document: null,
  });

  // Merge external chatLog with local media messages
  const mergedLog = [...chatLog, ...localChatLog].sort((a, b) => (a._ts || 0) - (b._ts || 0));

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, localChatLog]);

  const isInteractive = simMode === 'full';

  const handleFileSelect = (type: AttachType, file: File) => {
    setShowAttach(false);
    const url = URL.createObjectURL(file);
    const entry = { sender: 'user', type: `media_${type}`, url, name: file.name, _ts: Date.now() + Math.random() };
    setLocalChatLog((prev) => [...prev, entry]);
  };

  const renderMedia = (log: any) => {
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
    <div className="flex flex-col h-full overflow-hidden bg-[#dfe7d2] relative">

      {/* Hidden file inputs */}
      {ATTACH_OPTIONS.map(({ type, accept }) => (
        <input
          key={type}
          type="file"
          accept={accept}
          className="hidden"
          ref={(el) => { fileInputRefs.current[type] = el; }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(type, f); e.target.value = ''; }}
        />
      ))}

      {/* ── WhatsApp Header Bar ── */}
      <div className="bg-[#008069] text-white flex items-center gap-3 px-3 py-2.5 shadow-md shrink-0">
        <button onClick={onReset} className="text-white/80 hover:text-white cursor-pointer transition" title="Reset">
          <ArrowLeft size={20} />
        </button>
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#d4a843] flex items-center justify-center text-white font-bold text-sm shadow-inner">
            <svg viewBox="0 0 36 36" className="w-7 h-7 fill-white opacity-90">
              <path d="M18 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0 2c-7 0-13 3.6-13 8v1h26v-1c0-4.4-6-8-13-8z" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-tight truncate">919810765443</p>
          <p className="text-[10px] text-white/70 leading-none">online</p>
        </div>
        <div className="flex items-center gap-3 text-white/80">
          <button className="hover:text-white cursor-pointer"><MoreVertical size={18} /></button>
          <button onClick={onReset} className="hover:text-white cursor-pointer" title="Close"><X size={18} /></button>
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1.5" style={wallpaperStyle}>
        {mergedLog.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-10">
            <div className="bg-[#ffffffcc] rounded-xl px-4 py-2 text-[11px] text-slate-500 text-center shadow-sm">
              {simMode === 'single' ? 'Click ▶ on a node to preview' : 'Start interacting with the flow below'}
            </div>
          </div>
        )}

        {mergedLog.map((log, idx) => {
          if (log.sender === 'system') {
            return (
              <div key={idx} className="flex justify-center my-1">
                <div className="bg-[#ffffffbb] text-[#5f6368] rounded-lg px-3 py-1 text-[10px] font-medium shadow-sm max-w-[85%] text-center">
                  {log.text}
                </div>
              </div>
            );
          }

          const isBot = log.sender === 'bot';
          const isLast = idx === mergedLog.length - 1;
          const isMedia = log.type?.startsWith('media_');

          return (
            <div key={idx} className={`flex flex-col gap-1 ${isBot ? 'items-start' : 'items-end'}`}>
              {isMedia ? (
                renderMedia(log)
              ) : (
                <div className={`relative max-w-[78%] rounded-lg px-3 py-2 text-[12px] shadow-sm leading-relaxed ${
                  isBot ? 'bg-white text-[#111] rounded-tl-none' : 'bg-[#dcf8c6] text-[#111] rounded-tr-none'
                }`}>
                  <p className="whitespace-pre-wrap">{log.text}</p>
                  <span className="block text-right text-[9px] text-slate-400 mt-1">{getCurrentTime()}</span>
                </div>
              )}

              {isBot && (isLast || simMode === 'single') && (
                <div className="flex flex-col gap-1.5 w-full max-w-[78%]">
                  {log.type === 'message' && log.options?.map((btn: any) => (
                    <button
                      key={btn.id}
                      onClick={() => isInteractive ? onButtonClick(btn) : undefined}
                      className={`w-full bg-white text-[#008069] text-[12px] font-semibold text-center py-2.5 rounded-lg shadow-sm border border-white/80 transition ${
                        isInteractive ? 'hover:bg-[#f0faf7] active:scale-[0.98] cursor-pointer' : 'cursor-default opacity-75'
                      }`}
                    >
                      {btn.text}
                    </button>
                  ))}

                  {log.type === 'list' && log.sections?.map((sec: any) => (
                    <div key={sec.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
                      {sec.title && (
                        <div className="bg-slate-50 px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                          {sec.title}
                        </div>
                      )}
                      {sec.items?.map((opt: any, i: number) => (
                        <button
                          key={opt.id}
                          onClick={() => isInteractive ? onListOptionClick(opt) : undefined}
                          className={`flex items-center w-full text-left px-2.5 py-2 gap-2 border-b border-slate-100 last:border-0 transition ${
                            isInteractive ? 'hover:bg-[#f0faf7] cursor-pointer' : 'cursor-default opacity-75'
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
                </div>
              )}
            </div>
          );
        })}

        {simLoading && (
          <div className="flex items-start">
            <div className="bg-white rounded-lg rounded-tl-none px-4 py-2.5 shadow-sm flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ── Attachment Menu (pops up above input) ── */}
      {showAttach && (
        <div className="absolute bottom-[60px] left-3 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 flex flex-col gap-2 w-44">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attach</span>
            <button onClick={() => setShowAttach(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={13} />
            </button>
          </div>
          {ATTACH_OPTIONS.map(({ type, label, icon: Icon, color, bg }) => (
            <button
              key={type}
              onClick={() => fileInputRefs.current[type]?.click()}
              className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer text-left w-full"
            >
              <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={15} className={color} />
              </div>
              <span className="text-[12px] font-semibold text-slate-700">{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Message Input Bar ── */}
      <div className={`bg-[#f0f2f5] px-2 py-2 flex items-center gap-2 shrink-0 ${!isInteractive ? 'opacity-40 pointer-events-none' : ''}`}>
        {/* Attachment button */}
        <button
          onClick={() => setShowAttach((v) => !v)}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition cursor-pointer shrink-0 ${showAttach ? 'bg-[#008069] text-white' : 'text-slate-500 hover:text-slate-700'}`}
          title="Attach file"
        >
          {showAttach ? <ChevronUp size={16} /> : <Paperclip size={16} />}
        </button>

        <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2 shadow-sm gap-2">
          <input
            type="text"
            placeholder="Type a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
            className="flex-1 text-[12px] text-[#111] outline-none bg-transparent placeholder:text-slate-400"
          />
        </div>
        <button
          onClick={() => onSendMessage()}
          className="w-10 h-10 bg-[#008069] text-white rounded-full flex items-center justify-center shadow hover:bg-[#006b58] active:scale-95 transition cursor-pointer shrink-0"
        >
          {inputMessage.trim() ? <Send size={16} className="ml-0.5" /> : <Mic size={16} />}
        </button>
      </div>

      {/* ── Collected Variables Panel ── */}
      {simMode === 'full' && Object.keys(simVariables).length > 0 && (
        <div className="bg-white border-t border-slate-100 shrink-0">
          {/* Collapsible Header */}
          <button
            onClick={() => setShowVars((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 transition cursor-pointer"
          >
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={10} className="text-[#008069]" />
              Captured Variables ({Object.keys(simVariables).length})
            </span>
            {showVars ? <ChevronDown size={13} className="text-slate-400" /> : <ChevronUp size={13} className="text-slate-400" />}
          </button>

          {/* Variable Chips */}
          {showVars && (
            <div className="flex flex-wrap gap-1.5 px-3 pb-2.5">
              {Object.entries(simVariables).map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-lg px-2 py-1 border border-slate-100 text-[10px]">
                  <span className="text-slate-400 font-bold uppercase">{k}: </span>
                  <span className="text-slate-700 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
