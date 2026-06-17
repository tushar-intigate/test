import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  MessageSquare, 
  HelpCircle, 
  Globe, 
  UserSquare2, 
  List, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
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
    <div className="relative w-[400px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
      
      {/* Target Input Handle on Left */}
      <Handle
        type="target"
        position={Position.Left}
        id={`master-component-left-${props.id}`}
        className="!h-3.5 !w-3.5 !border-2 !border-white !bg-[#075E54] hover:scale-125 transition-transform"
      />

      {/* Header */}
      <div className="bg-[#075E54] px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <MessageSquare size={16} className="text-emerald-300" />
            </div>
            <div>
              <h3 className="text-xs font-semibold">Message & Interactive Block</h3>
              <p className="text-[10px] text-emerald-200/80">ID: {props.id}</p>
            </div>
          </div>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-100 border border-emerald-500/30">
            Active
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-[#ECE5DD] p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {contentItems.map((item, index) => {
          switch (item.type) {
            
            // 1. WhatsApp Text Message with optional Reply Buttons
            case 'message': {
              const text = item.data?.text || '';
              const buttons = item.data?.buttons || [];
              return (
                <div key={item.id || index} className="space-y-2">
                  {/* Text Message Bubble */}
                  <div className="flex justify-start">
                    <div className="relative max-w-[85%] rounded-2xl rounded-tl-none bg-white px-3.5 py-2.5 shadow-sm border border-slate-100">
                      {/* Tail */}
                      <div className="absolute left-[-6px] top-0 h-3 w-3 bg-white" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
                      <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">{text}</p>
                      <div className="mt-1 text-right text-[9px] text-slate-400">10:32 AM</div>
                    </div>
                  </div>

                  {/* WhatsApp Reply Buttons */}
                  {buttons.length > 0 && (
                    <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
                      {buttons.map((btn: any) => (
                        <div 
                          key={btn.id} 
                          className="relative flex items-center justify-center py-2.5 text-xs font-semibold text-[#00A884] hover:bg-slate-50 transition cursor-pointer"
                        >
                          <span>{btn.text}</span>
                          
                          {/* Dedicated Handle on the right side of each button */}
                          <Handle
                            type="source"
                            position={Position.Right}
                            id={`message_with_button-right-${props.id}-${btn.id}`}
                            className="!h-3.5 !w-3.5 !border-2 !border-white !bg-[#00A884] hover:scale-125 transition-transform"
                            style={{ right: -7, top: '50%', transform: 'translateY(-50%)' }}
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
                <div key={item.id || index} className="relative space-y-2">
                  {/* Bot Question Bubble */}
                  <div className="flex justify-start">
                    <div className="relative max-w-[85%] rounded-2xl rounded-tl-none bg-white px-3.5 py-2.5 shadow-sm border border-slate-100">
                      <div className="absolute left-[-6px] top-0 h-3 w-3 bg-white" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
                      <div className="flex items-center gap-1 mb-1 text-[9px] font-semibold text-[#075E54]">
                        <HelpCircle size={10} />
                        <span>Question Attribute: {attribute}</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">{qText}</p>
                    </div>
                  </div>

                  {/* Interactive Input for Flow Testing */}
                  <div className="flex justify-end">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={`Enter ${attribute}...`}
                        value={answers[attribute] || ''}
                        onChange={(e) => handleAnswerChange(attribute, e.target.value)}
                        className="w-[240px] rounded-2xl rounded-tr-none border border-emerald-200 bg-[#DCF8C6] px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-emerald-500 shadow-sm"
                      />
                      {/* Tail for response */}
                      <div className="absolute right-[-6px] top-0 h-3 w-3 bg-[#DCF8C6]" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}></div>
                    </div>
                  </div>

                  {/* Metadata display */}
                  <div className="flex justify-between items-center px-1 text-[9px] text-slate-500">
                    <span>Validation: <b>{format}</b></span>
                    <span>Max Attempts: <b>{attempts}</b></span>
                  </div>

                  {/* Handle representing the question completion next-step */}
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`question-right-${props.id}`}
                    className="!h-3.5 !w-3.5 !border-2 !border-white !bg-teal-600 hover:scale-125 transition-transform"
                    style={{ right: -21, top: '35%' }}
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
                <div key={item.id || index} className="relative rounded-2xl border border-indigo-100 bg-white p-3 shadow-sm space-y-2">
                  <div className="flex items-center justify-between border-b border-indigo-50 pb-2">
                    <div className="flex items-center gap-1.5 text-indigo-700">
                      <Globe size={13} />
                      <span className="text-[11px] font-bold">API Webhook Integration</span>
                    </div>
                    {isPassed ? (
                      <span className="flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 size={10} /> Test Pass
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[9px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        <AlertCircle size={10} /> Not Tested
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold text-white uppercase ${method === 'POST' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                        {method}
                      </span>
                      <code className="text-slate-600 truncate max-w-[240px] bg-slate-50 px-1 py-0.5 rounded border border-slate-100" title={url}>
                        {url || 'https://api.endpoint.com'}
                      </code>
                    </div>

                    {params.length > 0 && (
                      <div className="mt-1 bg-indigo-50/50 p-1.5 rounded-lg border border-indigo-100/30">
                        <p className="text-[9px] font-semibold text-indigo-800 mb-1">Request Parameters:</p>
                        <div className="grid grid-cols-2 gap-1 text-[8px] text-slate-500">
                          {params.map((p: any, i: number) => (
                            <div key={i} className="flex justify-between border-b border-indigo-100/20 py-0.5">
                              <span className="font-medium text-slate-600">{p.name}:</span>
                              <span className="text-indigo-600">{p.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Handle representing the webhook completion flow redirect */}
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`setup-webhoook-right-${props.id}`}
                    className="!h-3.5 !w-3.5 !border-2 !border-white !bg-indigo-600 hover:scale-125 transition-transform"
                    style={{ right: -20, top: '50%', transform: 'translateY(-50%)' }}
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
                <div key={item.id || index} className="space-y-2">
                  {/* List Message Bubble */}
                  <div className="flex justify-start">
                    <div className="relative max-w-[85%] rounded-2xl rounded-tl-none bg-white p-3 shadow-sm border border-slate-100 space-y-1">
                      <div className="absolute left-[-6px] top-0 h-3 w-3 bg-white" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
                      
                      {header && <p className="text-[10px] font-bold text-slate-700 border-b border-slate-100 pb-1">{header}</p>}
                      <p className="text-xs text-slate-800 leading-relaxed">{body}</p>
                      {footer && <p className="text-[9px] text-slate-400 italic pt-1">{footer}</p>}
                    </div>
                  </div>

                  {/* List Selector Box */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {/* Header trigger button */}
                    <div className="flex items-center justify-between bg-slate-50 px-3 py-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-[#075E54]">
                        <List size={12} />
                        <span className="text-[10px] font-bold uppercase">{buttonTitle}</span>
                      </div>
                      <ArrowRight size={10} className="text-slate-400" />
                    </div>

                    {/* Renders each selection list item */}
                    {sections.map((section: any, sIdx: number) => (
                      <div key={section.id || sIdx} className="p-2 space-y-1 bg-white">
                        {section.title && (
                          <div className="px-1 py-0.5 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                            {section.title}
                          </div>
                        )}
                        <div className="space-y-1.5">
                          {(section.items || []).map((row: any) => (
                            <div 
                              key={row.id} 
                              className="relative flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2 hover:bg-emerald-50/20 hover:border-emerald-200 transition cursor-pointer"
                            >
                              <div>
                                <h4 className="text-[11px] font-bold text-slate-800">{row.title}</h4>
                                {row.description && <p className="text-[9px] text-slate-400 line-clamp-1">{row.description}</p>}
                              </div>
                              
                              {/* Dedicated handle directly mapped to item's unique id */}
                              <Handle
                                type="source"
                                position={Position.Right}
                                id={row.id}
                                className="!h-3.5 !w-3.5 !border-2 !border-white !bg-[#075E54] hover:scale-125 transition-transform"
                                style={{ right: -15, top: '50%', transform: 'translateY(-50%)' }}
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
                <div key={item.id || index} className="rounded-2xl border border-rose-100 bg-rose-50/80 p-3 shadow-sm space-y-2 border-dashed">
                  <div className="flex items-center gap-2 text-rose-700">
                    <UserSquare2 size={16} />
                    <span className="text-xs font-bold">Human Agent Handoff</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    Stops chatbot automation and queues the conversation for human customer service agents.
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className={`relative flex h-2 w-2`}>
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isReq ? 'bg-rose-400' : 'bg-slate-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isReq ? 'bg-rose-500' : 'bg-slate-500'}`}></span>
                    </span>
                    <span className="text-[9px] font-bold uppercase text-slate-500">
                      {isReq ? 'Awaiting HR Agent Response' : 'Inactive'}
                    </span>
                  </div>
                </div>
              );
            }

            default:
              return (
                <div key={index} className="rounded-2xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-400 bg-white">
                  Unsupported block type: {item.type}
                </div>
              );
          }
        })}
      </div>
    </div>
  );
}
