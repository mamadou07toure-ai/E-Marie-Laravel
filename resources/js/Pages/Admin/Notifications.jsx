import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Bell, 
    Clock, 
    AlertCircle, 
    Trash2,
    UserPlus,
    Check,
    Activity
} from 'lucide-react';
import { toast } from 'sonner';

export default function Notifications({ auth, db_notifications }) {
    // On utilise les notifications réelles de la DB, tout en gardant l'état local pour les actions UI
    const [notifications, setNotifications] = useState(db_notifications || []);

    // Mise à jour de l'état local si les props changent
    useEffect(() => {
        if (db_notifications) {
            setNotifications(db_notifications);
        }
    }, [db_notifications]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        ));
        toast.success("Notification marquée comme lue");
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.error("Notification supprimée");
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success("Toutes les notifications lues");
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // Mapping des icônes par type d'action réelle
    const getIcon = (title) => {
        const t = title.toLowerCase();
        if (t.includes('création')) return UserPlus;
        if (t.includes('suppression')) return Trash2;
        if (t.includes('mise à jour')) return Activity;
        return Bell;
    };

    return (
        <AdminLayout title="Journal des Activités">
            <Head title="Journal" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Flux Réel du Système</h3>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full">
                                {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                            </span>
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <button 
                            onClick={markAllAsRead}
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
                        >
                            <Check size={14} />
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                    {notifications.length > 0 ? notifications.map((n) => {
                        const Icon = getIcon(n.title);
                        return (
                            <div key={n.id} className={`p-6 flex gap-4 hover:bg-slate-50 transition-all relative group ${!n.read ? 'bg-indigo-50/20' : ''}`}>
                                <div className={`w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100`}>
                                    <Icon size={22} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-sm font-bold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h4>
                                        <span className="text-[10px] font-medium text-slate-400 italic">{n.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed pr-20">{n.description}</p>
                                </div>

                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!n.read && (
                                            <button 
                                                onClick={() => markAsRead(n.id)}
                                                className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-md transition-all"
                                                title="Marquer comme lu"
                                            >
                                                <Check size={14} strokeWidth={3} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(n.id)}
                                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 italic">
                            <Activity size={48} className="opacity-10 mb-4" />
                            <p className="text-sm font-medium">Aucun journal d'activité enregistré.</p>
                        </div>
                    )}
                </div>

                <div className="text-center py-10 opacity-40">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Synchronisation Directe - Base de Données</p>
                </div>
            </div>
        </AdminLayout>
    );
}
