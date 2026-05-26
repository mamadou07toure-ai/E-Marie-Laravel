import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    FileText, 
    Search, 
    Filter, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    User,
    Calendar,
    ChevronRight,
    Briefcase,
    Download,
    FileSpreadsheet,
    X,
    Eye,
    MapPin,
    ShieldCheck
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import axios from 'axios';

export default function Index({ auth, demandes, filters, agents = [], type_demandes = [] }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [statut, setStatut] = useState(filters?.statut || '');
    const [priorite, setPriorite] = useState(filters?.priorite || '');
    const [typeDemandeId, setTypeDemandeId] = useState(filters?.type_demande_id || '');
    const [period, setPeriod] = useState(filters?.period || '');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedDossier, setSelectedDossier] = useState(null);

    const applyFilters = (newFilters) => {
        const merged = {
            search,
            statut,
            priorite,
            type_demande_id: typeDemandeId,
            period,
            ...newFilters
        };
        router.get('/admin/dossiers', merged, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'validee': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'rejetee': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'document_manquant': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'en_cours': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        }
    };

    const handleExport = (format) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statut) params.set('statut', statut);
        const qs = params.toString() ? '?' + params.toString() : '';
        window.location.href = `/admin/dossiers/export/${format}${qs}`;
    };

    const formatLabel = (key) => {
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <AdminLayout title={statut === 'en_cours' ? "Traitement des Opérations" : "Gestion des Dossiers"}>
            <Head title="Registre Central - Smart e-Mairie" />
            <Toaster position="top-right" richColors />

            <div className="space-y-10">
                {/* Header Action Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 opacity-50 group-hover:bg-indigo-100 transition-colors duration-500"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 group-hover:scale-110 transition-transform">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                                {statut === 'en_cours' ? 'Traitement des Opérations' : 'Registre Central'}
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                                <ShieldCheck className="text-indigo-600" size={14} />
                                {statut === 'en_cours' ? 'Dossiers actifs nécessitant une intervention' : 'Supervision de l\'activité administrative'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <button 
                            onClick={() => handleExport('excel')} 
                            className="px-6 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all flex items-center gap-3 shadow-sm group/btn"
                        >
                            <FileSpreadsheet size={18} className="text-emerald-600 group-hover/btn:scale-110 transition-transform" />
                            Exporter Excel
                        </button>
                        <button 
                            onClick={() => handleExport('pdf')} 
                            className="px-6 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center gap-3 shadow-sm group/btn"
                        >
                            <Download size={18} className="text-rose-600 group-hover/btn:scale-110 transition-transform" />
                            Générer PDF
                        </button>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                        <form onSubmit={handleSearch} className="relative flex-1 max-w-lg group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => setSearch(e.target.value)} 
                                placeholder="Rechercher par référence, citoyen..." 
                                className="w-full bg-white border-none rounded-2xl pl-12 pr-6 py-4 text-[11px] font-black uppercase tracking-widest placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm" 
                            />
                        </form>
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-sm ${
                                    showFilters 
                                        ? 'bg-slate-900 text-white' 
                                        : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <Filter size={18} />
                                Filtres Avancés
                            </button>
                            <select 
                                value={statut} 
                                onChange={e => {
                                    setStatut(e.target.value); 
                                    applyFilters({ statut: e.target.value });
                                }} 
                                className="bg-white border-none rounded-2xl px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer shadow-sm min-w-[200px]"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="en_attente">En attente</option>
                                <option value="en_cours">En cours</option>
                                <option value="document_manquant">Pièce manquante</option>
                                <option value="validee">Validés</option>
                                <option value="rejetee">Rejetés</option>
                            </select>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/20 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Priorité</label>
                                <select 
                                    value={priorite}
                                    onChange={e => {
                                        setPriorite(e.target.value);
                                        applyFilters({ priorite: e.target.value });
                                    }}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
                                >
                                    <option value="">Toutes</option>
                                    <option value="basse">Basse</option>
                                    <option value="moyenne">Moyenne</option>
                                    <option value="urgente">Urgente</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Type de Dossier</label>
                                <select 
                                    value={typeDemandeId}
                                    onChange={e => {
                                        setTypeDemandeId(e.target.value);
                                        applyFilters({ type_demande_id: e.target.value });
                                    }}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
                                >
                                    <option value="">Tous les types</option>
                                    {type_demandes.map(t => (
                                        <option key={t.id} value={t.id}>{t.libelle}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Période de soumission</label>
                                <select 
                                    value={period}
                                    onChange={e => {
                                        setPeriod(e.target.value);
                                        applyFilters({ period: e.target.value });
                                    }}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
                                >
                                    <option value="">Toutes les dates</option>
                                    <option value="today">Aujourd'hui</option>
                                    <option value="week">Cette semaine</option>
                                    <option value="month">Ce mois</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                    <th className="px-10 py-6">Référence</th>
                                    <th className="px-10 py-6">Citoyen Demandeur</th>
                                    <th className="px-10 py-6">Type de Dossier</th>
                                    <th className="px-10 py-6">Statut Global</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {demandes?.data && demandes.data.length > 0 ? demandes.data.map((d, i) => (
                                    <tr key={i} className="hover:bg-indigo-50/20 transition-all group">
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-black text-slate-900 tracking-tight italic group-hover:text-indigo-600 transition-colors">{d.numero_dossier}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Géré par {d.agent ? `${d.agent.prenom} ${d.agent.nom}` : 'Non assigné'}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-[11px] font-black group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-inner">
                                                    {d.user?.prenom?.[0]}
                                                </div>
                                                <span className="text-sm font-black text-slate-800 tracking-tight">{d.user?.prenom} {d.user?.nom}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 italic">{d.type_demande?.libelle}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 flex items-center gap-2 w-fit ${getStatusStyle(d.statut)}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    d.statut === 'validee' ? 'bg-emerald-500' :
                                                    d.statut === 'rejetee' ? 'bg-rose-500' : 'bg-indigo-500 animate-pulse'
                                                }`} />
                                                {d.statut?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button 
                                                onClick={() => setSelectedDossier(d)} 
                                                className="w-12 h-12 inline-flex items-center justify-center bg-white border border-slate-100 text-slate-300 rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm group/btn active:scale-90"
                                            >
                                                <Eye size={20} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-32 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100 shadow-inner">
                                                    <FileText size={32} />
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Aucun dossier</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Aucun dossier trouvé correspondant à vos critères.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {demandes?.links && (
                        <div className="px-10 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Affichage de {demandes.from || 0} à {demandes.to || 0} sur {demandes.total} dossiers
                            </p>
                            <div className="flex items-center gap-2">
                                {demandes.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, { search, statut }, { preserveState: true })}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                            link.active 
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                                                : link.url 
                                                    ? 'bg-white text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100'
                                                    : 'bg-transparent text-slate-200 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* DETAIL MODAL - PREMIUM VIEW */}
            {selectedDossier && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="fixed inset-0" onClick={() => setSelectedDossier(null)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedDossier.numero_dossier}</h3>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1 italic">{selectedDossier.type_demande?.libelle}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedDossier(null)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-300 rounded-2xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 sm:p-12 flex-1 min-h-0 overflow-y-auto space-y-8 sm:space-y-12">
                            {/* Citoyen Info */}
                            <div className="space-y-6">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <User size={14} className="text-indigo-500" /> Profil de l'Émetteur
                                </h4>
                                <div className="grid grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Nom Complet</p>
                                        <p className="text-sm font-black text-slate-800 tracking-tight">{selectedDossier.user?.prenom} {selectedDossier.user?.nom}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Email Officiel</p>
                                        <p className="text-sm font-black text-indigo-600 tracking-tight italic underline decoration-indigo-200">{selectedDossier.user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* FORM DATA - STRUCTURED DATA */}
                            <div className="space-y-6">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <FileText size={14} className="text-indigo-500" /> Données Structurées (Standard 7.x)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 p-10 rounded-[2.5rem] border-2 border-slate-50 bg-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                                    {(() => {
                                        const code = selectedDossier.type_demande?.code;
                                        const data =
                                            code === 'ACTE_NAISSANCE'            ? selectedDossier.naissance :
                                            code === 'CERTIFICAT_RESIDENCE'      ? selectedDossier.residence :
                                            code === 'CERTIFICAT_MARIAGE'        ? selectedDossier.mariage :
                                            code === 'LEGALISATION_DOCUMENT'     ? selectedDossier.legalisation :
                                            code === 'AUTORISATION_ADMINISTRATIVE' ? selectedDossier.autorisation :
                                            code === 'CHANGEMENT_ADRESSE'        ? selectedDossier.changement_adresse || selectedDossier.changementAdresse : null;

                                        if (!data) return <p className="col-span-2 text-center text-slate-400 italic text-[10px] font-black uppercase tracking-widest py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Aucune donnée structurée détectée</p>;

                                        return Object.entries(data).map(([key, value]) => {
                                            if (['id', 'demande_id', 'created_at', 'updated_at'].includes(key)) return null;
                                            return (
                                                <div key={key} className="relative z-10">
                                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.1em] mb-2">{formatLabel(key)}</p>
                                                    <p className="text-[13px] font-black text-slate-900 tracking-tight italic border-l-2 border-indigo-500 pl-4">{value || '---'}</p>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="px-8 sm:px-12 py-6 sm:py-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/50 flex-wrap gap-4 shrink-0">
                            {/* Delegation Selector */}
                            <div className="flex items-center gap-3">
                                <Briefcase size={16} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Assigner à :</span>
                                <select 
                                    value={selectedDossier.agent_id || ''} 
                                    onChange={async (e) => {
                                        const newAgentId = e.target.value;
                                        if (!newAgentId) return;
                                        try {
                                            await axios.post(`/admin/dossiers/${selectedDossier.uuid}/reassign`, { agent_id: newAgentId });
                                            toast.success('Dossier réassigné avec succès !');
                                            setSelectedDossier(null);
                                            router.reload();
                                        } catch (err) {
                                            toast.error('Erreur lors de la réassignation.');
                                        }
                                    }}
                                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer max-w-[200px]"
                                >
                                    <option value="">Sélectionner un agent</option>
                                    {agents.map(a => (
                                        <option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex items-center gap-4 ml-auto">
                                <button onClick={() => setSelectedDossier(null)} className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-all">Quitter l'aperçu</button>
                                <button className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 hover:bg-indigo-600 transition-all active:scale-95">Imprimer le récapitulatif</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
