import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';
import axios from 'axios';
import {
    ChevronLeft,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Download,
    Printer,
    MessageSquare,
    Calendar,
    ShieldCheck,
    MoreHorizontal,
    ArrowRight,
    UserCheck,
    Info,
    ExternalLink,
    Send,
    Loader2,
    X
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Show({ auth, demande }) {
    const [showChatDrawer, setShowChatDrawer] = useState(false);
    const [chatMessages, setChatMessages]     = useState([]);
    const [chatMessageText, setChatMessageText] = useState('');
    const [chatSending, setChatSending]       = useState(false);

    // RDV States
    const [rdv, setRdv]                       = useState(null);
    const [availableDays, setAvailableDays]   = useState([]);
    const [selectedDay, setSelectedDay]       = useState(null); // The day object
    const [selectedSlot, setSelectedSlot]     = useState(null); // The slot object
    const [rdvLoading, setRdvLoading]         = useState(false);
    const [rdvNotes, setRdvNotes]             = useState('');

    useEffect(() => {
        fetchRdv();
    }, [demande]);

    useEffect(() => {
        let interval;
        if (showChatDrawer) {
            fetchChatMessages();
            interval = setInterval(fetchChatMessages, 4000);
        }
        return () => clearInterval(interval);
    }, [showChatDrawer]);

    const fetchChatMessages = async () => {
        try {
            const response = await axios.get(`/api/v1/messages/dossiers/${demande.uuid}`, { withCredentials: true });
            setChatMessages(response.data);
        } catch (error) {
            console.error("Erreur messages");
        }
    };

    const fetchRdv = async () => {
        try {
            const response = await axios.get(`/api/v1/demandes/${demande.uuid}/rdv`, { withCredentials: true });
            setRdv(response.data);
            if (!response.data && demande.statut === 'validee') {
                fetchAvailableSlots();
            }
        } catch (error) {
            console.error("Erreur rdv");
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const response = await axios.get(`/api/v1/demandes/${demande.uuid}/slots`, { withCredentials: true });
            setAvailableDays(response.data);
            if (response.data.length > 0) {
                setSelectedDay(response.data[0]);
            }
        } catch (error) {
            console.error("Erreur slots");
        }
    };

    const handleSendChatMessage = async (e) => {
        e.preventDefault();
        if (!chatMessageText.trim() || chatSending) return;
        setChatSending(true);
        try {
            const response = await axios.post(`/api/v1/messages/dossiers/${demande.uuid}`, {
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

    const handleBookRdv = async () => {
        if (!selectedSlot) {
            toast.error("Veuillez sélectionner un créneau horaire.");
            return;
        }
        setRdvLoading(true);
        try {
            const response = await axios.post(`/api/v1/demandes/${demande.uuid}/rdv`, {
                date_rdv: selectedSlot.raw_datetime,
                notes: rdvNotes.trim() || 'Retrait de l\'acte civil'
            }, { withCredentials: true });
            toast.success("Rendez-vous planifié avec succès !");
            setRdv(response.data.rdv);
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur de planification.");
        } finally {
            setRdvLoading(false);
        }
    };

    const handleDownload = (name) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: `Génération sécurisée de ${name}...`,
                success: `${name} a été généré et téléchargé avec succès.`,
                error: 'Erreur lors de la génération du document.',
            }
        );
    };

    const handlePrint = () => {
        toast.info("Préparation du document pour l'impression...");
        setTimeout(() => window.print(), 800);
    };

    const handleContactAgent = () => {
        setShowChatDrawer(true);
    };

    if (!demande) return null;

    return (
        <CitizenLayout title="Détails du dossier">
            <Head title={`Dossier ${demande.numero_dossier}`}>
                <style>{`
                    @media print {
                        aside, header, button, .no-print { display: none !important; }
                        body { background: white; }
                        .max-w-5xl { max-width: 100%; }
                        .shadow-sm, .shadow-xl { box-shadow: none !important; }
                        .rounded-\\[2rem\\] { border-radius: 0 !important; }
                        .lg\\:col-span-2 { width: 100%; }
                        .grid { display: block; }
                    }
                `}</style>
            </Head>
            <Toaster position="top-right" richColors />

            <div className="max-w-5xl mx-auto">
                <Link href="/citoyen/mes-dossiers" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-8 font-black text-[10px] uppercase tracking-widest transition-colors group">
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Retour à la liste
                </Link>

                {/* Bandeau pièce manquante — pleine largeur */}
                {demande.statut === 'document_manquant' && demande.piece_manquante && (
                    <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-[2rem] p-6 flex items-start gap-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Action requise — Document manquant</p>
                            <p className="text-sm font-bold text-amber-900">{demande.piece_manquante}</p>
                            <p className="text-[10px] text-amber-600 font-bold mt-2">
                                Merci de fournir ce document à votre agent ou via la messagerie pour que votre dossier soit traité.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                                <div>
                                    <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest mb-2">Dossier Officiel</span>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{demande.numero_dossier}</h1>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={handlePrint}
                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                                    >
                                        <Printer size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDownload(`Récépissé_${demande.numero_dossier}.pdf`)}
                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-1.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type de service</p>
                                    <p className="text-sm font-black text-slate-800">{demande.type_demande?.libelle}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date de dépôt</p>
                                    <p className="text-sm font-black text-slate-800">{new Date(demande.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description / Motif</p>
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 italic text-slate-600 text-[12px] leading-relaxed">
                                    "{demande.description || 'Aucune description fournie.'}"
                                </div>
                            </div>
                        </div>

                        {/* Documents Attached */}
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 md:p-10">
                            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest mb-8">Pièces justificatives fournies</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {demande.documents && demande.documents.length > 0 ? demande.documents.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={`/api/v1/documents/${doc.id}/download`}
                                        download
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-600/30 hover:bg-indigo-50 transition-all"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 shrink-0">
                                                <FileText size={18} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[11px] font-black text-slate-800 truncate">{doc.nom_original}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">{doc.taille_octets ? (doc.taille_octets / 1024).toFixed(1) + ' KB' : ''}</p>
                                            </div>
                                        </div>
                                        <Download size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                                    </a>
                                )) : (
                                    <p className="col-span-2 text-center text-slate-400 italic text-[10px] uppercase font-black py-4">Aucun document joint.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Agent Info */}
                    <div className="space-y-6">
                        {/* Agent Section */}
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <UserCheck size={48} className="text-indigo-600" />
                            </div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Agent en charge</h3>
                            
                            {demande.agent ? (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black shadow-inner border border-indigo-200/50">
                                            {demande.agent.nom[0]}{demande.agent.prenom[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 tracking-tight">{demande.agent.prenom} {demande.agent.nom}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{demande.agent.role ?? 'Agent État Civil'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
                                        <button 
                                            onClick={handleContactAgent}
                                            className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all group"
                                        >
                                            <MessageSquare size={14} className="group-hover:scale-110 transition-transform" />
                                            Envoyer un message
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 py-3 rounded-xl border border-amber-100">En attente d'assignation</p>
                                </div>
                            )}
                        </div>

                        {/* QR Code d'Authenticité (Visible une fois validé) */}
                        {demande.statut === 'validee' && (
                            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 text-center space-y-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <ShieldCheck size={48} className="text-emerald-500" />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Cachet d'Authenticité QR</h3>
                                <div className="flex justify-center bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner max-w-[150px] mx-auto group-hover:scale-105 transition-transform">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/verify/demandes/' + demande.uuid)}`} 
                                        alt="QR Code d'Authenticité"
                                        className="w-28 h-28" 
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                                    Ce QR Code certifie que cet acte civil est authentique et conforme aux registres numériques de la mairie.
                                </p>
                                <a 
                                    href={`/verify/demandes/${demande.uuid}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center justify-center gap-1.5"
                                >
                                    <ExternalLink size={12} /> Vérifier publiquement l'acte
                                </a>
                            </div>
                        )}

                        {/* Prise de Rendez-vous / Calendrier Retrait Physique */}
                        {demande.statut === 'validee' && (
                            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 space-y-6 relative overflow-hidden">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Calendar size={14} className="text-indigo-600" />
                                    Retrait de l'acte civil
                                </h3>

                                {rdv ? (
                                    /* RDV déjà planifié */
                                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 text-center space-y-3">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                            Rendez-vous Confirmé
                                        </p>
                                        <p className="text-xs font-black text-slate-800">
                                            Le {new Date(rdv.date_rdv).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        <p className="text-xl font-black text-emerald-600">
                                            à {new Date(rdv.date_rdv).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-[9px] text-slate-500 max-w-[200px] mx-auto italic">
                                            Présentez-vous au guichet n°3 muni de votre récépissé et d'une pièce d'identité.
                                        </p>
                                        <span className="inline-block px-3 py-1 bg-emerald-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest mt-2 shadow-lg shadow-emerald-500/20">
                                            ✓ Actif
                                        </span>
                                    </div>
                                ) : (
                                    /* Formulaire de réservation de créneau */
                                    <div className="space-y-4">
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                                            Réservez un créneau horaire pour venir retirer votre acte physique original à la mairie.
                                        </p>

                                        {/* Journées disponibles */}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">1. Choisir une date</label>
                                            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                                                {availableDays.map((day, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => { setSelectedDay(day); setSelectedSlot(null); }}
                                                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 transition-all ${
                                                            selectedDay?.raw_date === day.raw_date
                                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                                                        }`}
                                                    >
                                                        {new Date(day.raw_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Créneaux horaires */}
                                        {selectedDay && (
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">2. Choisir un horaire</label>
                                                <div className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-100" style={{ scrollbarWidth: 'none' }}>
                                                    {selectedDay.slots.map((slot, j) => (
                                                        <button
                                                            key={j}
                                                            type="button"
                                                            disabled={!slot.available}
                                                            onClick={() => setSelectedSlot(slot)}
                                                            className={`py-2 rounded-xl text-[10px] font-black tracking-wider transition-all ${
                                                                !slot.available
                                                                    ? 'bg-slate-100/50 text-slate-300 cursor-not-allowed line-through'
                                                                    : selectedSlot?.raw_datetime === slot.raw_datetime
                                                                        ? 'bg-indigo-600 text-white shadow-lg'
                                                                        : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-100'
                                                            }`}
                                                        >
                                                            {slot.time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Confirmation button */}
                                        <button
                                            type="button"
                                            onClick={handleBookRdv}
                                            disabled={rdvLoading || !selectedSlot}
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                                        >
                                            {rdvLoading ? <Loader2 className="animate-spin" size={14} /> : <Calendar size={14} />}
                                            Confirmer le rendez-vous
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Suivi du traitement</h3>
                            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
                                {demande.historique_statuts && demande.historique_statuts.length > 0 ? (
                                    demande.historique_statuts.map((hist, i) => {
                                        const dotColor =
                                            hist.nouveau_statut === 'validee'           ? 'bg-emerald-500' :
                                            hist.nouveau_statut === 'rejetee'           ? 'bg-rose-500' :
                                            hist.nouveau_statut === 'document_manquant' ? 'bg-amber-500' :
                                            'bg-indigo-600';
                                        const labelMap = {
                                            en_attente:        'En attente',
                                            en_cours:          'Pris en charge',
                                            document_manquant: 'Document manquant',
                                            validee:           'Validé',
                                            rejetee:           'Rejeté',
                                        };
                                        return (
                                            <div key={i} className="relative pl-10">
                                                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 text-white ${dotColor}`}>
                                                    <Clock size={12} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black tracking-tight text-slate-800 uppercase">
                                                        {labelMap[hist.nouveau_statut] ?? hist.nouveau_statut.replace(/_/g, ' ')}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                        {new Date(hist.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    {hist.commentaire && (
                                                        <p className={`text-[10px] font-bold mt-1.5 leading-relaxed ${
                                                            hist.nouveau_statut === 'document_manquant' ? 'text-amber-700' :
                                                            hist.nouveau_statut === 'rejetee'           ? 'text-rose-600' :
                                                            'text-slate-500'
                                                        }`}>
                                                            {hist.commentaire}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 bg-emerald-500 text-white">
                                            <CheckCircle2 size={12} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black tracking-tight text-slate-800 uppercase">Dossier Déposé</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                {new Date(demande.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Legal Note */}
                        <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                                <Info size={20} />
                            </div>
                            <div>
                                <p className="font-black text-amber-900 text-[9px] uppercase tracking-widest mb-1">Authentification</p>
                                <p className="text-amber-800/70 text-[10px] leading-relaxed font-bold">
                                    Une fois validé, votre acte sera disponible au format numérique certifié.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Volet de Chat Coulissant (Messagerie Directe Citoyen ↔ Agent) */}
            <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300 ${
                showChatDrawer ? 'translate-x-0' : 'translate-x-full'
            }`}>
                {/* Header */}
                <div className="p-6 border-b border-slate-850 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                            {demande.agent?.prenom?.[0] || 'A'}
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-white tracking-tight uppercase">
                                {demande.agent ? `${demande.agent.prenom} ${demande.agent.nom}` : 'Agent Mairie'}
                            </h4>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                                Dossier #{demande.numero_dossier}
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
                    {!demande.agent_id ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <AlertCircle className="text-amber-500 mb-3 animate-pulse" size={32} />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                En attente d'agent
                            </p>
                            <p className="text-[9px] text-slate-500 mt-1 max-w-[200px]">
                                Dès qu'un agent prendra en charge votre dossier, vous pourrez échanger en direct ici.
                            </p>
                        </div>
                    ) : chatMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <MessageSquare className="text-indigo-500 mb-3 animate-bounce" size={32} />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                Aucun message
                            </p>
                            <p className="text-[9px] text-slate-500 mt-1 max-w-[200px]">
                                Écrivez un message ci-dessous pour dialoguer directement avec l'agent en charge.
                            </p>
                        </div>
                    ) : (
                        chatMessages.map((msg, index) => {
                            const isMe = msg.sender_id === auth.user?.id;
                            return (
                                <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
                                            {isMe ? 'Vous (Citoyen)' : `${msg.sender?.prenom} (Agent)`}
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
                {demande.agent_id && (
                    <form onSubmit={handleSendChatMessage} className="p-6 border-t border-slate-850 bg-slate-900/30">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatMessageText}
                                onChange={e => setChatMessageText(e.target.value)}
                                placeholder="Posez une question ou répondez à l'agent..."
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
                )}
            </div>
        </CitizenLayout>
    );
}
