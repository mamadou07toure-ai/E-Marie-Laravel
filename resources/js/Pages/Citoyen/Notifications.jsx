import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import CitizenLayout from '@/Layouts/CitizenLayout';
import {
    Bell, CheckCircle2, Clock, AlertCircle,
    FileText, Check, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/utils/time';

function typeIcon(type) {
    switch (type) {
        case 'dossier': return FileText;
        case 'message': return Bell;
        default:        return Info;
    }
}

function typeColors(type, lu) {
    if (lu) return { bg: 'bg-slate-50', icon: 'text-slate-400', border: 'border-slate-100' };
    switch (type) {
        case 'dossier': return { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' };
        case 'message': return { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' };
        default:        return { bg: 'bg-slate-50',   icon: 'text-slate-500',   border: 'border-slate-100' };
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
        <CitizenLayout title="Notifications">
            <Head title="Mes Notifications" />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Centre de notifications</h1>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                            <Bell size={14} className="text-indigo-500" />
                            {unread > 0 ? `${unread} nouvelle${unread > 1 ? 's' : ''} alerte${unread > 1 ? 's' : ''}` : 'Tout est lu'}
                        </p>
                    </div>
                    {unread > 0 && (
                        <button
                            onClick={markAllRead}
                            className="relative z-10 px-5 py-2.5 bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                        >
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                {/* List */}
                {notifs.length > 0 ? (
                    <div className="space-y-3">
                        {notifs.map((n) => {
                            const Icon = typeIcon(n.type);
                            const colors = typeColors(n.type, n.lu);
                            return (
                                <div
                                    key={n.id}
                                    className={`group p-6 bg-white rounded-[2rem] border ${n.lu ? 'border-slate-100' : `${colors.border} shadow-xl shadow-indigo-600/5`} transition-all hover:border-indigo-200 flex items-start gap-5 relative overflow-hidden`}
                                >
                                    {!n.lu && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-r-full" />}

                                    <div className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.icon} flex items-center justify-center shrink-0 shadow-inner`}>
                                        <Icon size={22} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <p className={`text-sm font-black ${n.lu ? 'text-slate-600' : 'text-slate-900'} leading-snug`}>
                                                {n.message}
                                            </p>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic shrink-0 flex items-center gap-1">
                                                <Clock size={11} />
                                                {formatRelativeTime(n.created_at)}
                                            </span>
                                        </div>
                                        {!n.lu && (
                                            <button
                                                onClick={() => markRead(n.id)}
                                                className="mt-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1.5"
                                            >
                                                <Check size={12} /> Marquer comme lu
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-100">
                        <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-200 mx-auto mb-4 shadow-inner border border-indigo-100">
                            <Bell size={32} />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 mb-1">Aucune notification</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Vous serez notifié dès qu'un agent traitera votre dossier.
                        </p>
                    </div>
                )}

                <div className="bg-slate-50 rounded-[2.5rem] p-8 text-center border-2 border-dashed border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Les notifications sont conservées pendant 30 jours.
                    </p>
                </div>
            </div>
        </CitizenLayout>
    );
}
