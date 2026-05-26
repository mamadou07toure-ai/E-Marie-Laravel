import { Head, Link } from '@inertiajs/react';
import AgentLayout from '@/Layouts/AgentLayout';
import {
    FileText, Clock, CheckCircle2, Users,
    ArrowRight, Calendar, BarChart3, ShieldAlert,
    AlertCircle, Inbox, TrendingUp, Activity
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0F2D6B', '#00B4D8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const STATUT_CONFIG = {
    validee:          { label: 'Validé',         color: 'text-emerald-600', bg: 'bg-emerald-50',  dot: 'bg-emerald-500', border: 'border-emerald-200' },
    en_cours:         { label: 'En cours',        color: 'text-blue-600',    bg: 'bg-blue-50',     dot: 'bg-blue-500',    border: 'border-blue-200' },
    en_attente:       { label: 'En attente',      color: 'text-slate-600',   bg: 'bg-slate-50',    dot: 'bg-slate-400',   border: 'border-slate-200' },
    rejetee:          { label: 'Rejeté',          color: 'text-red-600',     bg: 'bg-red-50',      dot: 'bg-red-500',     border: 'border-red-200' },
    document_manquant:{ label: 'Pièce manquante', color: 'text-amber-600',   bg: 'bg-amber-50',    dot: 'bg-amber-500',   border: 'border-amber-200' },
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

export default function Dashboard({ auth, stats: dbStats, recentes, monthly_stats = [], type_stats = [] }) {
    const kpis = [
        {
            label: 'À traiter',
            value: dbStats?.en_cours ?? 0,
            icon: Clock,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            ring: 'ring-amber-500/5',
        },
        {
            label: 'Traités',
            value: dbStats?.traites ?? 0,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            ring: 'ring-emerald-500/5',
        },
        {
            label: 'Total assignés',
            value: dbStats?.total_assignes ?? 0,
            icon: Users,
            color: 'text-mairie-cyan',
            bg: 'bg-mairie-cyan/10',
            ring: 'ring-mairie-cyan/5',
        },
        {
            label: 'En attente (global)',
            value: dbStats?.en_attente_global ?? 0,
            icon: ShieldAlert,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
            ring: 'ring-rose-500/5',
        },
    ];

    const recentRequests = recentes ?? [];

    return (
        <AgentLayout title="Tableau de bord">
            <Head title="Espace Agent - Smart e-Mairie" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-mairie-blue/60 border border-slate-900/60 rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-mairie-blue/5">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider text-emerald-400 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Session active
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">{auth.user.prenom} {auth.user.nom}</h1>
                            <p className="text-slate-400 text-xs font-semibold mt-1.5">
                                Vous avez <span className="font-black text-emerald-400">{dbStats?.en_cours ?? 0} dossier{(dbStats?.en_cours ?? 0) > 1 ? 's' : ''}</span> en attente de traitement.
                            </p>
                        </div>
                        <Link
                            href="/agent/demandes"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mairie-blue to-mairie-cyan text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-luxury shadow-lg shadow-mairie-blue/10 shrink-0"
                        >
                            <Inbox size={14} />
                            Voir les dossiers
                        </Link>
                    </div>
                    <div className="absolute -right-8 -top-8 w-48 h-48 bg-mairie-cyan/8 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -left-4 -bottom-8 w-36 h-36 bg-mairie-blue/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                    {/* File d'attente */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
                                <TrendingUp size={18} className="text-mairie-cyan" />
                                <h2 className="font-semibold text-slate-800">Mes tendances de traitement</h2>
                            </div>
                            <div className="p-5 h-64">
                                {monthly_stats.length > 0 ? (
                                     <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthly_stats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorAgentCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#00B4D8" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                                                itemStyle={{ color: '#fff' }}
                                                labelStyle={{ color: '#00B4D8', fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="count" stroke="#00B4D8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAgentCount)" name="Dossiers" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-slate-400">Aucune statistique disponible pour le moment</div>
                                )}
                            </div>
                        </div>

                        {/* Répartition de mes dossiers par type */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
                                <Activity size={18} className="text-mairie-cyan" />
                                <h2 className="font-semibold text-slate-800">Types de dossiers assignés</h2>
                            </div>
                            <div className="p-5 h-64 flex flex-col sm:flex-row items-center justify-around gap-4">
                                {type_stats.length > 0 ? (
                                    <>
                                        <div className="w-1/2 h-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={type_stats}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={42}
                                                        outerRadius={62}
                                                        paddingAngle={6}
                                                        dataKey="value"
                                                    >
                                                        {type_stats.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex flex-col gap-2 max-w-xs shrink-0">
                                            {type_stats.map((entry, index) => (
                                                <div key={entry.name} className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    <span className="text-[11px] text-slate-600 font-medium truncate max-w-[120px]">{entry.name}</span>
                                                    <span className="text-[11px] font-bold text-slate-800">({entry.value})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-slate-400 w-full">Aucun dossier assigné pour le moment</div>
                                )}
                            </div>
                        </div>

                        {/* File d'attente */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-mairie-cyan" />
                                    <h2 className="font-semibold text-slate-800">Dernières demandes</h2>
                                </div>
                                <Link href="/agent/demandes" className="text-sm text-mairie-cyan font-medium hover:underline flex items-center gap-1">
                                    Voir tout <ArrowRight size={14} />
                                </Link>
                            </div>

                            {recentRequests.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {recentRequests.map((req) => (
                                        <div key={req.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-semibold text-sm shrink-0 group-hover:bg-gradient-to-tr group-hover:from-mairie-blue group-hover:to-mairie-cyan group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-mairie-cyan/10 transition-all">
                                                    {req.user?.prenom?.[0] ?? 'C'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 group-hover:text-mairie-cyan transition-colors truncate">{req.user?.prenom} {req.user?.nom}</p>
                                                    <p className="text-xs text-slate-450 truncate">{req.type_demande?.libelle}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0 ml-3">
                                                <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                                                    <Calendar size={12} />
                                                    {new Date(req.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                                </span>
                                                <StatutBadge statut={req.statut?.value ?? req.statut} />
                                                <Link href={`/agent/demandes/${req.uuid}`} className="p-1.5 text-slate-405 hover:text-mairie-cyan transition-colors">
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
                                    <p className="text-sm font-medium text-slate-700">Aucune demande en cours</p>
                                    <p className="text-xs text-slate-400 mt-1">Toutes les demandes ont été traitées</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panneau latéral */}
                    <div className="space-y-4">
                        {/* Objectifs mensuels */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <BarChart3 size={16} className="text-mairie-cyan" />
                                <h3 className="font-semibold text-slate-800 text-sm">Objectifs du mois</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-600">Dossiers clôturés</span>
                                        <span className="font-semibold text-slate-800">
                                            {dbStats?.traites ?? 0} / {Math.max(dbStats?.total_assignes ?? 0, 1)}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-mairie-blue to-mairie-cyan rounded-full transition-all duration-700"
                                            style={{
                                                width: dbStats?.total_assignes > 0
                                                    ? `${Math.min(Math.round((dbStats.traites / dbStats.total_assignes) * 100), 100)}%`
                                                    : '0%'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-600">En attente globale</span>
                                        <span className="font-semibold text-amber-500">{dbStats?.en_attente_global ?? 0}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full transition-all duration-700"
                                            style={{
                                                width: dbStats?.en_attente_global > 0 ? '40%' : '0%'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alerte si dossiers critiques */}
                        {(dbStats?.en_attente_global ?? 0) > 5 && (
                            <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-5 flex gap-3">
                                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-amber-600">File d'attente chargée</p>
                                    <p className="text-xs text-amber-500/70 mt-0.5">
                                        {dbStats.en_attente_global} dossier{dbStats.en_attente_global > 1 ? 's' : ''} non assigné{dbStats.en_attente_global > 1 ? 's' : ''}.
                                    </p>
                                    <Link href="/agent/demandes" className="inline-block mt-2 text-xs font-semibold text-amber-600 hover:underline">
                                        Traiter maintenant →
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Communications internes */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <h3 className="font-semibold text-slate-800 mb-4 text-sm">Communications internes</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-mairie-cyan/5 rounded-2xl border border-mairie-cyan/10">
                                    <span className="w-2 h-2 rounded-full bg-mairie-cyan shrink-0 mt-1.5 animate-pulse" />
                                    <div>
                                        <p className="text-sm font-semibold text-mairie-blue">Mise à jour procédures</p>
                                        <p className="text-xs text-mairie-cyan mt-0.5">Nouveaux protocoles légalisations internationales.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Maintenance programmée</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Portail indisponible dimanche 02h–04h.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}
