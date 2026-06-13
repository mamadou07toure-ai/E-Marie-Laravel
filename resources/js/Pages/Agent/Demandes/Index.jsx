import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AgentLayout from '@/Layouts/AgentLayout';
import axios from 'axios';
import { Inbox, Search, ArrowRight, Loader2, Calendar, Tag, Play, UserCheck } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Index({ title = "Tous les dossiers", mine = false }) {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [assigningId, setAssigningId] = useState(null);

    useEffect(() => {
        fetchDemandes();
    }, [filter, mine]);

    const fetchDemandes = async () => {
        try {
            setLoading(true);
            const params = mine ? { mine: 1 } : {};
            if (filter !== 'all') params.statut = filter;
            const response = await axios.get('/api/v1/agent/demandes', { params });
            setDemandes(response.data.data || []);
        } catch (error) {
            console.error('Fetch error:', error);
            const msg = error.response?.data?.message || error.message || 'Erreur inconnue';
            toast.error('Impossible de charger les dossiers : ' + msg);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (uuid, e) => {
        e.preventDefault();
        e.stopPropagation();
        setAssigningId(uuid);
        try {
            await axios.post(`/api/v1/agent/demandes/${uuid}/assign`);
            toast.success('Dossier pris en charge avec succès !');
            fetchDemandes();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la prise en charge.");
        } finally {
            setAssigningId(null);
        }
    };

    const filteredDemandes = demandes.filter(d =>
        d.numero_dossier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.type_demande?.libelle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${d.user?.prenom} ${d.user?.nom}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statutLabel = (s) => s?.replace(/_/g, ' ') ?? '';

    return (
        <AgentLayout title={title}>
            <Head title={title} />
            <Toaster position="top-right" richColors />

            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{title}</h1>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                            <Tag size={14} className="text-indigo-500" />
                            Gestion de la file d'attente État Civil
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                        <div className="relative group min-w-[240px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher un dossier..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-slate-50 border-none rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="en_attente">En attente</option>
                            <option value="en_cours">En cours</option>
                            <option value="document_manquant">Pièce manquante</option>
                            <option value="validee">Validés</option>
                            <option value="remise">Remis (Clos)</option>
                            <option value="rejetee">Rejetés</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] uppercase tracking-[0.3em] font-black text-slate-400">
                                    <th className="px-8 py-6">Dossier / Type</th>
                                    <th className="px-8 py-6">Citoyen</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6">Statut</th>
                                    <th className="px-8 py-6">Agent assigné</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-10 py-24 text-center">
                                            <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={32} />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Récupération des dossiers...</p>
                                        </td>
                                    </tr>
                                ) : filteredDemandes.length > 0 ? (
                                    filteredDemandes.map((task) => {
                                        const isAssigningThis = assigningId === task.uuid;
                                        const isAssigned = !!task.agent_id;
                                        return (
                                            <tr key={task.id} className="hover:bg-indigo-50/20 transition-all group">
                                                {/* Dossier */}
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{task.numero_dossier}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{task.type_demande?.libelle}</p>
                                                    </div>
                                                </td>
                                                {/* Citoyen */}
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-[11px] font-black group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-inner shrink-0">
                                                            {task.user?.prenom?.[0]}
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-black text-slate-800 tracking-tight">{task.user?.prenom} {task.user?.nom}</span>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${task.priorite === 'urgente' ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Priorité {task.priorite}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Date */}
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-slate-500 text-[11px] font-black uppercase tracking-widest italic">
                                                        <Calendar size={13} className="text-slate-300" />
                                                        {new Date(task.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                </td>
                                                {/* Statut */}
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 flex items-center gap-1.5 w-fit ${
                                                        task.statut === 'validee'           ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        task.statut === 'remise'            ? 'bg-violet-50 text-violet-600 border-violet-100' :
                                                        task.statut === 'rejetee'           ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                        task.statut === 'document_manquant' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        task.statut === 'en_cours'          ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-slate-50 text-slate-600 border-slate-100'
                                                    }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                                            task.statut === 'validee'           ? 'bg-emerald-500' :
                                                            task.statut === 'remise'            ? 'bg-violet-500' :
                                                            task.statut === 'rejetee'           ? 'bg-rose-500' :
                                                            task.statut === 'document_manquant' ? 'bg-amber-500' :
                                                            task.statut === 'en_cours'          ? 'bg-blue-500 animate-pulse' :
                                                            'bg-slate-400'
                                                        }`} />
                                                        {statutLabel(task.statut)}
                                                    </span>
                                                </td>
                                                {/* Agent assigné */}
                                                <td className="px-8 py-6">
                                                    {isAssigned ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">
                                                                {task.agent?.prenom?.[0]}{task.agent?.nom?.[0]}
                                                            </div>
                                                            <span className="text-[11px] font-black text-slate-700">{task.agent?.prenom}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[9px] font-black text-amber-500 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg uppercase tracking-widest">
                                                            Non assigné
                                                        </span>
                                                    )}
                                                </td>
                                                {/* Actions */}
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {!isAssigned && (
                                                            <button
                                                                onClick={(e) => handleAssign(task.uuid, e)}
                                                                disabled={isAssigningThis}
                                                                title="Prendre en charge"
                                                                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-60"
                                                            >
                                                                {isAssigningThis
                                                                    ? <Loader2 size={12} className="animate-spin" />
                                                                    : <Play size={12} />}
                                                                Prendre en charge
                                                            </button>
                                                        )}
                                                        <Link
                                                            href={`/agent/demandes/${task.uuid}`}
                                                            className="w-10 h-10 inline-flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                                                            title="Voir le dossier"
                                                        >
                                                            <ArrowRight size={16} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-10 py-32 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100 shadow-inner">
                                                    <Inbox size={32} />
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">File vide</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Aucun dossier ne correspond à vos critères.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-10 py-5 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <UserCheck size={12} className="text-indigo-400" />
                            {filteredDemandes.length} dossier{filteredDemandes.length > 1 ? 's' : ''} affiché{filteredDemandes.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                            {filteredDemandes.filter(d => !d.agent_id).length} non assigné{filteredDemandes.filter(d => !d.agent_id).length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}
