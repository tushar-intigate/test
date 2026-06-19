import { Handle, Position } from '@xyflow/react';
import { HelpCircle } from 'lucide-react';

export default function QuestionContent({
  item,
  index,
  propsId,
  updateItemData,
}: {
  item: any;
  index: number;
  propsId: string;
  updateItemData: (index: number, key: string, value: any) => void;
}) {
  const qText = item.data?.text || '';
  const attribute = item.data?.attribute || '';
  const attempts = item.data?.attributeNumberOfAttempt || '1';
  const format = item.data?.attributeFormat || 'Any';

  return (
    <div className="relative space-y-2">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-2 space-y-2">
        <div className="flex items-center gap-1 text-[9px] font-bold text-[#0a6c5e] uppercase tracking-wider">
          <HelpCircle size={10} />
          <input
            type="text"
            value={attribute}
            onChange={(e) => updateItemData(index, 'attribute', e.target.value)}
            placeholder="Attribute Name"
            className="bg-slate-50 border border-slate-200 rounded px-1 py-0.5 outline-none flex-1 text-[#0a6c5e]"
          />
        </div>
        <textarea
          value={qText}
          onChange={(e) => updateItemData(index, 'text', e.target.value)}
          className="w-full h-20 text-[11px] text-slate-700 leading-relaxed outline-none resize-none bg-transparent"
          placeholder="Type question here..."
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
          <span className="text-[8px] font-medium text-slate-400 block mb-0.5">Format</span>
          <select
            value={format}
            onChange={(e) => updateItemData(index, 'attributeFormat', e.target.value)}
            className="w-full text-[10px] bg-slate-50 border border-slate-200 rounded outline-none"
          >
            <option value="Any">Any</option>
            <option value="Text">Text</option>
            <option value="Number">Number</option>
          </select>
        </div>
        <div className="flex-1 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
          <span className="text-[8px] font-medium text-slate-400 block mb-0.5">Attempts</span>
          <input
            type="number"
            value={attempts}
            onChange={(e) => updateItemData(index, 'attributeNumberOfAttempt', e.target.value)}
            className="w-full text-[10px] bg-slate-50 border border-slate-200 rounded outline-none px-1"
            min="1"
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={`question-right-${propsId}`}
        className="!h-2.5 !w-2.5 !border-2 !border-white !bg-teal-500 hover:scale-125 transition-transform"
        style={{ right: -18, top: '35%' }}
      />
    </div>
  );
}
