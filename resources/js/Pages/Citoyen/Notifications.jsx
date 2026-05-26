import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';
import { 
    Bell, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    MessageSquare, 
    Search, 
    Filter,
    ChevronRight,
    Info,
    Trash2
} from 'lucide-react';

export default function Notifications({ auth }) {
    // Notifications fictives pour le design premium
    const notifications = [
        {
            id: 1,
            title: "Dossier validé",
            message: "Votre demande d'acte de naissance MAI-2026-00016 a été validée avec succès.",
            time: "Il y a 10 minutes",
            type: "success",
            icon: CheckCircle2,
            read: false,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100"
        },
        {
            id: 2,
            title: "Nouveau message",
            message: "L'agent Moussa Diallo vous a envoyé un message concernant votre dossier.",
            time: "Il y a 2 heures",
            type: "message",
            icon: MessageSquare,
            read: false,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            border: "border-indigo-100"
        },
        {
            id: 3,
            title: "Analyse en cours",
            message: "Votre dossier de certificat de résidence est en cours d'analyse par un agent.",
            time: "Hier, 15:30",
            type: "info",
            icon: Clock,
            read: true,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100"
        },
        {
            id: 4,
            title: "Action requise",
            message: "Veuillez fournir une copie lisible de votre CNI pour la demande de légalisation.",
            time: "12 Mai 2026",
            type: "warning",
            icon: AlertCircle,
            read: true,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-100"
        }
    ];

    return (
        <CitizenLayout title="Notifications">
            <Head title="Mes Notifications" />

            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:bg-indigo-100 transition-colors duration-500"></div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Centre de notifications</h1>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                            <Bell size={14} className="text-indigo-500" />
                            {notifications.filter(n => !n.read).length} nouvelles alertes
                        </p>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <button className="px-5 py-2.5 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
                            Tout marquer comme lu
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div 
                            key={notif.id} 
                            className={`group p-6 bg-white rounded-[2rem] border ${notif.read ? 'border-slate-100' : 'border-indigo-100 shadow-xl shadow-indigo-600/5'} transition-all hover:border-indigo-200 flex items-start gap-6 relative overflow-hidden`}
                        >
                            {!notif.read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-r-full"></div>
                            )}
                            
                            <div className={`w-14 h-14 rounded-2xl ${notif.bg} ${notif.color} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                <notif.icon size={24} />
                            </div>

                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-sm font-black ${notif.read ? 'text-slate-700' : 'text-slate-900'} tracking-tight`}>{notif.title}</h3>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{notif.time}</span>
                                </div>
                                <p className="text-[12px] font-medium text-slate-500 leading-relaxed max-w-2xl">
                                    {notif.message}
                                </p>
                                <div className="pt-2 flex items-center gap-4">
                                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1.5">
                                        Voir les détails <ChevronRight size={12} />
                                    </button>
                                </div>
                            </div>

                            <button className="p-2.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Empty State / Footer */}
                <div className="bg-slate-50 rounded-[2.5rem] p-10 text-center border-2 border-dashed border-slate-100">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4 shadow-sm">
                        <Info size={32} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mb-1">Archivage automatique</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                        Les notifications sont conservées pendant 30 jours pour votre sécurité.
                    </p>
                </div>
            </div>
        </CitizenLayout>
    );
}
