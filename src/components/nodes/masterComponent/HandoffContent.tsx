import { UserSquare2, ToggleRight } from 'lucide-react';

export default function HandoffContent({
  item,
  index,
  updateItemData,
}: {
  item: any;
  index: number;
  updateItemData: (index: number, key: string, value: any) => void;
}) {
  const isReq = item.data?.isRequesting;
  return (
    <div className="rounded-xl border border-dashed border-rose-200 bg-white p-3 space-y-2 shadow-sm">
      <div className="flex items-center gap-1.5 text-rose-600 border-b border-rose-50 pb-2">
        <UserSquare2 size={14} />
        <span className="text-[11px] font-bold">Human Agent Handoff</span>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-slate-500 font-medium">Request Agent?</span>
        <button
          onClick={() => updateItemData(index, 'isRequesting', !isReq)}
          className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <ToggleRight size={20} className={isReq ? "text-rose-500" : "text-slate-300"} strokeWidth={2} />
          <span className={`text-[9px] font-bold uppercase ${isReq ? 'text-rose-500' : 'text-slate-400'}`}>
            {isReq ? 'Awaiting' : 'Inactive'}
          </span>
        </button>
      </div>
    </div>
  );
}
