import { useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import {
  MessageSquare,
  HelpCircle,
  Globe,
  UserSquare2,
  List,
  Settings,
  Trash2,
  Copy,
  ShoppingBag,
  Eye
} from 'lucide-react';

import MessageContent from './masterComponent/MessageContent';
import QuestionContent from './masterComponent/QuestionContent';
import ListContent from './masterComponent/ListContent';
import WebhookContent from './masterComponent/WebhookContent';
import HandoffContent from './masterComponent/HandoffContent';
import CatalogueContent from './masterComponent/CatalogueContent';

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
            case 'message':
              return <MessageContent key={item.id || index} item={item} index={index} propsId={props.id} updateItemData={updateItemData} />;
            case 'questionMessage':
              return <QuestionContent key={item.id || index} item={item} index={index} propsId={props.id} updateItemData={updateItemData} />;
            case 'listMessage':
              return <ListContent key={item.id || index} item={item} index={index} propsId={props.id} updateItemData={updateItemData} />;
            case 'setupWebhook':
              return <WebhookContent key={item.id || index} item={item} index={index} propsId={props.id} updateItemData={updateItemData} />;
            case 'humanIntervention':
              return <HandoffContent key={item.id || index} item={item} index={index} updateItemData={updateItemData} />;
            case 'catalogue':
              return <CatalogueContent key={item.id || index} item={item} index={index} propsId={props.id} updateItemData={updateItemData} />;
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
