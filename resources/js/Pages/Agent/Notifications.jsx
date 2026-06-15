import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import AgentLayout from '@/Layouts/AgentLayout';
import { Bell, Check, Clock, FileText, Info, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/utils/time';

function typeIcon(type) {
    switch (type) {
        case 'dossier': return FileText;
        case 'message': return Inbox;
        default:        return Info;
    }
}

export default function Notifications({ auth }) {
    const { notifications: initialNotifs = [] } = usePage().props;
    const [notifs, setNotifs] = useState(initialNotifs);

    const unread = notifs.filter(n => !n.lu).length;

    const markRead = async (id) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
        try {
            await axios.patch(`/api/v1/notifications/${id}/lu`);
        } catch {
            toast.error("Erreur lors de la mise à jour.");
        }
    };

    const markAllRead = async () => {
        setNotifs(prev => prev.map(n => ({ ...n, lu: true })));
        try {
            await axios.post('/api/v1/notifications/mark-all-read');
            toast.success("Toutes les notifications marquées comme lues.");
        } catch {
            toast.error("Erreur lors de la mise à jour.");
        }
    };

    return (
        <AgentLayout title="Toutes les notifications">
            <Head title="Notifications - Espace Agent" />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Vos Notifications</h1>
                        <p className="text-slate-500 text-sm">
                            {unread > 0 ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Tout est lu'}
                        </p>
                    </div>
                    {unread > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-all border border-indigo-100"
                        >
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                {notifs.length > 0 ? (
                    <div className="space-y-4">
                        {notifs.map((n) => {
                            const Icon = typeIcon(n.type);
                            return (
                                <div
                                    key={n.id}
                                    className={`bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md flex gap-5 ${!n.lu ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-slate-200 opacity-80'}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${!n.lu ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Icon size={22} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1 gap-2">
                                            <p className={`text-sm font-bold ${!n.lu ? 'text-slate-900' : 'text-slate-500'}`}>
                                                {n.message}
                                            </p>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                                                <Clock size={12} />
                                                {formatRelativeTime(n.created_at)}
                                            </span>
                                        </div>

                                        {!n.lu && (
                                            <button
                                                onClick={() => markRead(n.id)}
                                                className="mt-3 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center gap-2 transition-all"
                                            >
                                                <Check size={14} />
                                                Marquer comme lu
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={32} />
                        </div>
                        <h3 className="text-slate-900 font-bold mb-1">Aucune notification</h3>
                        <p className="text-slate-500 text-sm">Vous serez notifié en cas de réassignation de dossier.</p>
                    </div>
                )}
            </div>
        </AgentLayout>
    );
}
