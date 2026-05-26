import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Calendar,
    ArrowUpDown,
    Plus,
    X,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronDown,
    Download,
    Printer,
    MessageSquare,
    UserCheck,
    FileText
} from 'lucide-react';
import { toast } from 'sonner';

const PER_PAGE = 10;

export default function Index({ auth, demandes }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('desc');
    const [activeMenu, setActiveMenu] = useState(null);
    const [page, setPage] = useState(1);

    const filteredDemandes = useMemo(() => {
        let result = [...(demandes || [])];
        if (searchQuery) {
            result = result.filter(d =>
                d.numero_dossier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.type_demande?.libelle?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (statusFilter !== 'all') {
            result = result.filter(d => d.statut === statusFilter);
        }
        result.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        return result;
    }, [demandes, searchQuery, statusFilter, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(filteredDemandes.length / PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const paginatedDemandes = filteredDemandes.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    const getStatutBadge = (statut) => {
        switch(statut) {
            case 'validee': return 'bg-green-100 text-green-700 border-green-200';
            case 'en_cours': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'rejetee': return 'bg-red-100 text-red-700 border-red-200';
            case 'document_manquant': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const handleDownload = (numero) => {
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    const blob = new Blob(["Récépissé certifié pour le dossier " + numero], { type: "text/plain" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `Recepisse_${numero}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    resolve();
                }, 1500);
            }),
            {
                loading: `Génération du reçu pour le dossier ${numero}...`,
                success: `Le reçu du dossier ${numero} a été téléchargé.`,
                error: "Erreur de génération.",
            }
        );
        setActiveMenu(null);
    };

    const handleContact = (agent) => {
        if (!agent) {
            toast.error("Aucun agent n'est encore assigné à ce dossier.");
        } else {
            toast.success(`Ouverture de la messagerie sécurisée avec l'agent ${agent.prenom} ${agent.nom}...`);
        }
        setActiveMenu(null);
    };

    return (
        <CitizenLayout title="Mes dossiers">
            <Head title="Mes demandes" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Historique des demandes</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Suivez l'évolution de vos démarches en temps réel.</p>
                </div>
                <Link 
                    href="/citoyen/nouvelle-demande" 
                    className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 group text-[11px] uppercase tracking-widest"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Nouvelle demande</span>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                            type="text" 
                            placeholder="Rechercher par numéro ou type..." 
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full bg-slate-50 border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-[11px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold placeholder:text-slate-300"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-44">
                            <select 
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="w-full bg-white border-2 border-slate-50 rounded-2xl px-5 py-3 text-[11px] font-black text-slate-500 appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none cursor-pointer pr-10"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="en_attente">En attente</option>
                                <option value="en_cours">En cours</option>
                                <option value="document_manquant">Pièce manquante</option>
                                <option value="validee">Validées</option>
                                <option value="rejetee">Rejetées</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>

                        <button 
                            onClick={() => { setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); setPage(1); }}
                            className="flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-slate-50 rounded-2xl text-[11px] font-black text-slate-500 hover:border-indigo-600/30 hover:text-indigo-600 transition-all group shrink-0"
                        >
                            <ArrowUpDown size={16} className={sortOrder === 'asc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                            <span className="hidden sm:inline uppercase tracking-widest">{sortOrder === 'desc' ? 'Récent' : 'Ancien'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Référence</th>
                                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Service / Agent</th>
                                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Date dépôt</th>
                                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedDemandes.length > 0 ? paginatedDemandes.map((demande) => (
                                <tr key={demande.id} className="hover:bg-indigo-50/20 transition-all group relative">
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-black text-indigo-600 tracking-tight">{demande.numero_dossier}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-800">{demande.type_demande?.libelle}</span>
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <UserCheck size={12} className="text-indigo-500" />
                                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                                                    Assigné à: {demande.agent ? `${demande.agent.prenom} ${demande.agent.nom}` : 'En attente'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                                            <Calendar size={14} className="text-slate-300" />
                                            {new Date(demande.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 flex items-center gap-1.5 w-fit ${getStatutBadge(demande.statut)}`}>
                                            <span className={`w-1 h-1 rounded-full ${demande.statut === 'validee' ? 'bg-green-500' : demande.statut === 'rejetee' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                                            {demande.statut.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right relative">
                                        <div className={`flex items-center justify-end gap-2 transition-opacity ${activeMenu === demande.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <Link 
                                                href={`/citoyen/mes-dossiers/${demande.uuid}`} 
                                                className="p-2.5 bg-white border-2 border-slate-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                                                title="Voir les détails"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setActiveMenu(activeMenu === demande.id ? null : demande.id)}
                                                    className={`p-2.5 border-2 rounded-xl transition-all shadow-sm ${activeMenu === demande.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                                {activeMenu === demande.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                                                        <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                            <div className="p-2">
                                                                <button 
                                                                    onClick={() => handleDownload(demande.numero_dossier)}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-all uppercase tracking-widest text-left"
                                                                >
                                                                    <Download size={14} className="text-slate-400" />
                                                                    Télécharger
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleContact(demande.agent)}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all uppercase tracking-widest text-left"
                                                                >
                                                                    <MessageSquare size={14} />
                                                                    Contacter agent
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4">
                                                <FileText size={32} />
                                            </div>
                                            <h3 className="font-black text-slate-900 text-sm mb-1">Aucun dossier trouvé</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Veuillez ajuster vos critères de recherche.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                <div className="px-8 py-5 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
                        {filteredDemandes.length} dossier(s) — page {safePage}/{totalPages}
                    </p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                                className="px-5 py-2 bg-white border-2 border-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-indigo-600/30 hover:text-indigo-600 transition-all disabled:text-slate-300 disabled:cursor-not-allowed"
                            >
                                Précédent
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-5 py-2 border-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                        p === safePage
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                            : 'bg-white border-slate-50 text-slate-400 hover:border-indigo-600/30 hover:text-indigo-600'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={safePage === totalPages}
                                className="px-5 py-2 bg-white border-2 border-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-indigo-600/30 hover:text-indigo-600 transition-all disabled:text-slate-300 disabled:cursor-not-allowed"
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </CitizenLayout>
    );
}
