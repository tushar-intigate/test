import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  Play as PlayIcon,
  ArrowLeft,
  Settings,
  Trash2,
  Copy,
  CirclePlay
} from 'lucide-react';

type SurveyNodeData = {
  surveyTitle?: string;
  question?: string;
  description?: string;
  onPreviewNode?: (id: string) => void;
  onSelectNode?: (id: string) => void;
  onCopyNode?: (id: string) => void;
  onDeleteNode?: (id: string) => void;
};

export default function SurveyNode(
  props: NodeProps
) {
  const data = props.data as SurveyNodeData;

  return (
    <div className="relative w-[280px] rounded-2xl border border-slate-200/80 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-white !bg-emerald-500"
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
            <CirclePlay size={14} className="text-white" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-white leading-tight">
              {data.surveyTitle || 'Start Flow'}
            </h3>
            <p className="text-[9px] text-emerald-100/80">Flow Entry Point</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5">
          <button onClick={(e) => { e.stopPropagation(); data.onPreviewNode?.(props.id); }}
            className="p-1 rounded text-white/60 hover:bg-white/15 hover:text-white transition cursor-pointer" title="Preview">
            <PlayIcon size={10} className="fill-current" />
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
        {/* Message */}
        <div className="rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-700 leading-relaxed">
            {data.question || 'Welcome! Click Start to begin.'}
          </p>
          {data.description && (
            <p className="mt-1 text-[9px] text-slate-400">{data.description}</p>
          )}
          <div className="mt-1 text-right text-[8px] text-slate-300">10:30 AM</div>
        </div>

        {/* CTA Buttons */}
        <div className="rounded-xl border border-slate-100 bg-white overflow-hidden divide-y divide-slate-50">
          <button className="flex w-full items-center justify-center gap-1.5 py-2 text-[10px] font-semibold text-[#00A884] hover:bg-slate-50/50 transition">
            <PlayIcon size={12} />
            Start Survey
          </button>
          <button className="flex w-full items-center justify-center gap-1.5 py-2 text-[10px] font-semibold text-slate-400 hover:bg-slate-50/50 transition">
            <ArrowLeft size={12} />
            No Thanks
          </button>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-white !bg-emerald-500"
      />
    </div>
  );
}