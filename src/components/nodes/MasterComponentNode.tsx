import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  MessageSquare,
  HelpCircle,
  Globe,
  UserSquare2,
  List,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'humanIntervention' | 'message' | 'setupWebhook' | 'listMessage' | 'questionMessage';
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
}

export default function MasterComponentNode(props: NodeProps) {
  const data = props.data as any as MasterComponentData;
  const contentItems = data.content || [];
  const answers = data.answers || {};

  const handleAnswerChange = (variable: string, value: string) => {
    if (data.onAnswerChange && variable) {
      data.onAnswerChange(props.id, variable, value);
    }
  };

  return (
    <div className="relative w-[300px] rounded-2xl border border-slate-200/80 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">

      {/* Target Input Handle on Left */}
      <Handle
        type="target"
        position={Position.Left}
        id={`master-component-left-${props.id}`}
        className="!h-3 !w-3 !border-2 !border-white !bg-[#075E54] hover:scale-125 transition-transform"
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-[#075E54] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
            <MessageSquare size={14} className="text-emerald-300" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-white leading-tight">Interactive Block</h3>
            <p className="text-[9px] text-emerald-200/70">ID: {props.id}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5">
          <button onClick={(e) => { e.stopPropagation(); data.onPreviewNode?.(props.id); }}
            className="p-1 rounded text-white/60 hover:bg-white/15 hover:text-white transition cursor-pointer" title="Preview">
            <Play size={10} className="fill-current" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); data.onSelectNode?.(props.id); }}
            className="p-1 rounded text-white/60 hover:bg-white/15 hover:text-white transition cursor-pointer" title="Edit">
            <Settings size={10} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); data.onCopyNode?.(props.id); }}
            className="p-1 rounded text-white/60 hover:bg-white/15 hover:text-white transition cursor-pointer" title="Copy">
            <Copy size={10} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); data.onDeleteNode?.(props.id); }}
            className="p-1 rounded text-white/60 hover:bg-rose-400/30 hover:text-rose-200 transition cursor-pointer" title="Delete">
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto bg-slate-50/50">
        {contentItems.map((item, index) => {
          switch (item.type) {

            // 1. WhatsApp Text Message with optional Reply Buttons
            case 'message': {
              const text = item.data?.text || '';
              const buttons = item.data?.buttons || [];
              return (
                <div key={item.id || index} className="space-y-1.5">
                  {/* Text Message Bubble */}
                  <div className="rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-100">
                    <p className="text-[10px] text-slate-700 whitespace-pre-wrap leading-relaxed">{text}</p>
                    <div className="mt-1 text-right text-[8px] text-slate-300">10:32 AM</div>
                  </div>

                  {/* Reply Buttons */}
                  {buttons.length > 0 && (
                    <div className="rounded-xl border border-slate-100 bg-white overflow-hidden divide-y divide-slate-50">
                      {buttons.map((btn: any) => (
                        <div
                          key={btn.id}
                          className="relative flex items-center justify-center py-2 text-[10px] font-semibold text-[#00A884] hover:bg-slate-50/50 transition cursor-pointer"
                        >
                          <span>{btn.text}</span>
                          <Handle
                            type="source"
                            position={Position.Right}
                            id={`message_with_button-right-${props.id}-${btn.id}`}
                            className="!h-3 !w-3 !border-2 !border-white !bg-[#00A884] hover:scale-125 transition-transform"
                            style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
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
                <div key={item.id || index} className="relative space-y-1.5">
                  {/* Bot Question */}
                  <div className="rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-1 mb-1 text-[8px] font-bold text-[#075E54] uppercase tracking-wider">
                      <HelpCircle size={9} />
                      <span>{attribute}</span>
                    </div>
                    <p className="text-[10px] text-slate-700 leading-relaxed">{qText}</p>
                  </div>

                  {/* Answer Input */}
                  <div className="flex justify-end">
                    <input
                      type="text"
                      placeholder={`Enter ${attribute}...`}
                      value={answers[attribute] || ''}
                      onChange={(e) => handleAnswerChange(attribute, e.target.value)}
                      className="w-[200px] rounded-xl border border-emerald-200/60 bg-emerald-50/50 px-3 py-1.5 text-[10px] text-slate-700 outline-none focus:border-emerald-400 shadow-sm"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex justify-between px-1 text-[8px] text-slate-400">
                    <span>Format: <b>{format}</b></span>
                    <span>Attempts: <b>{attempts}</b></span>
                  </div>

                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`question-right-${props.id}`}
                    className="!h-3 !w-3 !border-2 !border-white !bg-teal-500 hover:scale-125 transition-transform"
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

              return (
                <div key={item.id || index} className="relative rounded-xl border border-indigo-100 bg-white p-2.5 shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-indigo-600">
                      <Globe size={11} />
                      <span className="text-[9px] font-bold">API Webhook</span>
                    </div>
                    {isPassed ? (
                      <span className="flex items-center gap-0.5 text-[8px] font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
                        <CheckCircle2 size={8} /> Pass
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[8px] font-semibold text-amber-600 bg-amber-50 px-1 py-0.5 rounded">
                        <AlertCircle size={8} /> Untested
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className={`rounded px-1 py-0.5 text-[8px] font-bold text-white ${method === 'POST' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                      {method}
                    </span>
                    <code className="text-[9px] text-slate-500 truncate max-w-[180px] bg-slate-50 px-1 py-0.5 rounded" title={url}>
                      {url || 'https://...'}
                    </code>
                  </div>

                  {params.length > 0 && (
                    <div className="bg-indigo-50/40 p-1.5 rounded-lg text-[8px] space-y-0.5">
                      {params.map((p: any, i: number) => (
                        <div key={i} className="flex justify-between text-slate-500">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-indigo-500">{p.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`setup-webhoook-right-${props.id}`}
                    className="!h-3 !w-3 !border-2 !border-white !bg-indigo-500 hover:scale-125 transition-transform"
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

              return (
                <div key={item.id || index} className="space-y-1.5">
                  {/* List Message Bubble */}
                  <div className="rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-100 space-y-1">
                    {header && <p className="text-[9px] font-bold text-slate-600 border-b border-slate-50 pb-1">{header}</p>}
                    <p className="text-[10px] text-slate-700 leading-relaxed">{body}</p>
                    {footer && <p className="text-[8px] text-slate-400 italic">{footer}</p>}
                  </div>

                  {/* List Selector */}
                  <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between bg-slate-50 px-2.5 py-2 border-b border-slate-100">
                      <div className="flex items-center gap-1 text-[#075E54]">
                        <List size={10} />
                        <span className="text-[9px] font-bold uppercase">{buttonTitle}</span>
                      </div>
                      <ArrowRight size={9} className="text-slate-400" />
                    </div>

                    {sections.map((section: any, sIdx: number) => (
                      <div key={section.id || sIdx} className="p-1.5 space-y-1">
                        {section.title && (
                          <div className="px-1 text-[7px] font-bold text-slate-400 uppercase tracking-wider">
                            {section.title}
                          </div>
                        )}
                        <div className="space-y-1">
                          {(section.items || []).map((row: any) => (
                            <div
                              key={row.id}
                              className="relative flex items-center justify-between rounded-lg border border-slate-50 bg-slate-50/30 p-1.5 hover:bg-emerald-50/30 hover:border-emerald-100 transition cursor-pointer"
                            >
                              <div>
                                <h4 className="text-[10px] font-bold text-slate-700">{row.title}</h4>
                                {row.description && <p className="text-[8px] text-slate-400 line-clamp-1">{row.description}</p>}
                              </div>
                              <Handle
                                type="source"
                                position={Position.Right}
                                id={row.id}
                                className="!h-3 !w-3 !border-2 !border-white !bg-[#075E54] hover:scale-125 transition-transform"
                                style={{ right: -12, top: '50%', transform: 'translateY(-50%)' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // 5. Human Intervention / Hand-off
            case 'humanIntervention': {
              const isReq = item.data?.isRequesting;
              return (
                <div key={item.id || index} className="rounded-xl border border-dashed border-rose-200 bg-rose-50/50 p-2.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-600">
                    <UserSquare2 size={13} />
                    <span className="text-[10px] font-bold">Human Agent Handoff</span>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-relaxed">
                    Transfers conversation to human support agents.
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isReq ? 'bg-rose-400' : 'bg-slate-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isReq ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
                    </span>
                    <span className="text-[8px] font-bold uppercase text-slate-400">
                      {isReq ? 'Awaiting Agent' : 'Inactive'}
                    </span>
                  </div>
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
