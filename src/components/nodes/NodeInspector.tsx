import { Plus, Trash2, MessageSquare, Play } from 'lucide-react';

interface NodeInspectorProps {
  selectedNode: any;
  updateNodeData: (nodeId: string, path: (string | number)[], value: any) => void;
}

export default function NodeInspector({ selectedNode, updateNodeData }: NodeInspectorProps) {
  if (!selectedNode) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <MessageSquare size={48} className="text-slate-300 mb-3" />
        <h4 className="text-sm font-semibold text-slate-700">No Node Selected</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
          Click on any node on the canvas to configure and edit its properties.
        </p>
      </div>
    );
  }

  const { id, type, data } = selectedNode;

  // Render Keyword Box configuration
  if (type === 'keywordBox') {
    const keywords = data.keywords || [];
    const text = data.text || '';
    const label = data.label || '';
    const regexCaseSensitive = !!data.regexCaseSensitive;

    const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.value.split(',').map((kw) => kw.trim()).filter((kw) => kw.length > 0);
      updateNodeData(id, ['keywords'], list);
    };

    return (
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2">
            <Play size={16} className="text-teal-600" />
            Trigger Box Configuration
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">Configure keywords that launch this flow.</p>
        </div>

        {/* Title/Label */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 block">Node Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => updateNodeData(id, ['label'], e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-700 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Text Area */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 block">Trigger Instruction Text</label>
          <textarea
            value={text}
            rows={3}
            onChange={(e) => updateNodeData(id, ['text'], e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-700 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none resize-none transition-all shadow-sm"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 block flex justify-between">
            <span>Keywords (comma-separated)</span>
            <span className="text-[9px] text-teal-600">{keywords.length} active</span>
          </label>
          <input
            type="text"
            value={keywords.join(', ')}
            onChange={handleKeywordsChange}
            placeholder="e.g. hello, hi, start, join"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-700 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Case Sensitivity */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="case-sensitive"
            checked={regexCaseSensitive}
            onChange={(e) => updateNodeData(id, ['regexCaseSensitive'], e.target.checked)}
            className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
          />
          <label htmlFor="case-sensitive" className="text-[11px] font-medium text-slate-700 cursor-pointer">
            Case-sensitive matching
          </label>
        </div>
      </div>
    );
  }

  // Render Master Component configurations
  if (type === 'masterComponent') {
    const contentItems = data.content || [];

    return (
      <div className="p-4 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2">
            <MessageSquare size={16} className="text-[#075E54]" />
            Block Configuration
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">Edit the contents that execute inside this block.</p>
        </div>

        {contentItems.map((item: any, idx: number) => {
          const basePath = ['content', idx];

          return (
            <div key={item.id || idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Item #{idx + 1}: {item.type}
                </span>
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[8px] font-semibold text-slate-500">
                  {item.id ? `ID: ${item.id.split('-').pop()}` : ''}
                </span>
              </div>

              {/* MESSAGE EDIT */}
              {item.type === 'message' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Text Message</label>
                    <textarea
                      value={item.data?.text || ''}
                      rows={3}
                      onChange={(e) => updateNodeData(id, [...basePath, 'data', 'text'], e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none resize-none transition-all shadow-sm"
                    />
                  </div>

                  {/* Reply Buttons */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-500 flex justify-between items-center">
                      <span>Reply Buttons</span>
                      <button
                        onClick={() => {
                          const btns = item.data?.buttons || [];
                          const nextId = btns.length > 0 ? Math.max(...btns.map((b: any) => b.id)) + 1 : 1;
                          const newBtn = { text: `Button ${nextId}`, id: nextId, source_handle_type: 'message_with_button' };
                          updateNodeData(id, [...basePath, 'data', 'buttons'], [...btns, newBtn]);
                        }}
                        className="flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-[#00A884] border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                      >
                        <Plus size={10} /> Add Button
                      </button>
                    </label>

                    <div className="space-y-1.5">
                      {(item.data?.buttons || []).map((btn: any, bIdx: number) => (
                        <div key={btn.id} className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
                          <input
                            type="text"
                            value={btn.text}
                            onChange={(e) => {
                              const btns = [...item.data.buttons];
                              btns[bIdx] = { ...btns[bIdx], text: e.target.value };
                              updateNodeData(id, [...basePath, 'data', 'buttons'], btns);
                            }}
                            className="flex-1 bg-transparent px-1 py-0.5 text-xs outline-none border-b border-transparent focus:border-violet-500"
                          />
                          <button
                            onClick={() => {
                              const btns = item.data.buttons.filter((b: any) => b.id !== btn.id);
                              updateNodeData(id, [...basePath, 'data', 'buttons'], btns);
                            }}
                            className="text-rose-500 hover:bg-rose-50 p-1 rounded transition cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* QUESTION EDIT */}
              {item.type === 'questionMessage' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Question Text</label>
                    <textarea
                      value={item.data?.text || ''}
                      rows={3}
                      onChange={(e) => updateNodeData(id, [...basePath, 'data', 'text'], e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none resize-none transition-all shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Save Variable As</label>
                      <input
                        type="text"
                        value={item.data?.attribute || ''}
                        onChange={(e) => updateNodeData(id, [...basePath, 'data', 'attribute'], e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Validation Format</label>
                      <select
                        value={item.data?.attributeFormat || 'Any'}
                        onChange={(e) => updateNodeData(id, [...basePath, 'data', 'attributeFormat'], e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
                      >
                        <option value="Any">Any Input</option>
                        <option value="Email">Email Address</option>
                        <option value="Number">Number Only</option>
                        <option value="Phone">Phone Format</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Max Attempts</label>
                    <input
                      type="number"
                      value={item.data?.attributeNumberOfAttempt || '1'}
                      onChange={(e) => updateNodeData(id, [...basePath, 'data', 'attributeNumberOfAttempt'], e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* WEBHOOK EDIT */}
              {item.type === 'setupWebhook' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Method</label>
                      <select
                        value={item.data?.requestObject?.method || 'GET'}
                        onChange={(e) => updateNodeData(id, [...basePath, 'data', 'requestObject', 'method'], e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Webhook URL</label>
                      <input
                        type="text"
                        value={item.data?.requestObject?.url || ''}
                        onChange={(e) => updateNodeData(id, [...basePath, 'data', 'requestObject', 'url'], e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Webhook Parameters List */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-500 flex justify-between items-center">
                      <span>Query Parameters</span>
                      <button
                        onClick={() => {
                          const params = item.data?.requestObject?.params || [];
                          const newParam = { name: 'param_name', value: '$value' };
                          updateNodeData(id, [...basePath, 'data', 'requestObject', 'params'], [...params, newParam]);
                        }}
                        className="flex items-center gap-1 rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 border border-indigo-200 hover:bg-indigo-100 cursor-pointer"
                      >
                        <Plus size={10} /> Add Param
                      </button>
                    </label>

                    <div className="space-y-1.5">
                      {(item.data?.requestObject?.params || []).map((p: any, pIdx: number) => (
                        <div key={pIdx} className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm text-xs">
                          <input
                            type="text"
                            value={p.name}
                            placeholder="Name"
                            onChange={(e) => {
                              const params = [...item.data.requestObject.params];
                              params[pIdx] = { ...params[pIdx], name: e.target.value };
                              updateNodeData(id, [...basePath, 'data', 'requestObject', 'params'], params);
                            }}
                            className="w-1/2 bg-transparent px-1 text-[11px] outline-none border-b border-transparent focus:border-violet-500"
                          />
                          <span className="text-slate-300">:</span>
                          <input
                            type="text"
                            value={p.value}
                            placeholder="Value"
                            onChange={(e) => {
                              const params = [...item.data.requestObject.params];
                              params[pIdx] = { ...params[pIdx], value: e.target.value };
                              updateNodeData(id, [...basePath, 'data', 'requestObject', 'params'], params);
                            }}
                            className="w-1/2 bg-transparent px-1 text-[11px] outline-none border-b border-transparent focus:border-violet-500"
                          />
                          <button
                            onClick={() => {
                              const params = item.data.requestObject.params.filter((_: any, idx: number) => idx !== pIdx);
                              updateNodeData(id, [...basePath, 'data', 'requestObject', 'params'], params);
                            }}
                            className="text-rose-500 hover:bg-rose-50 p-1 rounded transition cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LIST MESSAGE EDIT */}
              {item.type === 'listMessage' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Header Title</label>
                      <input
                        type="text"
                        value={item.data?.header || ''}
                        onChange={(e) => updateNodeData(id, [...basePath, 'data', 'header'], e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Button Label</label>
                      <input
                        type="text"
                        value={item.data?.buttonTitle || ''}
                        onChange={(e) => updateNodeData(id, [...basePath, 'data', 'buttonTitle'], e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Body Text</label>
                    <textarea
                      value={item.data?.body || ''}
                      rows={2}
                      onChange={(e) => updateNodeData(id, [...basePath, 'data', 'body'], e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none resize-none transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Footer Text</label>
                    <input
                      type="text"
                      value={item.data?.footer || ''}
                      onChange={(e) => updateNodeData(id, [...basePath, 'data', 'footer'], e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
                    />
                  </div>

                  {/* List Selector Items Edit */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-500 block">List Selector Options</label>

                    {/* Maps over sections */}
                    {(item.data?.sections || []).map((section: any, sIdx: number) => (
                      <div key={section.id || sIdx} className="space-y-2 bg-white p-2 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                              const sections = [...item.data.sections];
                              sections[sIdx] = { ...sections[sIdx], title: e.target.value };
                              updateNodeData(id, [...basePath, 'data', 'sections'], sections);
                            }}
                            className="bg-transparent text-[10px] font-bold text-slate-400 uppercase outline-none focus:border-b focus:border-violet-500"
                          />
                          <button
                            onClick={() => {
                              const items = section.items || [];
                              const nextId = items.length + 1;
                              const itemId = `list_message-right-${id}-${sIdx}-${Date.now()}-|None-|6a312671e5b8680f107773f0`;
                              const newItem = {
                                title: `Option ${nextId}`,
                                description: `Description ${nextId}`,
                                id: itemId,
                                source_handle_type: itemId
                              };
                              const sections = [...item.data.sections];
                              sections[sIdx] = { ...sections[sIdx], items: [...items, newItem] };
                              updateNodeData(id, [...basePath, 'data', 'sections'], sections);
                            }}
                            className="flex items-center gap-0.5 rounded bg-emerald-50 px-1 py-0.5 text-[8px] font-bold text-[#00A884] border border-emerald-100 cursor-pointer"
                          >
                            <Plus size={8} /> Add Option
                          </button>
                        </div>

                        {/* Maps over items inside section */}
                        <div className="space-y-1.5">
                          {(section.items || []).map((row: any, rIdx: number) => (
                            <div key={row.id} className="flex gap-1 bg-slate-50 p-1.5 rounded border border-slate-150 relative">
                              <div className="flex-1 space-y-1">
                                <input
                                  type="text"
                                  value={row.title}
                                  placeholder="Option Title"
                                  onChange={(e) => {
                                    const sections = [...item.data.sections];
                                    sections[sIdx].items[rIdx] = { ...row, title: e.target.value };
                                    updateNodeData(id, [...basePath, 'data', 'sections'], sections);
                                  }}
                                  className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-800 outline-none"
                                />
                                <input
                                  type="text"
                                  value={row.description}
                                  placeholder="Option Description"
                                  onChange={(e) => {
                                    const sections = [...item.data.sections];
                                    sections[sIdx].items[rIdx] = { ...row, description: e.target.value };
                                    updateNodeData(id, [...basePath, 'data', 'sections'], sections);
                                  }}
                                  className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[9px] text-slate-500 outline-none"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const sections = [...item.data.sections];
                                  sections[sIdx].items = sections[sIdx].items.filter((r: any) => r.id !== row.id);
                                  updateNodeData(id, [...basePath, 'data', 'sections'], sections);
                                }}
                                className="text-rose-500 hover:bg-rose-50 p-1 rounded transition flex items-center justify-center cursor-pointer self-center"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HUMAN INTERVENTION EDIT */}
              {item.type === 'humanIntervention' && (
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id={`requesting-${idx}`}
                    checked={!!item.data?.isRequesting}
                    onChange={(e) => updateNodeData(id, [...basePath, 'data', 'isRequesting'], e.target.checked)}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
                  />
                  <label htmlFor={`requesting-${idx}`} className="text-[11px] font-medium text-slate-700 cursor-pointer">
                    Flag active handoff queue request
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback for default nodes
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2">
          ⚙️ Node Editor
        </h3>
        <p className="text-[10px] text-slate-400 mt-1">Configure properties of default demo nodes.</p>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-600 block">Title / Label</label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => updateNodeData(id, ['label'], e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-700 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm"
        />
      </div>

      {data.question !== undefined && (
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 block">Question Text</label>
          <textarea
            value={data.question || ''}
            rows={3}
            onChange={(e) => updateNodeData(id, ['question'], e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-700 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none resize-none transition-all shadow-sm"
          />
        </div>
      )}
    </div>
  );
}
