import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap, Tag, Settings } from 'lucide-react';

interface KeywordBoxData {
  label?: string;
  text?: string;
  keywords?: string[];
  templates?: any[];
  qrCampaigns?: any[];
  regexCaseSensitive?: boolean;
}

export default function KeywordNode(props: NodeProps) {
  const data = props.data as KeywordBoxData;
  const keywords = data.keywords || [];

  return (
    <div className="relative w-[340px] overflow-hidden rounded-3xl border border-teal-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Zap size={16} className="text-white fill-white/20" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{data.label || 'Trigger Node'}</h3>
              <p className="text-[10px] text-teal-100">WhatsApp Entry Point</p>
            </div>
          </div>
          <div className="rounded-md bg-white/10 p-1 text-teal-100 hover:bg-white/20 hover:text-white cursor-pointer">
            <Settings size={14} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-[#ECE5DD] p-4 space-y-3">
        {/* Helper Note */}
        <div className="rounded-xl bg-white/80 p-3 shadow-sm border border-teal-100/30">
          <p className="text-xs font-semibold text-slate-700 mb-1">
            {data.text || 'Add keywords to start chat'}
          </p>
          <p className="text-[10px] text-slate-500">
            Case Sensitive: <span className="font-semibold">{data.regexCaseSensitive ? 'Yes' : 'No'}</span>
          </p>
        </div>

        {/* Keywords List */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Tag size={12} className="text-teal-600" />
            <span>Active Keywords</span>
          </div>
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-medium text-teal-800 border border-teal-200"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-teal-300 bg-teal-50/50 p-2.5 text-center">
              <p className="text-[11px] text-teal-700 italic">
                No keywords defined. Responds to any incoming message.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Source Handles */}
      {/* Supports both direct 'keyword-right-keyword' source handle and node id specific handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="keyword-right-keyword"
        className="!h-3.5 !w-3.5 !border-2 !border-white !bg-teal-500 hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`keyword-right-${props.id}`}
        className="!h-3.5 !w-3.5 !border-2 !border-white !bg-teal-500 hover:scale-125 transition-transform"
        style={{ top: '65%' }}
      />
    </div>
  );
}
