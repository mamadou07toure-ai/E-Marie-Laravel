import { Head, Link } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';
import {
    FileText, Clock, CheckCircle2, AlertCircle,
    Plus, ArrowRight, Calendar, MessageSquare,
    TrendingUp, XCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';

const STATUT_CONFIG = {
    validee:          { label: 'Validé',          color: 'text-emerald-600', bg: 'bg-emerald-50',  dot: 'bg-emerald-500', border: 'border-emerald-200' },
    en_cours:         { label: 'En cours',         color: 'text-blue-600',    bg: 'bg-blue-50',     dot: 'bg-blue-500',    border: 'border-blue-200' },
    en_attente:       { label: 'En attente',       color: 'text-slate-600',   bg: 'bg-slate-50',    dot: 'bg-slate-400',   border: 'border-slate-200' },
    rejetee:          { label: 'Rejeté',           color: 'text-red-600',     bg: 'bg-red-50',      dot: 'bg-red-500',     border: 'border-red-200' },
    document_manquant:{ label: 'Pièce manquante',  color: 'text-amber-600',   bg: 'bg-amber-50',    dot: 'bg-amber-500',   border: 'border-amber-200' },
    remise:           { label: 'Remis',            color: 'text-violet-600',  bg: 'bg-violet-50',   dot: 'bg-violet-500',  border: 'border-violet-200' },
};

function StatutBadge({ statut }) {
    const cfg = STATUT_CONFIG[statut] ?? STATUT_CONFIG.en_attente;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

export default function Dashboard({ auth, stats: dbStats, recentes }) {
    const kpis = [
        {
            label: 'Dossiers actifs',
            value: dbStats?.en_cours ?? 0,
            icon: Clock,
            color: 'text-mairie-cyan',
            bg: 'bg-mairie-cyan/10',
            ring: 'ring-mairie-cyan/5',
        },
        {
            label: 'Dossiers validés',
            value: dbStats?.validees ?? 0,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            ring: 'ring-emerald-500/5',
        },
        {
            label: 'Dossiers rejetés',
            value: dbStats?.rejetees ?? 0,
            icon: XCircle,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
            ring: 'ring-rose-500/5',
        },
    ];

    const recentDossiers = recentes ?? [];

    return (
        <CitizenLayout title="Tableau de bord">
            <Head title="Tableau de bord - Smart e-Mairie" />

            <div className="max-w-6xl mx-auto space-y-6">

                {/* Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-mairie-blue/60 border border-slate-900/60 rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-mairie-blue/5">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mairie-cyan/15 border border-mairie-cyan/25 text-[10px] font-black uppercase tracking-wider text-mairie-cyan mb-3">
                                <ShieldCheck size={12} />
                                Espace citoyen
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
                                Bienvenue, {auth.user.prenom}
                            </h1>
                            <p className="text-slate-400 text-xs font-semibold mt-1.5">
                                Vous avez <span className="font-black text-emerald-400">{dbStats?.en_cours ?? 0} dossier{(dbStats?.en_cours ?? 0) > 1 ? 's' : ''}</span> en cours de traitement.
                            </p>
                        </div>
                        <Link
                            href="/citoyen/nouvelle-demande"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mairie-blue to-mairie-cyan text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-luxury shadow-lg shadow-mairie-blue/10 shrink-0"
                        >
                            <Plus size={14} />
                            Nouvelle demande
                        </Link>
                    </div>
                    <div className="absolute -right-8 -top-8 w-48 h-48 bg-mairie-cyan/8 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -left-4 -bottom-8 w-36 h-36 bg-mairie-blue/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {kpis.map((kpi) => (
                        <div key={kpi.label} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-premium hover:-translate-y-0.5 transition-luxury">
                            <div className={`w-12 h-12 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center ring-4 ${kpi.ring} shrink-0`}>
                                <kpi.icon size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">{kpi.value}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">{kpi.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Dossiers récents */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-mairie-cyan" />
                                <h2 className="font-semibold text-slate-800">Dossiers récents</h2>
                            </div>
                            <Link href="/citoyen/mes-dossiers" className="text-sm text-mairie-cyan font-medium hover:underline flex items-center gap-1">
                                Voir tout <ArrowRight size={14} />
                            </Link>
                        </div>

                        {recentDossiers.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {recentDossiers.map((d) => (
                                    <div key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-gradient-to-tr group-hover:from-mairie-blue group-hover:to-mairie-cyan group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-mairie-cyan/10 transition-all">
                                                <FileText size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-mairie-cyan uppercase tracking-wide">{d.numero_dossier}</p>
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-mairie-cyan transition-colors truncate">{d.type_demande?.libelle}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 ml-3">
                                            <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                                                <Calendar size={12} />
                                                {new Date(d.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <StatutBadge statut={d.statut?.value ?? d.statut} />
                                            <Link href={`/citoyen/mes-dossiers/${d.uuid}`} className="p-1.5 text-slate-400 hover:text-mairie-cyan transition-colors">
                                                <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-3">
                                    <FileText size={22} />
                                </div>
                                <p className="text-sm font-medium text-slate-700">Aucun dossier pour le moment</p>
                                <p className="text-xs text-slate-400 mt-1">Commencez par soumettre une demande</p>
                                <Link href="/citoyen/nouvelle-demande" className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-mairie-blue to-mairie-cyan text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-luxury shadow-lg shadow-mairie-blue/10">
                                    <Plus size={14} /> Nouvelle demande
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Panneau d'aide */}
                    <div className="space-y-4">
                        {/* Support */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <h3 className="font-semibold text-slate-800 mb-4">Besoin d'aide ?</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-mairie-cyan/5 rounded-2xl border border-mairie-cyan/10">
                                    <MessageSquare size={18} className="text-mairie-cyan shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-mairie-blue">Support en ligne</p>
                                        <p className="text-xs text-mairie-cyan mt-0.5">Disponible lundi–vendredi, 08h–17h.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <TrendingUp size={18} className="text-slate-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Guide Utilisateur</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Consultez notre documentation pour vos démarches.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alerte si dossiers rejetés */}
                        {(dbStats?.rejetees ?? 0) > 0 && (
                            <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-5 flex gap-3">
                                <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-rose-600">Action requise</p>
                                    <p className="text-xs text-rose-500/70 mt-0.5">
                                        {dbStats.rejetees} dossier{dbStats.rejetees > 1 ? 's' : ''} rejeté{dbStats.rejetees > 1 ? 's' : ''}. Consultez les détails.
                                    </p>
                                    <Link href="/citoyen/mes-dossiers" className="inline-block mt-2 text-xs font-semibold text-rose-600 hover:underline">
                                        Voir les dossiers →
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Info délais */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock size={16} className="text-mairie-cyan" />
                                <h3 className="font-semibold text-slate-800 text-sm">Délais de traitement</h3>
                            </div>
                            <ul className="space-y-2.5 text-xs text-slate-600">
                                <li className="flex justify-between items-center py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"><span>Acte de naissance</span><span className="font-bold text-slate-800">3 jours</span></li>
                                <li className="flex justify-between items-center py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"><span>Certificat résidence</span><span className="font-bold text-slate-800">2 jours</span></li>
                                <li className="flex justify-between items-center py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"><span>Légalisation</span><span className="font-bold text-slate-800">1 jour</span></li>
                                <li className="flex justify-between items-center py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"><span>Autorisation</span><span className="font-bold text-slate-800">10 jours</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </CitizenLayout>
    );
}
