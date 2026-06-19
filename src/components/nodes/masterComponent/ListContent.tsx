import { Handle, Position } from '@xyflow/react';
import { List, Plus } from 'lucide-react';

export default function ListContent({
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
  const header = item.data?.header || '';
  const body = item.data?.body || '';
  const footer = item.data?.footer || '';
  const buttonTitle = item.data?.buttonTitle || 'View Options';
  const sections = item.data?.sections || [];

  const updateListSections = (newSections: any[]) => {
    updateItemData(index, 'sections', newSections);
  };

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-2 space-y-1.5">
        <input
          type="text"
          value={header}
          onChange={(e) => updateItemData(index, 'header', e.target.value)}
          placeholder="Header text (optional)"
          className="text-[10px] font-bold text-slate-600 border-b border-slate-100 pb-1 outline-none w-full"
        />
        <textarea
          value={body}
          onChange={(e) => updateItemData(index, 'body', e.target.value)}
          className="w-full h-16 text-[11px] text-slate-700 leading-relaxed outline-none resize-none bg-transparent"
          placeholder="Type main body message..."
        />
        <input
          type="text"
          value={footer}
          onChange={(e) => updateItemData(index, 'footer', e.target.value)}
          placeholder="Footer text (optional)"
          className="text-[9px] text-slate-400 italic outline-none w-full border-t border-slate-50 pt-1"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-2 space-y-2">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <List size={12} className="text-[#0a6c5e]" />
          <input
            type="text"
            value={buttonTitle}
            onChange={(e) => updateItemData(index, 'buttonTitle', e.target.value)}
            className="text-[10px] font-bold uppercase outline-none text-[#0a6c5e] w-full"
            placeholder="Button Title"
          />
        </div>

        <div className="space-y-3">
          {sections.map((section: any, sIdx: number) => (
            <div key={section.id || sIdx} className="space-y-1.5 border border-slate-100 rounded-lg p-1.5 bg-slate-50">
              <input
                type="text"
                value={section.title}
                onChange={(e) => {
                  const newSec = [...sections];
                  newSec[sIdx].title = e.target.value;
                  updateListSections(newSec);
                }}
                className="w-full bg-transparent text-[9px] font-bold text-slate-500 uppercase tracking-wider outline-none px-1"
                placeholder="SECTION TITLE"
              />

              <div className="space-y-1.5">
                {(section.items || []).map((row: any, rIdx: number) => (
                  <div key={row.id} className="relative flex flex-col gap-0.5 rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm">
                    <input
                      type="text"
                      value={row.title}
                      onChange={(e) => {
                        const newSec = [...sections];
                        newSec[sIdx].items[rIdx].title = e.target.value;
                        updateListSections(newSec);
                      }}
                      className="text-[10px] font-bold text-slate-700 outline-none w-[90%]"
                      placeholder="Item Title"
                    />
                    <input
                      type="text"
                      value={row.description || ''}
                      onChange={(e) => {
                        const newSec = [...sections];
                        newSec[sIdx].items[rIdx].description = e.target.value;
                        updateListSections(newSec);
                      }}
                      className="text-[9px] text-slate-400 outline-none w-[90%]"
                      placeholder="Item Description"
                    />
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={row.id}
                      className="!h-2.5 !w-2.5 !border-2 !border-white !bg-[#0a6c5e] hover:scale-125 transition-transform"
                      style={{ right: -8, top: '50%', transform: 'translateY(-50%)' }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const newSec = [...sections];
                  if (!newSec[sIdx].items) newSec[sIdx].items = [];
                  const newItemId = `list_message-right-${propsId}-${sIdx}-${Date.now()}-|None`;
                  newSec[sIdx].items.push({
                    id: newItemId,
                    source_handle_type: newItemId,
                    title: 'New Item',
                    description: ''
                  });
                  updateListSections(newSec);
                }}
                className="w-full mt-1 py-1 bg-white border border-slate-200 rounded-lg flex items-center justify-center gap-1 text-[9px] font-medium text-[#0a6c5e] hover:bg-emerald-50 cursor-pointer shadow-sm"
              >
                <Plus size={10} /> Add Item
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => updateListSections([...sections, { id: `sec_${Date.now()}`, title: 'New Section', items: [] }])}
          className="w-full py-2 border border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Plus size={12} /> Add Section
        </button>
      </div>
    </div>
  );
}
