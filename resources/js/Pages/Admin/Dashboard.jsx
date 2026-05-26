import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users, FileText, TrendingUp, CheckCircle2,
    Clock, AlertCircle, Briefcase, Calendar,
    ArrowRight, ShieldCheck, Activity, XCircle
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0F2D6B', '#00B4D8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard({ auth, stats, recent_users, agent_performance, filters, monthly_stats = [], type_stats = [] }) {
    const kpis = [
        {
            label: 'Citoyens inscrits',
            value: stats?.total_citoyens ?? 0,
            icon: Users,
            color: 'text-mairie-cyan',
            bg: 'bg-mairie-cyan/10',
            ring: 'ring-mairie-cyan/5',
        },
        {
            label: 'Total dossiers',
            value: stats?.total_demandes ?? 0,
            icon: FileText,
            color: 'text-mairie-blue',
            bg: 'bg-mairie-blue/10',
            ring: 'ring-mairie-blue/5',
        },
        {
            label: 'Agents actifs',
            value: stats?.total_agents ?? 0,
            icon: Briefcase,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            ring: 'ring-emerald-500/5',
        },
        {
            label: 'Taux de traitement',
            value: stats?.success_rate ?? '0%',
            icon: CheckCircle2,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            ring: 'ring-amber-500/5',
        },
    ];

    const total = stats?.total_demandes ?? 1;
    const distribution = [
        {
            label: 'Validées',
            value: stats?.validees ?? 0,
            pct: Math.round(((stats?.validees ?? 0) / total) * 100),
            bar: 'bg-emerald-500',
            icon: CheckCircle2,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-50',
        },
        {
            label: 'En cours',
            value: stats?.en_cours ?? 0,
            pct: Math.round(((stats?.en_cours ?? 0) / total) * 100),
            bar: 'bg-blue-500',
            icon: Clock,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-50',
        },
        {
            label: 'Rejetées',
            value: stats?.rejetees ?? 0,
            pct: Math.round(((stats?.rejetees ?? 0) / total) * 100),
            bar: 'bg-red-500',
            icon: XCircle,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-50',
        },
        {
            label: 'En attente',
            value: stats?.en_attente ?? 0,
            pct: Math.round(((stats?.en_attente ?? 0) / total) * 100),
            bar: 'bg-slate-400',
            icon: AlertCircle,
            iconColor: 'text-slate-500',
            iconBg: 'bg-slate-50',
        },
    ];

    const handlePeriodChange = (period) => {
        router.get('/admin/tableau-de-bord', { period }, { preserveState: true });
    };

    const periods = [
        { id: 'all',   label: 'Global' },
        { id: 'today', label: "Aujourd'hui" },
        { id: 'week',  label: 'Cette semaine' },
        { id: 'month', label: 'Ce mois' },
    ];

    return (
        <AdminLayout title="Tableau de bord">
            <Head title="Administration - Smart e-Mairie" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-mairie-blue/60 border border-slate-900/60 rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-mairie-blue/5">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mairie-cyan/15 border border-mairie-cyan/25 text-[10px] font-black uppercase tracking-wider text-mairie-cyan mb-3">
                                <ShieldCheck size={12} />
                                Portail administratif
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
                                Bonjour, {auth.user?.prenom}
                            </h1>
                            <p className="text-slate-400 text-xs font-semibold mt-1.5 flex items-center gap-1.5">
                                <Activity size={13} className="text-emerald-400 animate-pulse" />
                                Vue globale de la mairie en temps réel
                            </p>
                        </div>
 
                        {/* Period filter */}
                        <div className="flex items-center gap-1 p-1 bg-slate-950/60 backdrop-blur border border-slate-800 rounded-2xl shrink-0 flex-wrap">
                            {periods.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => handlePeriodChange(p.id)}
                                    className={`px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-luxury ${
                                        (filters?.period || 'all') === p.id
                                            ? 'bg-gradient-to-r from-mairie-blue to-mairie-cyan text-white shadow-lg'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
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
                                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">
                                    {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">{kpi.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Graphique des tendances d'activité */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
                                <TrendingUp size={18} className="text-mairie-cyan" />
                                <h2 className="font-semibold text-slate-800">Tendances d'activité mensuelle</h2>
                            </div>
                            <div className="p-5 h-72">
                                {monthly_stats.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthly_stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
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
                                            <Area type="monotone" dataKey="count" stroke="#00B4D8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" name="Dossiers" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-slate-400">Aucune donnée disponible</div>
                                )}
                            </div>
                        </div>

                        {/* Répartition par type de demande (PieChart) */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
                                <Activity size={18} className="text-mairie-cyan" />
                                <h2 className="font-semibold text-slate-800">Types de demandes traités</h2>
                            </div>
                            <div className="p-5 h-72 flex flex-col sm:flex-row items-center justify-around gap-4">
                                {type_stats.length > 0 ? (
                                    <>
                                        <div className="w-1/2 h-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={type_stats}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={45}
                                                        outerRadius={65}
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
                                                    <span className="text-[11px] text-slate-600 font-medium truncate max-w-[130px]">{entry.name}</span>
                                                    <span className="text-[11px] font-bold text-slate-800">({entry.value})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-gray-400 w-full">Aucune donnée disponible</div>
                                )}
                            </div>
                        </div>

                        {/* Répartition des dossiers */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
                                <TrendingUp size={18} className="text-mairie-cyan" />
                                <h2 className="font-semibold text-slate-800">Répartition des dossiers</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                {distribution.map((row) => (
                                    <div key={row.label}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-lg ${row.iconBg} ${row.iconColor} flex items-center justify-center`}>
                                                    <row.icon size={14} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-750">{row.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-400">{row.pct}%</span>
                                                <span className="text-sm font-bold text-slate-800 w-8 text-right">{row.value}</span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${row.bar} rounded-full transition-all duration-700`}
                                                style={{ width: `${row.pct}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nouveaux citoyens */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <Users size={18} className="text-mairie-cyan" />
                                    <h2 className="font-semibold text-slate-800">Nouveaux citoyens</h2>
                                </div>
                                <Link href="/admin/utilisateurs" className="text-sm text-mairie-cyan font-medium hover:underline flex items-center gap-1">
                                    Gérer <ArrowRight size={14} />
                                </Link>
                            </div>
                            {recent_users && recent_users.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {recent_users.map((user, i) => (
                                        <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-semibold text-sm shrink-0 group-hover:bg-gradient-to-tr group-hover:from-mairie-blue group-hover:to-mairie-cyan group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-mairie-cyan/10 transition-all">
                                                    {user.prenom?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 group-hover:text-mairie-cyan transition-colors">{user.prenom} {user.nom}</p>
                                                    <p className="text-xs text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                                                <Calendar size={12} />
                                                {new Date(user.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10 text-center text-sm text-slate-400">Aucune donnée disponible</div>
                            )}
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                        {/* Performance agents */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase size={16} className="text-mairie-cyan" />
                                <h3 className="font-semibold text-slate-800 text-sm">Performance agents</h3>
                            </div>
                            {agent_performance && agent_performance.length > 0 ? (
                                <div className="space-y-4">
                                    {agent_performance.map((agent, i) => (
                                        <div key={i}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs shrink-0">
                                                        {agent.prenom?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-800">{agent.prenom} {agent.nom}</p>
                                                        {agent.avg_delay && (
                                                            <p className="text-[10px] text-slate-400">Délai moy.: {agent.avg_delay}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-800">{agent.total}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-mairie-blue to-mairie-cyan rounded-full transition-all duration-700"
                                                    style={{ width: `${Math.min(Math.round((agent.total / 20) * 100), 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-4">Aucune donnée</p>
                            )}
                        </div>

                        {/* Liens rapides */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <h3 className="font-semibold text-slate-800 mb-4 text-sm">Accès rapides</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Gérer les dossiers',   href: '/admin/dossiers',       icon: FileText },
                                    { label: 'Gestion du personnel', href: '/admin/utilisateurs',   icon: Users },
                                    { label: 'Statistiques',         href: '/admin/statistiques',   icon: TrendingUp },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:border-mairie-cyan/20 hover:bg-mairie-cyan/5 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <item.icon size={15} className="text-slate-400 group-hover:text-mairie-cyan transition-colors" />
                                            <span className="text-sm font-medium text-slate-750 group-hover:text-mairie-cyan transition-colors">{item.label}</span>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-300 group-hover:text-mairie-cyan transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* État système */}
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-sm font-semibold text-emerald-600">Système opérationnel</p>
                            </div>
                            <p className="text-xs text-emerald-500/70">Tous les services fonctionnent normalement.</p>
                            <Link href="/admin/systeme" className="inline-block mt-2 text-xs font-semibold text-emerald-600 hover:underline">
                                Voir l'état système →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
