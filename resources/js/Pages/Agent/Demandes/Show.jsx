import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AgentLayout from '@/Layouts/AgentLayout';
import axios from 'axios';
import {
    ChevronLeft,
    Calendar,
    User,
    FileText,
    MessageSquare,
    History,
    CheckCircle,
    XCircle,
    Play,
    Loader2,
    MoreHorizontal,
    ExternalLink,
    Clock,
    Zap,
    Printer,
    Download,
    Info,
    MapPin,
    Heart,
    ShieldCheck,
    AlertCircle,
    StickyNote,
    Send,
    AlertTriangle,
    X,
    Eye
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Show({ uuid }) {
    const [demande, setDemande]             = useState(null);
    const [loading, setLoading]             = useState(true);
    const [isAssigning, setIsAssigning]     = useState(false);
    const [isUpdating, setIsUpdating]       = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);

    // Reject flow
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [motifRejet, setMotifRejet]         = useState('');

    // Pièces manquantes flow
    const [showPieceForm, setShowPieceForm]   = useState(false);
    const [pieceManquante, setPieceManquante] = useState('');

    // Notes internes
    const [noteText, setNoteText]             = useState('');
    const [isAddingNote, setIsAddingNote]     = useState(false);
    const [previewImage, setPreviewImage]     = useState(null);

    // Secure messenger chat & RDV state
    const [showChatDrawer, setShowChatDrawer] = useState(false);
    const [chatMessages, setChatMessages]     = useState([]);
    const [chatMessageText, setChatMessageText] = useState('');
    const [chatSending, setChatSending]       = useState(false);
    const [rdv, setRdv]                       = useState(null);

    useEffect(() => {
        fetchDemande();
        fetchRdv();
    }, [uuid]);

    useEffect(() => {
        let interval;
        if (showChatDrawer) {
            fetchChatMessages();
            interval = setInterval(fetchChatMessages, 4000);
        }
        return () => clearInterval(interval);
    }, [uuid, showChatDrawer]);

    const fetchChatMessages = async () => {
        try {
            const response = await axios.get(`/api/v1/messages/dossiers/${uuid}`, { withCredentials: true });
            setChatMessages(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des messages.");
        }
    };

    const fetchRdv = async () => {
        try {
            const response = await axios.get(`/api/v1/demandes/${uuid}/rdv`, { withCredentials: true });
            setRdv(response.data);
        } catch (error) {
            console.error("Erreur RDV");
        }
    };

    const handleSendChatMessage = async (e) => {
        e.preventDefault();
        if (!chatMessageText.trim() || chatSending) return;
        setChatSending(true);
        try {
            const response = await axios.post(`/api/v1/messages/dossiers/${uuid}`, {
                contenu: chatMessageText.trim()
            }, { withCredentials: true });
            setChatMessages(prev => [...prev, response.data]);
            setChatMessageText('');
            setTimeout(() => {
                const el = document.getElementById('chat-body');
                if (el) el.scrollTop = el.scrollHeight;
            }, 150);
        } catch {
            toast.error("Impossible d'envoyer le message.");
        } finally {
            setChatSending(false);
        }
    };

    const fetchDemande = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/v1/agent/demandes/${uuid}`, { withCredentials: true });
            setDemande(response.data);
        } catch {
            toast.error("Impossible de charger le dossier.");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        setIsAssigning(true);
        try {
            await axios.post(`/api/v1/agent/demandes/${uuid}/assign`, {}, { withCredentials: true });
            toast.success('Dossier assigné avec succès !');
            fetchDemande();
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur d'assignation.");
        } finally {
            setIsAssigning(false);
        }
    };

    const handleValider = async () => {
        setIsUpdating(true);
        try {
            await axios.patch(`/api/v1/agent/demandes/${uuid}/statut`, {
                statut: 'validee',
                commentaire: 'Dossier validé par l\'agent.'
            }, { withCredentials: true });
            toast.success('Dossier validé avec succès !');
            fetchDemande();
        } catch {
            toast.error("Erreur lors de la validation.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRejeter = async () => {
        if (!motifRejet.trim()) {
            toast.error("Le motif de rejet est obligatoire.");
            return;
        }
        setIsUpdating(true);
        try {
            await axios.patch(`/api/v1/agent/demandes/${uuid}/statut`, {
                statut: 'rejetee',
                motif_rejet: motifRejet.trim(),
                commentaire: motifRejet.trim()
            }, { withCredentials: true });
            toast.success('Dossier rejeté.');
            setShowRejectForm(false);
            setMotifRejet('');
            fetchDemande();
        } catch {
            toast.error("Erreur lors du rejet.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePieceManquante = async () => {
        if (!pieceManquante.trim()) {
            toast.error("Précisez la pièce manquante.");
            return;
        }
        setIsUpdating(true);
        try {
            await axios.patch(`/api/v1/agent/demandes/${uuid}/statut`, {
                statut: 'document_manquant',
                piece_manquante: pieceManquante.trim(),
                commentaire: 'Pièce complémentaire requise.'
            }, { withCredentials: true });
            toast.success('Demande de pièce complémentaire envoyée au citoyen.');
            setShowPieceForm(false);
            setPieceManquante('');
            setShowActionsMenu(false);
            fetchDemande();
        } catch {
            toast.error("Erreur lors de l'envoi.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddNote = async () => {
        if (!noteText.trim()) {
            toast.error("La note ne peut pas être vide.");
            return;
        }
        setIsAddingNote(true);
        try {
            await axios.post(`/api/v1/agent/demandes/${uuid}/notes`, {
                note: noteText.trim()
            }, { withCredentials: true });
            toast.success('Note interne ajoutée.');
            setNoteText('');
            fetchDemande();
        } catch {
            toast.error("Erreur lors de l'ajout de la note.");
        } finally {
            setIsAddingNote(false);
        }
    };

    const handlePrint = () => {
        toast.info("Préparation du document pour l'impression...");
        setTimeout(() => window.print(), 800);
    };

    const handleCloseDossier = async () => {
        setIsUpdating(true);
        try {
            await axios.post(`/api/v1/agent/demandes/${uuid}/close`, {}, { withCredentials: true });
            toast.success('Dossier marqué comme remis avec succès !');
            fetchDemande();
        } catch {
            toast.error("Erreur lors de la clôture du dossier.");
        } finally {
            setIsUpdating(false);
        }
    };

    const renderStructuredData = () => {
        if (!demande) return null;

        const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block";
        const valClass   = "text-[12px] font-bold text-slate-900";
        const gridClass  = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-8 bg-slate-50/50 rounded-3xl border border-slate-100";

        if (demande.type_demande?.code === 'ACTE_NAISSANCE' && demande.naissance) {
            const n = demande.naissance;
            return (
                <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-indigo-500/10">
                        <User size={18} className="text-indigo-600" />
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Données État Civil (Naissance)</h4>
                    </div>
                    <div className={gridClass}>
                        <div><span className={labelClass}>Nom Titulaire</span><p className={valClass}>{n.nom}</p></div>
                        <div><span className={labelClass}>Prénom(s)</span><p className={valClass}>{n.prenoms}</p></div>
                        <div><span className={labelClass}>Date de naissance</span><p className={valClass}>{n.date_naissance}</p></div>
                        <div><span className={labelClass}>Lieu de naissance</span><p className={valClass}>{n.lieu_naissance}</p></div>
                        <div><span className={labelClass}>Genre</span><p className={valClass}>{n.genre === 'M' ? 'Masculin' : 'Féminin'}</p></div>
                        <div><span className={labelClass}>Motif</span><p className={valClass}>{n.motif}</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-indigo-50/30 rounded-3xl border border-indigo-100/50">
                            <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-2"><Info size={14} /> Filiation Paternelle</h5>
                            <div className="space-y-4">
                                <div><span className={labelClass}>Nom & Prénom</span><p className={valClass}>{n.prenom_pere} {n.nom_pere}</p></div>
                                <div><span className={labelClass}>Profession</span><p className={valClass}>{n.profession_pere}</p></div>
                            </div>
                        </div>
                        <div className="p-8 bg-rose-50/30 rounded-3xl border border-rose-100/50">
                            <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-6 flex items-center gap-2"><Heart size={14} /> Filiation Maternelle</h5>
                            <div className="space-y-4">
                                <div><span className={labelClass}>Nom & Prénom</span><p className={valClass}>{n.prenom_mere} {n.nom_mere}</p></div>
                                <div><span className={labelClass}>Profession</span><p className={valClass}>{n.profession_mere}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (demande.type_demande?.code === 'CERTIFICAT_RESIDENCE' && demande.residence) {
            const r = demande.residence;
            return (
                <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-emerald-500/10">
                        <MapPin size={18} className="text-emerald-600" />
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Données Résidence</h4>
                    </div>
                    <div className={gridClass}>
                        <div><span className={labelClass}>Nom & Prénoms</span><p className={valClass}>{r.prenoms} {r.nom}</p></div>
                        <div><span className={labelClass}>Quartier / Commune</span><p className={valClass}>{r.quartier_commune}</p></div>
                        <div><span className={labelClass}>Durée de résidence</span><p className={valClass}>{r.duree_residence}</p></div>
                        <div className="col-span-full"><span className={labelClass}>Adresse complète</span><p className={valClass}>{r.adresse_complete}</p></div>
                    </div>
                </div>
            );
        }

        if (demande.type_demande?.code === 'CERTIFICAT_MARIAGE' && demande.mariage) {
            const m = demande.mariage;
            return (
                <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-pink-500/10">
                        <Heart size={18} className="text-pink-600" />
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Données Mariage</h4>
                    </div>
                    <div className={gridClass}>
                        <div><span className={labelClass}>Époux — Nom & Prénom</span><p className={valClass}>{m.prenom_epoux} {m.nom_epoux}</p></div>
                        <div><span className={labelClass}>Épouse — Nom & Prénom</span><p className={valClass}>{m.prenom_epouse} {m.nom_epouse}</p></div>
                        <div><span className={labelClass}>Date du mariage</span><p className={valClass}>{m.date_mariage}</p></div>
                        <div><span className={labelClass}>Lieu du mariage</span><p className={valClass}>{m.lieu_mariage}</p></div>
                    </div>
                </div>
            );
        }

        if (demande.type_demande?.code === 'LEGALISATION_DOCUMENT' && demande.legalisation) {
            const l = demande.legalisation;
            return (
                <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-violet-500/10">
                        <ShieldCheck size={18} className="text-violet-600" />
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Données Légalisation</h4>
                    </div>
                    <div className={gridClass}>
                        <div><span className={labelClass}>Type de document</span><p className={valClass}>{l.type_document}</p></div>
                        <div><span className={labelClass}>Pays de destination</span><p className={valClass}>{l.pays_destination}</p></div>
                        <div><span className={labelClass}>Nombre de copies</span><p className={valClass}>{l.nombre_copies}</p></div>
                        {l.usage_prevu && <div><span className={labelClass}>Usage prévu</span><p className={valClass}>{l.usage_prevu}</p></div>}
                        {l.description_document && (
                            <div className="col-span-full"><span className={labelClass}>Description du document</span><p className={valClass}>{l.description_document}</p></div>
                        )}
                    </div>
                </div>
            );
        }

        if (demande.type_demande?.code === 'AUTORISATION_ADMINISTRATIVE' && demande.autorisation) {
            const a = demande.autorisation;
            return (
                <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-500/10">
                        <AlertCircle size={18} className="text-amber-600" />
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Autorisation Administrative</h4>
                    </div>
                    <div className={gridClass}>
                        <div><span className={labelClass}>Nature de l'autorisation</span><p className={valClass}>{a.nature_autorisation}</p></div>
                        <div><span className={labelClass}>Adresse de l'activité</span><p className={valClass}>{a.adresse_activite}</p></div>
                        <div><span className={labelClass}>Date de début</span><p className={valClass}>{a.date_debut}</p></div>
                        {a.date_fin && <div><span className={labelClass}>Date de fin</span><p className={valClass}>{a.date_fin}</p></div>}
                        {a.nombre_personnes && <div><span className={labelClass}>Nombre de personnes</span><p className={valClass}>{a.nombre_personnes}</p></div>}
                        {a.description_detaillee && (
                            <div className="col-span-full"><span className={labelClass}>Description détaillée</span><p className={valClass}>{a.description_detaillee}</p></div>
                        )}
                    </div>
                </div>
            );
        }

        const changement = demande.changement_adresse || demande.changementAdresse;
        if (demande.type_demande?.code === 'CHANGEMENT_ADRESSE' && changement) {
            const c = changement;
            return (
                <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-cyan-500/10">
                        <MapPin size={18} className="text-cyan-600" />
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Changement d'Adresse</h4>
                    </div>
                    <div className={gridClass}>
                        <div><span className={labelClass}>Ancienne adresse</span><p className={valClass}>{c.ancienne_adresse}</p></div>
                        <div><span className={labelClass}>Nouvelle adresse</span><p className={valClass}>{c.nouvelle_adresse}</p></div>
                        <div><span className={labelClass}>Date d'installation</span><p className={valClass}>{c.date_installation}</p></div>
                        {c.quartier_commune_nouveau && <div><span className={labelClass}>Nouveau quartier / commune</span><p className={valClass}>{c.quartier_commune_nouveau}</p></div>}
                        {c.motif_changement && (
                            <div className="col-span-full"><span className={labelClass}>Motif du changement</span><p className={valClass}>{c.motif_changement}</p></div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="p-10 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
                <FileText size={40} className="text-slate-300 mx-auto mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aucune donnée structurée supplémentaire</p>
            </div>
        );
    };

    if (loading) {
        return (
            <AgentLayout title="Chargement...">
                <div className="flex flex-col items-center justify-center min-h-[70vh]">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="animate-spin text-indigo-600" size={32} />
                        </div>
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-8">Analyse des données en cours...</p>
                </div>
            </AgentLayout>
        );
    }

    if (!demande) return (
        <AgentLayout title="Erreur">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <XCircle size={48} className="text-rose-500 mb-4" />
                <p className="text-slate-900 font-black">Dossier introuvable ou accès refusé.</p>
                <Link href="/agent/demandes" className="mt-4 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">Retour à la liste</Link>
            </div>
        </AgentLayout>
    );

    const isClosed = demande.statut === 'validee' || demande.statut === 'rejetee' || demande.statut === 'remise';

    return (
        <AgentLayout title={`Dossier ${demande.numero_dossier}`}>
            <Head title={`Détails ${demande.numero_dossier}`} />
            <Toaster position="top-right" richColors />

            <div className="bg-slate-50 min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 pb-20">
                {/* Header Bar */}
                <div className="bg-white border-b border-slate-100 px-8 py-6 sticky top-0 z-30 shadow-sm">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Link href="/agent/demandes" className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-inner group">
                                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-xl font-black text-slate-900 tracking-tight">{demande.numero_dossier}</h1>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 flex items-center gap-2 ${
                                        demande.statut === 'validee'          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        demande.statut === 'rejetee'          ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                        demande.statut === 'remise'           ? 'bg-violet-50 text-violet-600 border-violet-100' :
                                        demande.statut === 'document_manquant'? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        'bg-indigo-50 text-indigo-600 border-indigo-100'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                            demande.statut === 'validee'           ? 'bg-emerald-500' :
                                            demande.statut === 'rejetee'           ? 'bg-rose-500' :
                                            demande.statut === 'remise'            ? 'bg-violet-500' :
                                            demande.statut === 'document_manquant' ? 'bg-amber-500' :
                                            'bg-indigo-500 animate-pulse'
                                        }`} />
                                        {demande.statut.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {demande.type_demande?.libelle} • Déposé le {new Date(demande.created_at).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePrint}
                                className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
                                title="Imprimer"
                            >
                                <Printer size={20} />
                            </button>
                            <div className="w-px h-8 bg-slate-100 mx-2" />
                            {/* Actions dropdown — uniquement si dossier non clôturé */}
                            {!isClosed && (
                                <div className="relative">
                                    <button
                                        onClick={() => { setShowActionsMenu(!showActionsMenu); setShowPieceForm(false); }}
                                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
                                    >
                                        <MoreHorizontal size={18} /> Actions
                                    </button>
                                    {showActionsMenu && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => { setShowActionsMenu(false); setShowPieceForm(false); }} />
                                            <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                                                <div className="p-2 space-y-1">
                                                    <button
                                                        onClick={() => setShowPieceForm(!showPieceForm)}
                                                        className="w-full text-left px-4 py-3 text-[10px] font-black text-slate-600 hover:bg-slate-50 rounded-xl uppercase tracking-widest transition-colors flex items-center gap-2"
                                                    >
                                                        <FileText size={14} className="text-amber-500" /> Demander pièce manquante
                                                    </button>
                                                </div>
                                                {showPieceForm && (
                                                    <div className="px-4 pb-4 space-y-3 border-t border-slate-50 pt-3">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pièce requise *</p>
                                                        <textarea
                                                            value={pieceManquante}
                                                            onChange={e => setPieceManquante(e.target.value)}
                                                            placeholder="Ex: Copie de la CNI, acte de naissance..."
                                                            rows={3}
                                                            className="w-full text-xs border border-amber-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50/30"
                                                        />
                                                        <button
                                                            onClick={handlePieceManquante}
                                                            disabled={isUpdating}
                                                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                                        >
                                                            {isUpdating ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                                            Notifier le citoyen
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-8 mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Pièce manquante */}
                            {demande.statut === 'document_manquant' && demande.piece_manquante && (
                                <div className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-6 flex items-start gap-4">
                                    <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Document requis par le citoyen</p>
                                        <p className="text-sm text-amber-900 font-bold">{demande.piece_manquante}</p>
                                        <p className="text-[9px] text-amber-500 uppercase tracking-widest mt-2 font-black">
                                            En attente de la pièce — le citoyen a été notifié
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Motif rejet affiché si dossier rejeté */}
                            {demande.statut === 'rejetee' && demande.motif_rejet && (
                                <div className="bg-rose-50 border border-rose-200 rounded-[2rem] p-6 flex items-start gap-4">
                                    <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Motif de rejet</p>
                                        <p className="text-sm text-rose-800 font-bold">{demande.motif_rejet}</p>
                                    </div>
                                </div>
                            )}

                            {/* Structured Data */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10">
                                    {renderStructuredData()}

                                    {/* Documents */}
                                    <div className="mt-12 pt-10 border-t border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <Download size={14} className="text-indigo-500" />
                                            Documents Justificatifs ({demande.documents?.length || 0})
                                        </p>
                                        {demande.documents?.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {demande.documents.map((doc) => {
                                                    const isImage = doc.type_mime?.startsWith('image/') || 
                                                                    /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.nom_original || doc.nom_fichier || '');
                                                    return (
                                                        <div
                                                            key={doc.id}
                                                            onClick={() => {
                                                                if (isImage) {
                                                                    setPreviewImage(doc);
                                                                } else {
                                                                    window.open(`/api/v1/documents/${doc.id}/download`, '_blank');
                                                                }
                                                            }}
                                                            className="flex items-center justify-between p-5 border border-slate-50 bg-slate-50/50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all cursor-pointer group shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white/20 group-hover:text-white shrink-0 border border-slate-100">
                                                                    {isImage ? (
                                                                        <img 
                                                                            src={`/api/v1/documents/${doc.id}/download`} 
                                                                            alt="Aperçu" 
                                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                                            onError={(e) => { e.target.src = ''; e.target.className = 'hidden'; }}
                                                                        />
                                                                    ) : (
                                                                        <FileText size={18} />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <span className="text-[11px] font-black uppercase tracking-tight block truncate max-w-[150px]">
                                                                        {doc.nom_original || doc.nom_fichier}
                                                                    </span>
                                                                    <span className="text-[9px] text-slate-400 group-hover:text-white/70 block mt-0.5">
                                                                        {isImage ? 'Aperçu disponible (cliquer)' : 'Télécharger le document'}
                                                                        {doc.taille_octets && ` • ${(doc.taille_octets / 1024).toFixed(1)} KB`}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                {isImage && (
                                                                    <div className="p-2 bg-slate-100/80 rounded-lg text-slate-500 group-hover:bg-white/20 group-hover:text-white transition-all">
                                                                        <Eye size={12} />
                                                                    </div>
                                                                )}
                                                                <a 
                                                                    href={`/api/v1/documents/${doc.id}/download`} 
                                                                    download
                                                                    onClick={(e) => e.stopPropagation()} 
                                                                    className="p-2 hover:bg-slate-200/50 rounded-lg text-slate-400 group-hover:text-white transition-colors"
                                                                >
                                                                    <Download size={14} />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-slate-50 rounded-2xl text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucun document joint</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* History Timeline */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                                <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                        <History size={20} />
                                    </div>
                                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Traçabilité du dossier</h3>
                                </div>
                                <div className="p-10">
                                    <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                        {demande.historique_statuts?.length > 0 ? demande.historique_statuts.map((h) => (
                                            <div key={h.id} className="relative pl-12 group">
                                                <div className={`absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 z-10 ${
                                                    h.nouveau_statut === 'validee'           ? 'bg-emerald-500 shadow-emerald-500/20' :
                                                    h.nouveau_statut === 'rejetee'           ? 'bg-rose-500 shadow-rose-500/20' :
                                                    h.nouveau_statut === 'document_manquant' ? 'bg-amber-500 shadow-amber-500/20' :
                                                    'bg-indigo-600 shadow-indigo-600/20'
                                                }`}>
                                                    <CheckCircle size={20} />
                                                </div>
                                                <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 group-hover:border-indigo-100 transition-all">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                                                                {h.nouveau_statut.replace(/_/g, ' ')}
                                                            </p>
                                                            <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                                                                {h.user?.prenom}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase italic">
                                                            {new Date(h.created_at).toLocaleString('fr-FR')}
                                                        </p>
                                                    </div>
                                                    {h.commentaire && (
                                                        <p className="text-xs text-slate-600 font-bold leading-relaxed italic border-l-2 border-slate-200 pl-4 py-1">
                                                            "{h.commentaire}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="relative pl-12">
                                                <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 z-10">
                                                    <Clock size={20} />
                                                </div>
                                                <div className="p-6">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucun historique disponible.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes internes */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                                <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                        <StickyNote size={20} />
                                    </div>
                                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Notes internes (agents uniquement)</h3>
                                </div>
                                <div className="p-10 space-y-6">
                                    {demande.notes_internes ? (
                                        <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-6">
                                            <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">{demande.notes_internes}</pre>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center py-4">Aucune note interne pour ce dossier.</p>
                                    )}
                                    <div className="space-y-3">
                                        <textarea
                                            value={noteText}
                                            onChange={e => setNoteText(e.target.value)}
                                            placeholder="Ajouter une note interne (visible uniquement par les agents)..."
                                            rows={3}
                                            className="w-full text-xs border border-slate-200 rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                        />
                                        <button
                                            onClick={handleAddNote}
                                            disabled={isAddingNote || !noteText.trim()}
                                            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                                        >
                                            {isAddingNote ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                            Ajouter la note
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-10">
                            {/* Decision Panel */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 sticky top-32">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-slate-50 flex items-center gap-3">
                                    <Zap size={14} className="text-indigo-500" />
                                    Panneau de décision
                                </h3>

                                <div className="space-y-4">
                                    {/* Dossier non assigné */}
                                    {!demande.agent_id && (
                                        <button
                                            onClick={handleAssign}
                                            disabled={isAssigning}
                                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            {isAssigning ? <Loader2 className="animate-spin" size={20} /> : <Play size={18} />}
                                            Prendre en charge
                                        </button>
                                    )}

                                    {/* Dossier actif → actions disponibles */}
                                    {demande.agent_id && !isClosed && (
                                        <div className="space-y-4">
                                            {/* Valider */}
                                            <button
                                                onClick={handleValider}
                                                disabled={isUpdating}
                                                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={18} />}
                                                Valider le dossier
                                            </button>

                                            {/* Rejeter — deux étapes */}
                                            {!showRejectForm ? (
                                                <button
                                                    onClick={() => setShowRejectForm(true)}
                                                    disabled={isUpdating}
                                                    className="w-full py-5 bg-white border-2 border-rose-100 text-rose-500 hover:bg-rose-50 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3"
                                                >
                                                    <XCircle size={18} /> Rejeter / Refuser
                                                </button>
                                            ) : (
                                                <div className="bg-rose-50 border border-rose-200 rounded-[2rem] p-5 space-y-4">
                                                    <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                                                        <AlertTriangle size={12} /> Motif de rejet *
                                                    </p>
                                                    <textarea
                                                        value={motifRejet}
                                                        onChange={e => setMotifRejet(e.target.value)}
                                                        placeholder="Expliquez le motif du rejet (obligatoire)..."
                                                        rows={4}
                                                        className="w-full text-xs border border-rose-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => { setShowRejectForm(false); setMotifRejet(''); }}
                                                            className="flex-1 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                                        >
                                                            Annuler
                                                        </button>
                                                        <button
                                                            onClick={handleRejeter}
                                                            disabled={isUpdating || !motifRejet.trim()}
                                                            className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                                        >
                                                            {isUpdating ? <Loader2 className="animate-spin" size={12} /> : <XCircle size={12} />}
                                                            Confirmer
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Dossier clôturé */}
                                    {isClosed && (
                                        <div className={`p-5 rounded-[2rem] border-2 text-center ${
                                            demande.statut === 'remise' ? 'bg-violet-50 border-violet-200' :
                                            demande.statut === 'validee' ? 'bg-emerald-50 border-emerald-200' :
                                            'bg-rose-50 border-rose-200'
                                        }`}>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${
                                                demande.statut === 'remise' ? 'text-violet-600' :
                                                demande.statut === 'validee' ? 'text-emerald-600' : 
                                                'text-rose-600'
                                            }`}>
                                                {demande.statut === 'remise' ? '✓ Dossier remis (Clos)' : 
                                                 demande.statut === 'validee' ? '✓ Dossier validé' : 
                                                 '✗ Dossier rejeté'}
                                            </p>
                                            {demande.date_cloture && (
                                                <p className="text-[9px] text-slate-400 mt-1">
                                                    Clôturé le {new Date(demande.date_cloture).toLocaleDateString('fr-FR')}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {demande.statut === 'validee' && demande.is_physical_pickup && (
                                        <button
                                            onClick={handleCloseDossier}
                                            disabled={isUpdating}
                                            className="w-full mt-4 py-5 bg-violet-600 hover:bg-violet-700 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-violet-600/20 active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={18} />}
                                            Marquer comme remis
                                        </button>
                                    )}

                                    {/* Responsable */}
                                    {demande.agent_id && (
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center mt-2">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Agent responsable</p>
                                            <p className="text-sm font-black text-slate-700 mt-1">
                                                {demande.agent?.prenom} {demande.agent?.nom}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setShowChatDrawer(true)}
                                        className="w-full py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-[2rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 mt-4 border border-indigo-100/50"
                                    >
                                        <MessageSquare size={16} /> Ouvrir la Messagerie Directe
                                    </button>

                                    {/* QR Code de Sécurisation */}
                                    {demande.statut === 'validee' && (
                                        <div className="relative mt-6 bg-slate-950 text-white rounded-[2rem] border border-slate-800 shadow-xl p-8 text-center space-y-4 overflow-hidden group">
                                            {/* Ticket cuts (Hollow circle effect) */}
                                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-slate-50 rounded-full border border-slate-800 z-20"></div>
                                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-slate-50 rounded-full border border-slate-800 z-20"></div>

                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <ShieldCheck size={48} className="text-emerald-400" />
                                            </div>

                                            <div>
                                                <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest mb-1 border border-emerald-500/20">
                                                    ✔ Acte Authentifié
                                                </span>
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Ticket de Garantie</h3>
                                            </div>

                                            <div className="border-t border-dashed border-slate-800 my-4 relative">
                                                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 bg-slate-950 text-[7px] text-slate-500 font-bold uppercase tracking-[0.25em]">
                                                    SÉCURITÉ ÉTAT CIVIL
                                                </span>
                                            </div>

                                            <div className="flex justify-center bg-white p-3 rounded-2xl border border-slate-800 shadow-inner max-w-[140px] mx-auto group-hover:scale-105 transition-transform duration-300">
                                                <img 
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                                                        `┌─────────────────────────────────┐\n│      RÉPUBLIQUE DE GUINÉE       │\n│     - SMART E-MAIRIE TICKET -   │\n├─────────────────────────────────┤\n│ DOSSIER  : ${demande.numero_dossier.padEnd(20)} │\n│ SERVICE  : ${(demande.type_demande?.libelle || 'Civil').padEnd(20)} │\n│ TITULAIRE: ${((demande.user?.prenom || '') + ' ' + (demande.user?.nom || '')).substring(0, 20).padEnd(20)} │\n│ STATUT   : VALIDE & AUTHENTIQUE │\n│ DATE     : ${new Date(demande.updated_at).toLocaleDateString('fr-FR').padEnd(20)} │\n│ SIGNATURE: ${(demande.agent ? (demande.agent.prenom + ' ' + demande.agent.nom) : 'Officier').substring(0, 20).padEnd(20)} │\n├─────────────────────────────────┤\n│      EMPREINTE DE SÉCURITÉ      │\n│  ${(demande.uuid || uuid).substring(0,28)}  │\n└─────────────────────────────────┘`
                                                    )}`} 
                                                    alt="QR Code de vérification" 
                                                    className="w-32 h-32"
                                                />
                                            </div>

                                            <p className="text-[9px] text-slate-400 max-w-[200px] mx-auto leading-relaxed pt-2">
                                                Scannez ce ticket de sécurité pour valider l'authenticité de l'acte hors-ligne.
                                            </p>

                                            <div className="pt-2">
                                                <a 
                                                    href={`/verify/demandes/${demande.uuid || uuid}`} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest hover:underline flex items-center justify-center gap-1"
                                                >
                                                    <ExternalLink size={10} /> Consulter en ligne
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Statut Rendez-vous Retrait */}
                                    {demande.statut === 'validee' && rdv && (
                                        <div className="mt-4 p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] text-center space-y-2">
                                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-2">
                                                <Calendar size={14} />
                                                Retrait Physique Planifié
                                            </p>
                                            <p className="text-xs font-black text-slate-800">
                                                Le {new Date(rdv.date_rdv).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <p className="text-[14px] font-black text-emerald-600">
                                                à {new Date(rdv.date_rdv).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <span className="inline-block px-3 py-1 bg-emerald-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest mt-1">
                                                ✓ Confirmé
                                            </span>
                                        </div>
                                    )}
                                    
                                    {demande.statut === 'validee' && !rdv && (
                                        <div className="mt-4 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 mb-1">
                                                <Calendar size={14} />
                                                Retrait de l'acte
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                                En attente de réservation d'un créneau par le citoyen pour le retrait.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Émetteur */}
                                <div className="mt-12 pt-10 border-t border-slate-50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        Émetteur du dossier
                                    </p>
                                    <div className="bg-slate-50/50 rounded-[2.5rem] p-6 border border-slate-100 group">
                                        <div className="flex items-center gap-5 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-slate-900/20 group-hover:rotate-6 transition-transform">
                                                {demande.user?.prenom?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{demande.user?.prenom} {demande.user?.nom}</p>
                                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">ID: #{demande.user?.id}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-50 overflow-hidden">
                                                <User className="text-slate-300 shrink-0" size={14} />
                                                <span className="text-[10px] font-black text-slate-700 truncate">{demande.user?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-50">
                                                <Calendar className="text-slate-300" size={14} />
                                                <span className="text-[10px] font-black text-slate-700">{demande.user?.telephone || 'Non renseigné'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de prévisualisation d'image en pleine résolution */}
            {previewImage && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
                    <div className="absolute inset-0" onClick={() => setPreviewImage(null)} />
                    <div className="relative max-w-4xl w-full bg-white/5 border border-white/10 rounded-[3rem] p-6 flex flex-col items-center gap-6 shadow-2xl z-10">
                        {/* Close button */}
                        <button 
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95"
                        >
                            <X size={20} />
                        </button>

                        {/* Title and metadata */}
                        <div className="text-center text-white px-10">
                            <h4 className="text-sm font-black uppercase tracking-wider">{previewImage.nom_original || previewImage.nom_fichier}</h4>
                            <p className="text-xs text-white/50 mt-1">
                                Pièce jointe du dossier • {(previewImage.taille_octets / 1024).toFixed(1)} KB
                            </p>
                        </div>

                        {/* Large Image container */}
                        <div className="w-full max-h-[60vh] rounded-[2rem] overflow-hidden border border-white/10 bg-slate-900/50 flex items-center justify-center p-2">
                            <img 
                                src={`/api/v1/documents/${previewImage.id}/download`} 
                                alt="Plein écran" 
                                className="max-w-full max-h-[58vh] object-contain rounded-xl"
                            />
                        </div>

                        {/* Quick actions */}
                        <div className="flex gap-4">
                            <a 
                                href={`/api/v1/documents/${previewImage.id}/download`} 
                                download
                                className="px-8 py-3 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl"
                            >
                                <Download size={14} />
                                Télécharger
                            </a>
                            <button 
                                onClick={() => setPreviewImage(null)}
                                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Fermer l'aperçu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Volet de Chat Coulissant (Messagerie Directe Citoyen ↔ Agent) */}
            <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300 ${
                showChatDrawer ? 'translate-x-0' : 'translate-x-full'
            }`}>
                {/* Header */}
                <div className="p-6 border-b border-slate-850 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                            {demande?.user?.prenom?.[0] || 'C'}
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-white tracking-tight uppercase">
                                {demande?.user?.prenom} {demande?.user?.nom}
                            </h4>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                                Dossier #{demande?.numero_dossier}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowChatDrawer(false)}
                        className="w-10 h-10 bg-slate-905 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-xl flex items-center justify-center transition-all active:scale-95"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body Messages */}
                <div 
                    id="chat-body" 
                    className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {chatMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <MessageSquare className="text-indigo-500 mb-3 animate-bounce" size={32} />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                Aucun message
                            </p>
                            <p className="text-[9px] text-slate-500 mt-1 max-w-[200px]">
                                Envoyez un message pour démarrer la discussion directe avec le citoyen sur ce dossier.
                            </p>
                        </div>
                    ) : (
                        chatMessages.map((msg, index) => {
                            const isMe = msg.sender_id !== demande?.user_id;
                            return (
                                <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
                                            {isMe ? 'Vous (Agent)' : `${msg.sender?.prenom} (Citoyen)`}
                                        </span>
                                    </div>
                                    <div className={`max-w-[85%] rounded-[1.5rem] px-5 py-3 text-xs leading-relaxed ${
                                        isMe 
                                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                                            : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'
                                    }`}>
                                        <p className="whitespace-pre-wrap">{msg.contenu}</p>
                                    </div>
                                    <span className="text-[8px] text-slate-600 mt-1">
                                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Form Footer */}
                <form onSubmit={handleSendChatMessage} className="p-6 border-t border-slate-850 bg-slate-900/30">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={chatMessageText}
                            onChange={e => setChatMessageText(e.target.value)}
                            placeholder="Écrivez votre message ici..."
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            disabled={chatSending}
                        />
                        <button
                            type="submit"
                            disabled={chatSending || !chatMessageText.trim()}
                            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-indigo-600/20 shrink-0"
                        >
                            {chatSending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                        </button>
                    </div>
                </form>
            </div>
        </AgentLayout>
    );
}
