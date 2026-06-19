import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, Briefcase, HeadphonesIcon, Plus, Activity, Calendar, MoreVertical, Edit2, Trash2, Copy, MessageCircle } from 'lucide-react';

import { flowData } from '../store/flowStore';

const fetchedFlows = flowData.fetchedFlow || [];

const initialUiFlows = fetchedFlows.map((f: any, index: number) => {
    const icons = [Briefcase, HeadphonesIcon, MessageSquare];
    const colors = ['from-violet-500 to-fuchsia-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500'];
    const bgLights = ['bg-violet-50', 'bg-blue-50', 'bg-emerald-50'];
    const iconColors = ['text-violet-600', 'text-blue-600', 'text-emerald-600'];

    return {
        id: f._id,
        title: f.flowName || 'Unnamed Flow',
        description: 'Automated workflow powered by Intigate AI engine.',
        icon: icons[index % icons.length],
        color: colors[index % colors.length],
        bgLight: bgLights[index % bgLights.length],
        iconColor: iconColors[index % iconColors.length],
        status: f.status ? 'Active' : 'Draft',
        updatedAt: 'Just now',
        messages: f.flowMessages?.length || 0
    };
});

export default function FlowList() {
    const navigate = useNavigate();
    const [flows, setFlows] = useState(initialUiFlows);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLTableSectionElement | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this flow?")) {
            setFlows(flows.filter((f: any) => f.id !== id));
        }
        setOpenMenuId(null);
    };

    const handleDuplicate = (e: React.MouseEvent, flow: any) => {
        e.stopPropagation();
        const newFlow = { ...flow, id: `dup-${Date.now()}`, title: `${flow.title} (Copy)` };
        setFlows([...flows, newFlow]);
        setOpenMenuId(null);
    };

    const handleEdit = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        navigate(`/builder/${id}`);
    };

    const toggleMenu = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-violet-800">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="w-full px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200">
                            <Bot size={26} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 leading-tight">Intigate Dashboard</h1>
                            <p className="text-sm text-slate-500 font-medium">Manage your automated workflows</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/builder/new')}
                        className="flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-violet-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                    >
                        <Plus size={18} />
                        Create New Flow
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full">
                <div className="mb-6 px-6 pt-6 flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Your Workflows</h2>
                        <p className="text-slate-500">Select an existing WhatsApp flow to edit or monitor.</p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
                            <Activity size={18} className="text-emerald-500" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Total Runs (24h)</p>
                                <p className="text-sm font-bold text-slate-700">12,450</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                                    <th className="px-6 py-5">Flow Name</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Nodes</th>
                                    <th className="px-6 py-5">Last Updated</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100" ref={menuRef}>
                                {flows.map((flow: any) => (
                                    <tr
                                        key={flow.id}
                                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                        onClick={() => navigate(`/builder/${flow.id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-11 w-11 rounded-xl ${flow.bgLight} flex items-center justify-center ${flow.iconColor} shrink-0`}>
                                                    <flow.icon size={20} strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-violet-700 transition-colors">{flow.title}</h3>
                                                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{flow.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${flow.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                <div className={`h-1.5 w-1.5 rounded-full ${flow.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                                {flow.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <MessageCircle size={14} />
                                                <span className="text-xs font-semibold">{flow.messages} Nodes</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <Calendar size={14} />
                                                <span className="text-xs font-medium">{flow.updatedAt}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => handleEdit(e, flow.id)}
                                                    className="text-slate-400 hover:text-violet-600 transition-colors p-2 hover:bg-violet-50 rounded-lg"
                                                    title="Edit Flow"
                                                >
                                                    <Edit2 size={16} />
                                                </button>

                                                <div className="relative">
                                                    <button
                                                        className={`transition-colors p-2 rounded-lg ${openMenuId === flow.id ? 'text-slate-800 bg-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                                        onClick={(e) => toggleMenu(e, flow.id)}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {/* Action Dropdown Menu */}
                                                    {openMenuId === flow.id && (
                                                        <div className="absolute right-0 top-10 w-40 bg-white border border-slate-200 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                                                            <button
                                                                onClick={(e) => handleDuplicate(e, flow)}
                                                                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                                                            >
                                                                <Copy size={14} className="text-slate-400" /> Duplicate
                                                            </button>
                                                            <div className="h-px bg-slate-100 my-1"></div>
                                                            <button
                                                                onClick={(e) => handleDelete(e, flow.id)}
                                                                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 size={14} className="text-red-500" /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {flows.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Bot size={24} />
                                                </div>
                                                <p className="text-sm font-medium text-slate-600">No flows found.</p>
                                                <button
                                                    onClick={() => navigate('/builder/new')}
                                                    className="text-violet-600 text-xs font-bold hover:underline"
                                                >
                                                    Create your first flow
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}