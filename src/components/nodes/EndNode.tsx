import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  CheckCircle2,
  Play,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';

type FeedbackNodeData = {
  label?: string;
  surveyTitle?: string;
  question?: string;
  variable?: string;
  required?: boolean;

  questionType?:
  | 'text'
  | 'single-choice'
  | 'multi-choice';

  options?: string[];

  answers?: Record<string, string>;

  onAnswerChange?: (
    nodeId: string,
    variable: string,
    value: string
  ) => void;

  onPreviewNode?: (id: string) => void;
  onSelectNode?: (id: string) => void;
  onCopyNode?: (id: string) => void;
  onDeleteNode?: (id: string) => void;
};

export default function FeedbackNode(
  props: NodeProps
) {
  const data = props.data as FeedbackNodeData;

  const variable = data.variable || 'feedback';
  const answers = data.answers || {};
  const feedback = answers[variable] || '';

  const options = data.options || [
    'Very Satisfied',
    'Satisfied',
    'Neutral',
    'Dissatisfied',
  ];

  const handleFeedbackChange = (value: string) => {
    data.onAnswerChange?.(props.id, variable, value);
  };

  return (
    <div className="relative w-[280px] rounded-2xl border border-slate-200/80 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-white !bg-rose-500"
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-gradient-to-r from-rose-600 to-pink-600 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
            <CheckCircle2 size={14} className="text-white" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-white leading-tight">
              {data.surveyTitle || 'End Flow'}
            </h3>
            <p className="text-[9px] text-rose-100/80">Feedback & Exit</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5">
          <button onClick={(e) => { e.stopPropagation(); data.onPreviewNode?.(props.id); }}
            className="p-1 rounded text-white/60 hover:bg-white/15 hover:text-white transition cursor-pointer" title="Preview">
            <Play size={10} className="fill-current" />
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
        {/* Question Message */}
        <div className="rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-700 leading-relaxed">
            {data.question || 'How satisfied are you with our service?'}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-1">
          {options.map((option) => (
            <label key={option} className="block cursor-pointer">
              <input
                type="radio"
                name={`feedback-${props.id}`}
                checked={feedback === option}
                onChange={() => handleFeedbackChange(option)}
                className="hidden"
              />
              <div className={`rounded-xl px-3 py-2 text-[10px] shadow-sm transition border
                ${feedback === option
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                  : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                }`}
              >
                {option}
              </div>
            </label>
          ))}
        </div>

        {/* Selected Response */}
        {feedback && (
          <div className="flex justify-end">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 shadow-sm">
              <p className="text-[10px] font-semibold text-emerald-700">{feedback}</p>
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-white !bg-rose-500"
      />
    </div>
  );
}