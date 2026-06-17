import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  HelpCircle,
  Play,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';

type QuestionItem = {
  label: string;
  variable: string;
};

type SurveyNodeData = {
  surveyTitle?: string;
  questions?: QuestionItem[];
  answers?: Record<string, string>;

  onAnswerChange?: (
    nodeId: string,
    question: string,
    value: string
  ) => void;

  onPreviewNode?: (id: string) => void;
  onSelectNode?: (id: string) => void;
  onCopyNode?: (id: string) => void;
  onDeleteNode?: (id: string) => void;
};

export default function SurveyNode(
  props: NodeProps
) {
  const data = props.data as SurveyNodeData;

  const questions: QuestionItem[] =
    data.questions || [
      { label: 'What is your name?', variable: 'name' },
      { label: 'What is your email?', variable: 'email' },
      { label: 'What is your phone number?', variable: 'phone' },
      { label: 'What city are you from?', variable: 'city' },
    ];

  const answers = data.answers || {};

  const handleAnswerChange = (variable: string, value: string) => {
    data.onAnswerChange?.(props.id, variable, value);
  };

  return (
    <div className="relative w-[280px] rounded-2xl border border-slate-200/80 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-white !bg-blue-500"
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
            <HelpCircle size={14} className="text-white" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-white leading-tight">
              {data.surveyTitle || 'Question Block'}
            </h3>
            <p className="text-[9px] text-blue-100/80">Data Collector</p>
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
      <div className="max-h-[350px] overflow-y-auto p-3 space-y-2.5 bg-slate-50/50">
        {questions.map((question) => (
          <div key={question.variable} className="space-y-1.5">
            {/* Question */}
            <div className="rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-100">
              <p className="text-[10px] text-slate-700">{question.label}</p>
            </div>

            {/* Answer Input */}
            <div className="flex justify-end">
              <input
                type="text"
                placeholder={`Enter ${question.variable}`}
                value={answers[question.variable] || ''}
                onChange={(e) => handleAnswerChange(question.variable, e.target.value)}
                className="w-[200px] rounded-xl border border-emerald-200/60 bg-emerald-50/50 px-3 py-1.5 text-[10px] text-slate-700 outline-none focus:border-emerald-400 shadow-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-white !bg-blue-500"
      />
    </div>
  );
}