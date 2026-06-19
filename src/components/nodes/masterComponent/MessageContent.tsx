import { Handle, Position } from '@xyflow/react';
import { CircleDot, Plus, X, Upload } from 'lucide-react';

export default function MessageContent({
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
  const buttons = item.data?.buttons || [];
  const mediaType = item.data?.mediaType || 'none';
  const mediaUrl = item.data?.mediaUrl || '';
  const mediaName = item.data?.mediaName || '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateItemData(index, 'mediaUrl', url);
      updateItemData(index, 'mediaName', file.name);
    }
  };

  const updateButtonText = (btnIndex: number, newText: string) => {
    const newButtons = [...buttons];
    newButtons[btnIndex] = { ...newButtons[btnIndex], text: newText };
    updateItemData(index, 'buttons', newButtons);
  };

  const addNewButton = () => {
    const newId = Date.now();
    const newButtons = [...buttons, { text: 'New Button', id: newId, source_handle_type: 'message_with_button' }];
    updateItemData(index, 'buttons', newButtons);
  };

  const removeButton = (e: React.MouseEvent, bIdx: number) => {
    e.stopPropagation();
    const newButtons = [...buttons];
    newButtons.splice(bIdx, 1);
    updateItemData(index, 'buttons', newButtons);
  };

  return (
    <div className="space-y-2">
      {/* Media Header Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-2.5 flex flex-col gap-2 shadow-sm text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-500 text-[10px]">Media Header</span>
          <select
            value={mediaType}
            onChange={(e) => {
              updateItemData(index, 'mediaType', e.target.value);
              if (e.target.value === 'none') {
                updateItemData(index, 'mediaUrl', '');
                updateItemData(index, 'mediaName', '');
              }
            }}
            className="text-[10px] border border-slate-200 rounded bg-white px-1.5 py-0.5 outline-none font-medium text-[#0ea5e9] cursor-pointer"
          >
            <option value="none">None</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="document">Document</option>
          </select>
        </div>

        {mediaType !== 'none' && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <label className="flex items-center justify-center gap-1 bg-[#f0faf7] text-[#008069] border border-emerald-100 hover:bg-[#e6f7f3] px-2.5 py-1.5 rounded-lg text-[9px] font-bold cursor-pointer transition select-none flex-1">
              <Upload size={10} />
              <span>{mediaName ? 'Change File' : 'Upload File'}</span>
              <input
                type="file"
                accept={
                  mediaType === 'image' ? 'image/*' :
                  mediaType === 'video' ? 'video/*' :
                  mediaType === 'audio' ? 'audio/*' :
                  '*'
                }
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {mediaUrl && (
              <div className="flex items-center gap-1.5 max-w-[50%] overflow-hidden text-[9px] bg-slate-50 px-2 py-1 rounded border border-slate-200 text-slate-500">
                <span className="truncate flex-1 font-semibold">{mediaName || 'Uploaded'}</span>
                <button
                  onClick={() => {
                    updateItemData(index, 'mediaUrl', '');
                    updateItemData(index, 'mediaName', '');
                  }}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Text Message Area */}
      <div className={`bg-white rounded-xl border ${text.length === 0 || text.length > 1024 ? 'border-rose-300' : 'border-slate-200'} shadow-sm overflow-hidden flex flex-col`}>
        <textarea
          value={text}
          onChange={(e) => updateItemData(index, 'text', e.target.value)}
          className="w-full h-32 p-3 text-[11px] text-slate-700 leading-relaxed outline-none resize-none"
          placeholder="Type your message here..."
          maxLength={1024}
        />
        <div className="px-3 py-1.5 flex justify-between items-center bg-white border-t border-slate-50">
          <div>
            {text.length === 0 && <span className="text-[8px] font-bold text-rose-500">Message cannot be empty</span>}
            {text.length > 1024 && <span className="text-[8px] font-bold text-rose-500">Exceeds 1024 characters</span>}
          </div>
          <span className={`text-[9px] font-medium ${text.length === 0 || text.length > 1024 ? 'text-rose-500' : 'text-slate-400'}`}>{text.length}/1024</span>
        </div>

        {/* Default Edge Point */}
        <Handle
          type="source"
          position={Position.Right}
          id={`message-right-${propsId}`}
          className="!h-2.5 !w-2.5 !border-2 !border-white !bg-[#00A884] hover:scale-125 transition-transform"
          style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }}
        />
      </div>

      {/* Reply Buttons List */}
      <div className="space-y-2">
        {buttons.map((btn: any, bIdx: number) => (
          <div key={btn.id} className={`relative bg-white border ${btn.text.length === 0 || btn.text.length > 20 ? 'border-rose-300' : 'border-slate-200'} rounded-xl px-3 py-2 flex flex-col shadow-sm group`}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 flex-1">
                <CircleDot size={12} className={btn.text.length === 0 || btn.text.length > 20 ? 'text-rose-400' : 'text-slate-400'} shrink-0 />
                <input
                  type="text"
                  value={btn.text}
                  onChange={(e) => updateButtonText(bIdx, e.target.value)}
                  className={`w-full text-center text-[11px] font-semibold outline-none bg-transparent ${btn.text.length === 0 || btn.text.length > 20 ? 'text-rose-500 placeholder-rose-300' : 'text-[#0ea5e9]'}`}
                  placeholder="Button Text Required"
                  maxLength={20}
                />
              </div>
              <div className="flex flex-col items-end justify-between shrink-0 pl-2 h-full py-0.5">
                <button
                  onClick={(e) => removeButton(e, bIdx)}
                  className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer p-0.5 rounded hover:bg-rose-50"
                  title="Remove Button"
                >
                  <X size={12} />
                </button>
                <span className={`text-[8px] font-medium ${btn.text.length === 0 || btn.text.length > 20 ? 'text-rose-500' : 'text-slate-400'}`}>{btn.text.length}/20</span>
              </div>
            </div>
            {btn.text.length === 0 && (
              <span className="text-[8px] font-bold text-rose-500 mt-1 pl-5 text-left">Button text is required</span>
            )}
            {btn.text.length > 0 && (
              <Handle
                type="source"
                position={Position.Right}
                id={`message_with_button-right-${propsId}-${btn.id}`}
                className="!h-2.5 !w-2.5 !border-2 !border-white !bg-[#00A884] hover:scale-125 transition-transform"
                style={{ right: -5, top: '20px', transform: 'translateY(-50%)' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Add Button Action */}
      <button
        onClick={addNewButton}
        className="w-full py-2 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
      >
        <Plus size={12} /> Add Button
      </button>

    </div>
  );
}
