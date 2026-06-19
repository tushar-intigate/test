import { Zap, Tag, Settings, Trash2, Copy, Eye } from 'lucide-react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface KeywordBoxData {
  label?: string;
  text?: string;
  keywords?: string[];
  templates?: any[];
  qrCampaigns?: any[];
  regexCaseSensitive?: boolean;
  onPreviewNode?: (id: string) => void;
  onSelectNode?: (id: string) => void;
  onCopyNode?: (id: string) => void;
  onDeleteNode?: (id: string) => void;
}

export default function KeywordNode(props: NodeProps) {
  const data = props.data as KeywordBoxData;
  const keywords = data.keywords || [];

  return (
    <div className="relative w-[280px] rounded-2xl border border-slate-200/80 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-gradient-to-r from-teal-600 to-emerald-600 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-white leading-tight">{data.label || 'Trigger Node'}</h3>
            <p className="text-[9px] text-teal-100/80">WhatsApp Entry Point</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5">
          <button onClick={(e) => { e.stopPropagation(); data.onPreviewNode?.(props.id); }}
            className="p-1 rounded text-white/60 hover:bg-white/15 hover:text-white transition cursor-pointer" title="Preview">
            <Eye size={10} className="fill-current" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); data.onSelectNode?.(props.id); }}
            className="p-1 rounded text-white/60 hover:bg-white/15 hover:text-white transition cursor-pointer" title="Edit">
            <Settings size={10} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); data.onCopyNode?.(props.id); }}
            className="p-1 rounded text-white/60 hover:bg-white/15 hover:text-white transition cursor-pointer" title="Copy">
            <Copy size={10} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); data.onDeleteNode?.(props.id); }}
            className="p-1 rounded text-white/60 hover:bg-rose-400/30 hover:text-rose-200 transition cursor-pointer" title="Delete">
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-3 space-y-2.5 bg-slate-50/50">
        {/* Description */}
        <p className="text-[10px] text-slate-500 leading-snug">
          {data.text || 'Add keywords to start chat'}
        </p>

        {/* Keywords */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <Tag size={10} className="text-teal-500" />
            <span>Keywords</span>
          </div>
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {keywords.map((kw, i) => (
                <span key={i} className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700 border border-teal-200/60">
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 italic">No keywords — responds to any message</p>
          )}
        </div>

        {/* Case sensitivity indicator */}
        <div className="flex items-center gap-1 text-[9px] text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full ${data.regexCaseSensitive ? 'bg-amber-400' : 'bg-slate-300'}`}></span>
          Case Sensitive: {data.regexCaseSensitive ? 'Yes' : 'No'}
        </div>
      </div>

      {/* ── Handles ── */}
      <Handle
        type="source"
        position={Position.Right}
        id="keyword-right-keyword"
        className="!h-3 !w-3 !border-2 !border-white !bg-teal-500 hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`keyword-right-${props.id}`}
        className="!h-3 !w-3 !border-2 !border-white !bg-teal-500 hover:scale-125 transition-transform"
        style={{ top: '70%' }}
      />
    </div>
  );
}
