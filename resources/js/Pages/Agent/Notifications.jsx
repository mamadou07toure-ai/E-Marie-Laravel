import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Bell, Check, Trash2, Clock, Inbox, ShieldCheck } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Notifications({ auth }) {
    // État local pour gérer les notifications en temps réel
    const [notifs, setNotifs] = useState([
        { id: 1, title: 'Nouveau dossier assigné', message: 'Le dossier MAI-2026-00045 vous a été assigné automatiquement.', time: 'Il y a 5 min', read: false, type: 'assignment' },
        { id: 2, title: 'Profil mis à jour', message: 'Les modifications de votre profil ont été enregistrées avec succès.', time: 'Il y a 1h', read: true, type: 'system' },
        { id: 3, title: 'Dossier validé', message: 'Le dossier de Moussa Camara a été validé et archivé.', time: 'Hier', read: true, type: 'success' },
    ]);

    const handleMarkAsRead = (id) => {
        setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
        toast.info('Notification marquée comme lue');
    };

    const handleDelete = (id) => {
        setNotifs(notifs.filter(n => n.id !== id));
        toast.error('Notification supprimée');
    };

    const handleMarkAllAsRead = () => {
        setNotifs(notifs.map(n => ({ ...n, read: true })));
        toast.success('Toutes les notifications sont lues');
    };

    return (
        <AgentLayout title="Toutes les notifications">
            <Head title="Notifications - Espace Agent" />
            <Toaster position="top-right" richColors />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Vos Notifications</h1>
                        <p className="text-slate-500 text-sm">Restez informé de l'activité sur vos dossiers et votre compte.</p>
                    </div>
                    {notifs.some(n => !n.read) && (
                        <button 
                            onClick={handleMarkAllAsRead}
                            className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-all border border-indigo-100"
                        >
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                {notifs.length > 0 ? (
                    <div className="space-y-4">
                        {notifs.map((n) => (
                            <div key={n.id} className={`bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md flex gap-5 animate-in slide-in-from-bottom-2 ${!n.read ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-slate-200 opacity-80'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                    n.type === 'assignment' ? 'bg-blue-50 text-blue-600' : 
                                    n.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {n.type === 'assignment' ? <Inbox size={24} /> : <Bell size={24} />}
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`font-bold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h3>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                            <Clock size={12} />
                                            {n.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">{n.message}</p>
                                    
                                    <div className="flex items-center gap-3">
                                        {!n.read && (
                                            <button 
                                                onClick={() => handleMarkAsRead(n.id)}
                                                className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center gap-2 transition-all"
                                            >
                                                <Check size={14} />
                                                Marquer comme lu
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(n.id)}
                                            className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-2 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={14} />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={32} />
                        </div>
                        <h3 className="text-slate-900 font-bold mb-1">Aucune notification</h3>
                        <p className="text-slate-500 text-sm">Vous n'avez pas de nouvelles alertes pour le moment.</p>
                    </div>
                )}
            </div>
        </AgentLayout>
    );
}
