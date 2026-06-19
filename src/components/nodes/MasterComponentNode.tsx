import { useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import {
  MessageSquare,
  HelpCircle,
  Globe,
  UserSquare2,
  List,
  CheckCircle2,
  AlertCircle,
  Settings,
  Trash2,
  Copy,
  ShoppingBag,
  Image as ImageIcon,
  Plus,
  CircleDot,
  ToggleRight,
  X,
  Eye
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'humanIntervention' | 'message' | 'setupWebhook' | 'listMessage' | 'questionMessage' | 'catalogue';
  data?: any;
}

interface MasterComponentData {
  isDrag?: boolean;
  id?: string;
  content?: ContentItem[];
  answers?: Record<string, string>;
  onAnswerChange?: (nodeId: string, variable: string, value: string) => void;
  onPreviewNode?: (id: string) => void;
  onSelectNode?: (id: string) => void;
  onCopyNode?: (id: string) => void;
  onDeleteNode?: (id: string) => void;
  updateNodeData?: (nodeId: string, path: (string | number)[], value: any) => void;
}

export default function MasterComponentNode(props: NodeProps) {
  const data = props.data as any as MasterComponentData;
  const contentItems = data.content || [];

  const updateNodeInternals = useUpdateNodeInternals();

  // Notify React Flow to update handles whenever dynamic content (buttons, list items) changes
  useEffect(() => {
    updateNodeInternals(props.id);
  }, [contentItems, props.id, updateNodeInternals]);

  const updateItemData = (index: number, key: string, value: any) => {
    if (data.updateNodeData) {
      data.updateNodeData(props.id, ['content', index, 'data', key], value);
    }
  };

  const updateButtonText = (itemIndex: number, btnIndex: number, newText: string, buttons: any[]) => {
    const newButtons = [...buttons];
    newButtons[btnIndex] = { ...newButtons[btnIndex], text: newText };
    updateItemData(itemIndex, 'buttons', newButtons);
  };

  const addNewButton = (itemIndex: number, buttons: any[]) => {
    const newId = Date.now();
    const newButtons = [...buttons, { text: 'New Button', id: newId, source_handle_type: 'message_with_button' }];
    updateItemData(itemIndex, 'buttons', newButtons);
  };

  return (
    <div className="relative w-[320px] rounded-[24px] border border-slate-200/60 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.12)] transition-shadow duration-300 pb-4">

      {/* Target Input Handle on Left */}
      <Handle
        type="target"
        position={Position.Left}
        id={`master-component-left-${props.id}`}
        className="!h-3 !w-3 !border-2 !border-white !bg-[#0a6c5e] hover:scale-125 transition-transform"
      />



      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-teal-50/50 px-4 py-3.5 relative border-b border-slate-100 rounded-t-[24px]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-tl-[24px]"></div>
        <div className="flex items-center gap-2 pl-1">
          {contentItems[0]?.type === 'listMessage' ? <List size={16} className="text-[#0a6c5e]" /> :
            contentItems[0]?.type === 'questionMessage' ? <HelpCircle size={16} className="text-[#0a6c5e]" /> :
              contentItems[0]?.type === 'setupWebhook' ? <Globe size={16} className="text-[#0a6c5e]" /> :
                contentItems[0]?.type === 'catalogue' ? <ShoppingBag size={16} className="text-[#0a6c5e]" /> :
                  contentItems[0]?.type === 'humanIntervention' ? <UserSquare2 size={16} className="text-[#0a6c5e]" /> :
                    <MessageSquare size={16} className="text-[#0a6c5e]" />}
          <h3 className="text-xs font-bold text-[#0a6c5e] leading-tight uppercase tracking-wider">
            {contentItems[0]?.type === 'listMessage' ? 'List Message' :
              contentItems[0]?.type === 'questionMessage' ? 'Ask a Question' :
                contentItems[0]?.type === 'setupWebhook' ? 'API Webhook' :
                  contentItems[0]?.type === 'catalogue' ? 'Catalogue' :
                    contentItems[0]?.type === 'humanIntervention' ? 'Human Handoff' : 'WhatsApp Message'}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5">
          <button onClick={(e) => { e.stopPropagation(); data.onPreviewNode?.(props.id); }}
            className="p-1 rounded text-[#0a6c5e]/60 hover:bg-[#0a6c5e]/10 hover:text-[#0a6c5e] transition cursor-pointer" title="Preview">
            <Eye size={12} className="fill-current" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); data.onSelectNode?.(props.id); }}
            className="p-1 rounded text-[#0a6c5e]/60 hover:bg-[#0a6c5e]/10 hover:text-[#0a6c5e] transition cursor-pointer" title="Edit">
            <Settings size={12} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); data.onCopyNode?.(props.id); }}
            className="p-1 rounded text-[#0a6c5e]/60 hover:bg-[#0a6c5e]/10 hover:text-[#0a6c5e] transition cursor-pointer" title="Copy">
            <Copy size={12} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); data.onDeleteNode?.(props.id); }}
            className="p-1 rounded text-[#0a6c5e]/60 hover:bg-rose-100 hover:text-rose-500 transition cursor-pointer" title="Delete">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="p-3 space-y-3 bg-slate-50/50">
        {contentItems.map((item, index) => {
          switch (item.type) {

            // 1. WhatsApp Text Message with optional Reply Buttons
            case 'message': {
              const text = item.data?.text || '';
              const buttons = item.data?.buttons || [];
              // const keyword = item.data?.keyword || '';

              return (
                <div key={item.id || index} className="space-y-2">

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
                      id={`message-right-${props.id}`}
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
                              onChange={(e) => updateButtonText(index, bIdx, e.target.value, buttons)}
                              className={`w-full text-center text-[11px] font-semibold outline-none bg-transparent ${btn.text.length === 0 || btn.text.length > 20 ? 'text-rose-500 placeholder-rose-300' : 'text-[#0ea5e9]'}`}
                              placeholder="Button Text Required"
                              maxLength={20}
                            />
                          </div>
                          <div className="flex flex-col items-end justify-between shrink-0 pl-2 h-full py-0.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newButtons = [...buttons];
                                newButtons.splice(bIdx, 1);
                                updateItemData(index, 'buttons', newButtons);
                              }}
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
                            id={`message_with_button-right-${props.id}-${btn.id}`}
                            className="!h-2.5 !w-2.5 !border-2 !border-white !bg-[#00A884] hover:scale-125 transition-transform"
                            style={{ right: -5, top: '20px', transform: 'translateY(-50%)' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Button Action */}
                  <button
                    onClick={() => addNewButton(index, buttons)}
                    className="w-full py-2 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus size={12} /> Add Button
                  </button>

                </div>
              );
            }

            // 2. Question / User Profiling Message
            case 'questionMessage': {
              const qText = item.data?.text || '';
              const attribute = item.data?.attribute || '';
              const attempts = item.data?.attributeNumberOfAttempt || '1';
              const format = item.data?.attributeFormat || 'Any';

              return (
                <div key={item.id || index} className="relative space-y-2">
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
                    id={`question-right-${props.id}`}
                    className="!h-2.5 !w-2.5 !border-2 !border-white !bg-teal-500 hover:scale-125 transition-transform"
                    style={{ right: -18, top: '35%' }}
                  />
                </div>
              );
            }

            // 3. API Webhook Configuration Card
            case 'setupWebhook': {
              const reqObj = item.data?.requestObject || {};
              const url = reqObj.url || '';
              const method = reqObj.method || 'GET';
              const params = reqObj.params || [];
              const isPassed = reqObj.isTestPass;

              const updateReqObj = (key: string, val: any) => {
                updateItemData(index, 'requestObject', { ...reqObj, [key]: val });
              };

              return (
                <div key={item.id || index} className="relative rounded-xl border border-indigo-200 bg-white p-2.5 shadow-sm space-y-2">
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
                    id={`setup-webhoook-right-${props.id}`}
                    className="!h-2.5 !w-2.5 !border-2 !border-white !bg-indigo-500 hover:scale-125 transition-transform"
                    style={{ right: -18, top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              );
            }

            // 4. WhatsApp List Message Node
            case 'listMessage': {
              const header = item.data?.header || '';
              const body = item.data?.body || '';
              const footer = item.data?.footer || '';
              const buttonTitle = item.data?.buttonTitle || 'View Options';
              const sections = item.data?.sections || [];

              const updateListSections = (newSections: any[]) => {
                updateItemData(index, 'sections', newSections);
              };

              return (
                <div key={item.id || index} className="space-y-2">
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
                              const newItemId = `list_message-right-${props.id}-${sIdx}-${Date.now()}-|None`;
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

            // 5. Human Intervention / Hand-off
            case 'humanIntervention': {
              const isReq = item.data?.isRequesting;
              return (
                <div key={item.id || index} className="rounded-xl border border-dashed border-rose-200 bg-white p-3 space-y-2 shadow-sm">
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

            // 6. WhatsApp Catalogue Node
            case 'catalogue': {
              const text = item.data?.text || '';
              const catalogues = item.data?.catalogues || [];
              return (
                <div key={item.id || index} className="space-y-2">
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
                          id={`catalogue-right-${props.id}-${i}`}
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

            default:
              return (
                <div key={index} className="rounded-xl border border-dashed border-slate-200 p-2.5 text-center text-[10px] text-slate-400">
                  Unsupported: {item.type}
                </div>
              );
          }
        })}
      </div>
    </div>
  );
}
