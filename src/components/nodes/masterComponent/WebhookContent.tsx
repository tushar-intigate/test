import { Handle, Position } from '@xyflow/react';
import { Globe, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export default function WebhookContent({
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
  const reqObj = item.data?.requestObject || {};
  const url = reqObj.url || '';
  const method = reqObj.method || 'GET';
  const params = reqObj.params || [];
  const isPassed = reqObj.isTestPass;

  const updateReqObj = (key: string, val: any) => {
    updateItemData(index, 'requestObject', { ...reqObj, [key]: val });
  };

  return (
    <div className="relative rounded-xl border border-indigo-200 bg-white p-2.5 shadow-sm space-y-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1 text-indigo-600">
          <Globe size={11} />
          <span className="text-[10px] font-bold">API Webhook</span>
        </div>
        <button
          onClick={() => updateReqObj('isTestPass', !isPassed)}
          className={`flex items-center gap-0.5 text-[8px] font-semibold px-1.5 py-0.5 rounded cursor-pointer transition ${isPassed ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-amber-600 bg-amber-50 hover:bg-amber-100'}`}
        >
          {isPassed ? <><CheckCircle2 size={9} /> Pass</> : <><AlertCircle size={9} /> Untested</>}
        </button>
      </div>

      <div className="flex items-center gap-1">
        <select
          value={method}
          onChange={(e) => updateReqObj('method', e.target.value)}
          className={`rounded px-1 py-1 text-[9px] font-bold text-white outline-none ${method === 'POST' ? 'bg-orange-500' : 'bg-blue-500'}`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => updateReqObj('url', e.target.value)}
          placeholder="https://api.example.com"
          className="flex-1 text-[10px] text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded outline-none focus:border-indigo-400"
        />
      </div>

      <div className="bg-indigo-50/30 p-1.5 rounded-lg space-y-1 border border-indigo-50">
        <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">Parameters</span>
        {params.map((p: any, i: number) => (
          <div key={i} className="flex gap-1">
            <input
              type="text"
              value={p.name}
              onChange={(e) => {
                const newParams = [...params];
                newParams[i].name = e.target.value;
                updateReqObj('params', newParams);
              }}
              className="w-1/3 text-[9px] bg-white border border-slate-200 rounded px-1 outline-none text-slate-600"
            />
            <input
              type="text"
              value={p.value}
              onChange={(e) => {
                const newParams = [...params];
                newParams[i].value = e.target.value;
                updateReqObj('params', newParams);
              }}
              className="flex-1 text-[9px] bg-white border border-slate-200 rounded px-1 outline-none text-indigo-600"
            />
          </div>
        ))}
        <button
          onClick={() => updateReqObj('params', [...params, { name: 'key', value: 'value' }])}
          className="w-full mt-1 py-1 bg-white border border-indigo-100 rounded flex items-center justify-center gap-1 text-[9px] font-medium text-indigo-500 hover:bg-indigo-50 cursor-pointer"
        >
          <Plus size={10} /> Add Param
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={`setup-webhoook-right-${propsId}`}
        className="!h-2.5 !w-2.5 !border-2 !border-white !bg-indigo-500 hover:scale-125 transition-transform"
        style={{ right: -18, top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
}
