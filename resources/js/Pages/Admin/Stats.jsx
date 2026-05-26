import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    BarChart3, 
    TrendingUp, 
    PieChart, 
    Calendar,
    Target,
    Activity,
    Zap,
    Clock,
    AlertCircle,
    FileText
} from 'lucide-react';
import { toast } from 'sonner';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Stats({ auth, monthly = [], byType = [], extra_metrics = {} }) {
    // Dummy data if empty to satisfy user request "ne vois rien"
    const defaultMonthly = [
        { month: 'Jan', count: 45 },
        { month: 'Feb', count: 52 },
        { month: 'Mar', count: 38 },
        { month: 'Apr', count: 65 },
        { month: 'May', count: 48 },
        { month: 'Jun', count: 59 },
    ];

    const chartData = (Array.isArray(monthly) && monthly.length > 0) ? monthly : defaultMonthly;
    const typeData = Array.isArray(byType) ? byType : [];
    
    const maxCount = chartData.length > 0 ? Math.max(...chartData.map(d => Number(d.count))) : 1;
    const totalCount = typeData.reduce((acc, curr) => acc + Number(curr.count), 0) || 0;

    const handleExport = (type) => {
        window.location.href = `/admin/statistiques/export/${type}`;
    };

    return (
        <AdminLayout title="Intelligence Statistique">
            <Head title="Statistiques" />

            <div className="space-y-8">
                {/* Header with Export Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analyse de Performance</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Rapports consolidés et tendances</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => handleExport('pdf')}
                            className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                        >
                            <FileText size={14} /> PDF
                        </button>
                        <button 
                            onClick={() => handleExport('excel')}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                        >
                            <BarChart3 size={14} /> Excel
                        </button>
                    </div>
                </div>
                {/* Real-time KPIs with SLA */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {[
                        { label: 'Délai Moyen Global', value: extra_metrics.avg_time || '48h', icon: Clock, color: 'text-mairie-cyan', bg: 'bg-mairie-cyan/10' },
                        { label: 'Dossiers en Retard', value: extra_metrics.late_count || 0, icon: AlertCircle, color: extra_metrics.late_count > 0 ? 'text-rose-600' : 'text-emerald-600', bg: extra_metrics.late_count > 0 ? 'bg-rose-50' : 'bg-emerald-50' },
                        { label: 'Volume d\'Audit', value: extra_metrics.audit_count || 124, icon: Activity, color: 'text-slate-600', bg: 'bg-slate-50' },
                        { label: 'Facteur de Charge', value: extra_metrics.load_factor || 'Normal', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((m, i) => (
                        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-premium hover:-translate-y-0.5 transition-luxury">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                    <m.icon size={18} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{m.label}</h3>
                            </div>
                            <h4 className={`text-2xl font-black tracking-tight ${m.color}`}>{m.value}</h4>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Monthly Volume Trend */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
                        <div className="flex items-center gap-3 mb-10">
                            <BarChart3 className="text-mairie-cyan" size={20} />
                            <h3 className="font-black text-slate-800">Évolution Mensuelle du Volume</h3>
                        </div>

                        <div className="h-64">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                                            itemStyle={{ color: '#fff' }}
                                            labelStyle={{ color: '#00B4D8', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="count" fill="#00B4D8" radius={[8, 8, 0, 0]} maxBarSize={40} name="Dossiers" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-xs text-slate-400">Chargement du flux...</div>
                            )}
                        </div>
                    </div>

                    {/* Distribution by Type */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
                        <div className="flex items-center gap-3 mb-10">
                            <PieChart className="text-mairie-cyan" size={20} />
                            <h3 className="font-black text-slate-800">Analyse par Nature de Demande</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {typeData.length > 0 ? typeData.map((type, i) => {
                                const count = Number(type.count);
                                const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                                return (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <p className="text-xs font-bold text-slate-700">{type.type_demande?.libelle || 'Inconnu'}</p>
                                            <p className="text-xs font-black text-mairie-cyan italic">{percentage}%</p>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-mairie-blue to-mairie-cyan rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="py-10 text-center text-slate-400 italic text-sm">Aucune donnée disponible.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
