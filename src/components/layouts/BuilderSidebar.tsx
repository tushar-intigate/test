import { Zap, MessageSquare, HelpCircle, List, Globe, UserSquare2, ShoppingBag } from 'lucide-react';

export default function BuilderSidebar() {
  const onDragStart = (event: React.DragEvent, type: string, subType?: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type, subType }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const DraggableItem = ({ icon: Icon, label, type, subType, colorClass }: any) => (
    <div 
      className={`flex flex-col items-center justify-center gap-1.5 w-16 h-16 bg-slate-50 border border-transparent rounded-2xl transition cursor-grab hover:scale-105 active:cursor-grabbing hover:bg-white hover:shadow-md ${colorClass} group`}
      draggable
      onDragStart={(e) => onDragStart(e, type, subType)}
      title={`Drag to add ${label}`}
    >
      <Icon size={20} className="text-slate-500 transition-colors opacity-70 group-hover:opacity-100" />
      <span className="text-[9px] font-bold text-slate-500 leading-tight text-center px-1 transition-colors group-hover:opacity-100">{label}</span>
    </div>
  );

  return (
    <div className='h-full w-20 bg-slate-50/50 border-r border-slate-200 z-40 flex flex-col items-center py-4 gap-3 shrink-0 overflow-y-auto no-scrollbar shadow-[inset_-1px_0_10px_rgba(0,0,0,0.02)]'>
      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Nodes</div>

      <DraggableItem icon={Zap} label="Trigger" type="keywordBox" colorClass="hover:border-teal-300 [&>svg]:group-hover:text-teal-600 [&>span]:group-hover:text-teal-700" />
      
      <div className="w-10 h-px bg-slate-200/60 my-1"></div>

      <DraggableItem icon={MessageSquare} label="Message" type="masterComponent" subType="message" colorClass="hover:border-indigo-300 [&>svg]:group-hover:text-indigo-600 [&>span]:group-hover:text-indigo-700" />
      <DraggableItem icon={HelpCircle} label="Question" type="masterComponent" subType="questionMessage" colorClass="hover:border-blue-300 [&>svg]:group-hover:text-blue-600 [&>span]:group-hover:text-blue-700" />
      <DraggableItem icon={List} label="List" type="masterComponent" subType="listMessage" colorClass="hover:border-orange-300 [&>svg]:group-hover:text-orange-600 [&>span]:group-hover:text-orange-700" />
      <DraggableItem icon={Globe} label="Webhook" type="masterComponent" subType="setupWebhook" colorClass="hover:border-violet-300 [&>svg]:group-hover:text-violet-600 [&>span]:group-hover:text-violet-700" />
      <DraggableItem icon={UserSquare2} label="Handoff" type="masterComponent" subType="humanIntervention" colorClass="hover:border-rose-300 [&>svg]:group-hover:text-rose-600 [&>span]:group-hover:text-rose-700" />
      <DraggableItem icon={ShoppingBag} label="Catalog" type="masterComponent" subType="catalogue" colorClass="hover:border-emerald-300 [&>svg]:group-hover:text-emerald-600 [&>span]:group-hover:text-emerald-700" />
    </div>
  );
}

