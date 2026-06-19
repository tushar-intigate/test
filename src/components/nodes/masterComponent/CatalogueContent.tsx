import { Handle, Position } from '@xyflow/react';
import { ShoppingBag, Image as ImageIcon, Plus, X } from 'lucide-react';

export default function CatalogueContent({
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
  const text = item.data?.text || '';
  const catalogues = item.data?.catalogues || [];

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-2 space-y-2">
        <div className="flex items-center gap-1 text-[9px] font-bold text-teal-600 uppercase tracking-wider">
          <ShoppingBag size={10} />
          <span>Catalogue Intro</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => updateItemData(index, 'text', e.target.value)}
          className="w-full h-16 text-[11px] text-slate-700 leading-relaxed outline-none resize-none bg-transparent"
          placeholder="Type catalogue intro message..."
        />
        <input
          type="text"
          value={item.data?.footer || ''}
          onChange={(e) => updateItemData(index, 'footer', e.target.value)}
          placeholder="Footer text (optional)"
          className="text-[9px] text-slate-400 italic outline-none w-full border-t border-slate-50 pt-1 mt-1 bg-transparent"
        />
      </div>

      <div className="space-y-2">
        {catalogues.map((cat: string, i: number) => (
          <div key={i} className="relative bg-white border border-slate-200 rounded-xl px-2 py-1.5 flex items-center shadow-sm">
            <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
              <ImageIcon size={10} />
            </div>
            <input
              type="text"
              value={cat}
              onChange={(e) => {
                const newCats = [...catalogues];
                newCats[i] = e.target.value;
                updateItemData(index, 'catalogues', newCats);
              }}
              className="flex-1 ml-2 text-[10px] font-bold text-slate-700 outline-none bg-transparent"
              placeholder="Catalogue Name"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newCats = [...catalogues];
                newCats.splice(i, 1);
                updateItemData(index, 'catalogues', newCats);
              }}
              className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer p-1 rounded hover:bg-rose-50 ml-1"
              title="Remove Catalogue"
            >
              <X size={10} />
            </button>
            <Handle
              type="source"
              position={Position.Right}
              id={`catalogue-right-${propsId}-${i}`}
              className="!h-2.5 !w-2.5 !border-2 !border-white !bg-teal-500 hover:scale-125 transition-transform"
              style={{ right: -5, top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => updateItemData(index, 'catalogues', [...catalogues, 'New Catalogue'])}
        className="w-full py-2 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
      >
        <Plus size={12} /> Add Catalogue
      </button>
    </div>
  );
}
