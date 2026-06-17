import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  ClipboardList,
  BadgeCheck,
  Play,
  ArrowLeft,
} from 'lucide-react';

type SurveyNodeData = {
  surveyTitle?: string;
  question?: string;
  description?: string;
};

export default function SurveyNode(
  props: NodeProps
) {
  const data = props.data as SurveyNodeData;

  return (
    <div className="relative w-[380px] overflow-hidden rounded-3xl border border-green-200 bg-white shadow-xl">

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!h-4 !w-4 !border-2 !border-white !bg-[#25D366]"
      />

      {/* WhatsApp Header */}
      <div className="bg-[#075E54] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <ClipboardList
              size={20}
              className="text-white"
            />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {data.surveyTitle ||
                'Customer Survey'}
            </h3>

            <div className="flex items-center gap-1 text-xs text-green-100">
              <BadgeCheck size={12} />
              WhatsApp Survey
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-[#ECE5DD] p-4">

        {/* Incoming Message */}
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow">
            <p className="text-sm font-medium text-slate-800">
              {data.question ||
                'Would you like to participate in our customer feedback survey?'}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {data.description ||
                'Your feedback helps us improve our products and services.'}
            </p>

            <div className="mt-2 text-right text-[10px] text-slate-400">
              10:30 AM
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <button className="flex w-full items-center justify-center gap-2 border-b border-slate-100 py-3 text-sm font-medium text-[#00A884] transition hover:bg-slate-50">
            <Play size={16} />
            Start Survey
          </button>

          <button className="flex w-full items-center justify-center gap-2 py-3 text-sm font-medium text-[#00A884] transition hover:bg-slate-50">
            <ArrowLeft size={16} />
            No Thanks
          </button>

        </div>

        {/* Survey Info */}
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3">
          <p className="text-xs text-green-700">
            User can start the survey or exit the flow.
          </p>
        </div>

      </div>


    </div>
  );
}