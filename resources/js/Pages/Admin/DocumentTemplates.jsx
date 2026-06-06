import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import {
    FileImage, Upload, Trash2, ToggleLeft, ToggleRight,
    Plus, X, Save, Eye, Settings2, Loader2, CheckCircle
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

const VARIABLES = [
    { key: 'numero_dossier',  label: 'N° Dossier' },
    { key: 'date_depot',      label: 'Date de dépôt' },
    { key: 'date_validation', label: 'Date de validation' },
    { key: 'citoyen_prenom',  label: 'Prénom citoyen' },
    { key: 'citoyen_nom',     label: 'Nom citoyen' },
    { key: 'agent_prenom',    label: 'Prénom agent' },
    { key: 'agent_nom',       label: 'Nom agent' },
    { key: 'nom',             label: 'Nom (titulaire)' },
    { key: 'prenoms',         label: 'Prénom(s)' },
    { key: 'date_naissance',  label: 'Date de naissance' },
    { key: 'lieu_naissance',  label: 'Lieu de naissance' },
    { key: 'genre',           label: 'Genre' },
    { key: 'nom_pere',        label: 'Nom du père' },
    { key: 'prenom_pere',     label: 'Prénom du père' },
    { key: 'profession_pere', label: 'Profession père' },
    { key: 'nom_mere',        label: 'Nom de la mère' },
    { key: 'prenom_mere',     label: 'Prénom de la mère' },
    { key: 'profession_mere', label: 'Profession mère' },
    { key: 'adresse_complete',label: 'Adresse complète' },
    { key: 'quartier_commune',label: 'Quartier / Commune' },
    { key: 'duree_residence', label: 'Durée résidence' },
    { key: 'nom_epoux',       label: 'Nom époux' },
    { key: 'prenom_epoux',    label: 'Prénom époux' },
    { key: 'nom_epouse',      label: 'Nom épouse' },
    { key: 'prenom_epouse',   label: 'Prénom épouse' },
    { key: 'date_mariage',    label: 'Date mariage' },
    { key: 'lieu_mariage',    label: 'Lieu mariage' },
    { key: 'motif',           label: 'Motif' },
    { key: 'nombre_copies',   label: 'Nombre de copies' },
    { key: 'type_demande',    label: 'Type de demande' },
];

export default function DocumentTemplates() {
    const [types, setTypes]               = useState([]);
    const [selected, setSelected]         = useState(null); // type sélectionné
    const [loading, setLoading]           = useState(true);
    const [uploading, setUploading]       = useState(false);
    const [saving, setSaving]             = useState(false);
    const [toggling, setToggling]         = useState(false);

    // Editor state
    const [pendingClick, setPendingClick] = useState(null); // {x, y} en % après clic sur image
    const [newChamp, setNewChamp]         = useState({ key: '', label: '', font_size: 13, bold: false, color: '#000000' });
    const imageRef                        = useRef(null);
    const fileRef                         = useRef(null);
    const [uploadNom, setUploadNom]       = useState('');

    useEffect(() => { fetchTypes(); }, []);

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/document-templates');
            setTypes(res.data);
        } catch {
            toast.error('Impossible de charger les types de demandes.');
        } finally {
            setLoading(false);
        }
    };

    const currentTemplate = selected?.template ?? null;
    const champs = currentTemplate?.champs ?? [];

    // Clic sur l'image → capture coordonnées
    const handleImageClick = (e) => {
        if (!currentTemplate?.chemin_image) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(2);
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(2);
        setPendingClick({ x: parseFloat(x), y: parseFloat(y) });
        setNewChamp(prev => ({ ...prev, key: '', label: '' }));
    };

    const handleAddChamp = () => {
        if (!newChamp.key || !pendingClick) return;
        const variable = VARIABLES.find(v => v.key === newChamp.key);
        const champ = {
            key:       newChamp.key,
            label:     variable?.label || newChamp.key,
            x:         pendingClick.x,
            y:         pendingClick.y,
            font_size: newChamp.font_size,
            bold:      newChamp.bold,
            color:     newChamp.color,
        };
        const updated = [...champs, champ];
        updateLocalChamps(updated);
        setPendingClick(null);
    };

    const handleRemoveChamp = (index) => {
        const updated = champs.filter((_, i) => i !== index);
        updateLocalChamps(updated);
    };

    const updateLocalChamps = (newChamps) => {
        setTypes(prev => prev.map(t => {
            if (t.id !== selected.id) return t;
            return { ...t, template: { ...t.template, champs: newChamps } };
        }));
        setSelected(prev => ({ ...prev, template: { ...prev.template, champs: newChamps } }));
    };

    const handleSaveChamps = async () => {
        if (!currentTemplate?.id) return;
        setSaving(true);
        try {
            await axios.put(`/api/v1/document-templates/${currentTemplate.id}/champs`, { champs });
            toast.success('Champs sauvegardés.');
        } catch {
            toast.error('Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = async () => {
        if (!fileRef.current?.files[0] || !uploadNom.trim()) {
            toast.error('Veuillez choisir un fichier et saisir un nom.');
            return;
        }
        setUploading(true);
        const form = new FormData();
        form.append('type_demande_id', selected.id);
        form.append('nom', uploadNom.trim());
        form.append('image', fileRef.current.files[0]);
        try {
            const res = await axios.post('/api/v1/document-templates', form);
            toast.success('Template uploadé.');
            await fetchTypes();
            // Reselect
            setSelected(prev => ({ ...prev, template: res.data }));
        } catch {
            toast.error("Erreur lors de l'upload.");
        } finally {
            setUploading(false);
            fileRef.current.value = '';
            setUploadNom('');
        }
    };

    const handleToggle = async () => {
        if (!currentTemplate?.id) return;
        if (currentTemplate.actif === false && (!champs || champs.length === 0)) {
            toast.error("Ajoutez au moins un champ avant d'activer le template.");
            return;
        }
        setToggling(true);
        try {
            const res = await axios.patch(`/api/v1/document-templates/${currentTemplate.id}/toggle`);
            setTypes(prev => prev.map(t => {
                if (t.id !== selected.id) return t;
                return { ...t, template: { ...t.template, actif: res.data.actif } };
            }));
            setSelected(prev => ({ ...prev, template: { ...prev.template, actif: res.data.actif } }));
            toast.success(res.data.actif ? 'Template activé.' : 'Template désactivé.');
        } catch {
            toast.error('Erreur lors du changement de statut.');
        } finally {
            setToggling(false);
        }
    };

    const handleDelete = async () => {
        if (!currentTemplate?.id) return;
        if (!confirm('Supprimer ce template ? Cette action est irréversible.')) return;
        try {
            await axios.delete(`/api/v1/document-templates/${currentTemplate.id}`);
            toast.success('Template supprimé.');
            fetchTypes();
            setSelected(prev => ({ ...prev, template: null }));
        } catch {
            toast.error('Erreur lors de la suppression.');
        }
    };

    return (
        <AdminLayout title="Modèles de documents">
            <Head title="Modèles de documents" />
            <Toaster position="top-right" richColors />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Modèles de documents</h1>
                        <p className="text-sm text-gray-500 mt-1">Uploadez une image de formulaire et positionnez les champs pour générer les documents validés.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Liste des types */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                <FileImage size={16} className="text-indigo-600" />
                                Types de demandes
                            </h2>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-500" size={24} /></div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {types.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setSelected(t); setPendingClick(null); }}
                                        className={`w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors ${selected?.id === t.id ? 'bg-indigo-50' : ''}`}
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{t.libelle}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {t.template ? (t.template.actif ? '✅ Actif' : '⏸ Inactif') : '— Aucun template'}
                                            </p>
                                        </div>
                                        {t.template?.actif && (
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Éditeur */}
                    <div className="lg:col-span-2 space-y-5">
                        {!selected ? (
                            <div className="bg-white rounded-2xl border border-gray-200 flex items-center justify-center py-24 text-center">
                                <div>
                                    <Settings2 size={40} className="text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400 font-medium">Sélectionnez un type de demande</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Upload */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                                    <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                        <Upload size={15} className="text-indigo-600" />
                                        {currentTemplate ? 'Remplacer le template' : 'Uploader un template'}
                                        <span className="ml-auto text-xs text-gray-400 font-normal">{selected.libelle}</span>
                                    </h3>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Nom du template (ex: Acte de naissance officiel)"
                                            value={uploadNom}
                                            onChange={e => setUploadNom(e.target.value)}
                                            className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" />
                                        <button
                                            onClick={() => fileRef.current?.click()}
                                            className="px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            Choisir image
                                        </button>
                                        <button
                                            onClick={handleUpload}
                                            disabled={uploading}
                                            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center gap-2"
                                        >
                                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                            Upload
                                        </button>
                                    </div>
                                </div>

                                {currentTemplate && (
                                    <>
                                        {/* Actions template */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={handleToggle}
                                                disabled={toggling}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                                                    currentTemplate.actif
                                                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {toggling ? <Loader2 size={15} className="animate-spin" /> :
                                                    currentTemplate.actif ? <ToggleRight size={18} className="text-emerald-600" /> : <ToggleLeft size={18} />}
                                                {currentTemplate.actif ? 'Actif — cliquez pour désactiver' : 'Inactif — cliquez pour activer'}
                                            </button>
                                            <button
                                                onClick={handleSaveChamps}
                                                disabled={saving}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 ml-auto"
                                            >
                                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                                Sauvegarder les champs
                                            </button>
                                            <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Éditeur visuel */}
                                        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Eye size={13} className="text-indigo-500" />
                                                Cliquez sur l'image pour placer un champ
                                            </p>

                                            {/* Image avec champs superposés */}
                                            <div className="relative border border-gray-100 rounded-xl overflow-hidden cursor-crosshair" style={{ userSelect: 'none' }}>
                                                <img
                                                    ref={imageRef}
                                                    src={`/storage/${currentTemplate.chemin_image}`}
                                                    alt="Template"
                                                    className="w-full h-auto block"
                                                    onClick={handleImageClick}
                                                    draggable={false}
                                                />
                                                {/* Champs déjà placés */}
                                                {champs.map((c, i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute flex items-center gap-1 pointer-events-none"
                                                        style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translateY(-50%)' }}
                                                    >
                                                        <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded whitespace-nowrap shadow">
                                                            {c.label}
                                                        </span>
                                                    </div>
                                                ))}
                                                {/* Clic en attente */}
                                                {pendingClick && (
                                                    <div
                                                        className="absolute w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-lg"
                                                        style={{ left: `${pendingClick.x}%`, top: `${pendingClick.y}%`, transform: 'translate(-50%,-50%)' }}
                                                    />
                                                )}
                                            </div>

                                            {/* Popup d'ajout de champ */}
                                            {pendingClick && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                                                    <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                                                        Position : {pendingClick.x}% × {pendingClick.y}% — Définissez le champ
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <select
                                                            value={newChamp.key}
                                                            onChange={e => setNewChamp(p => ({ ...p, key: e.target.value }))}
                                                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                        >
                                                            <option value="">-- Variable --</option>
                                                            {VARIABLES.map(v => (
                                                                <option key={v.key} value={v.key}>{v.label}</option>
                                                            ))}
                                                        </select>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="number"
                                                                min={6} max={72}
                                                                value={newChamp.font_size}
                                                                onChange={e => setNewChamp(p => ({ ...p, font_size: +e.target.value }))}
                                                                className="w-20 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                                placeholder="Taille"
                                                            />
                                                            <input
                                                                type="color"
                                                                value={newChamp.color}
                                                                onChange={e => setNewChamp(p => ({ ...p, color: e.target.value }))}
                                                                className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer p-1"
                                                            />
                                                            <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={newChamp.bold}
                                                                    onChange={e => setNewChamp(p => ({ ...p, bold: e.target.checked }))}
                                                                    className="rounded"
                                                                />
                                                                Gras
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleAddChamp}
                                                            disabled={!newChamp.key}
                                                            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                                        >
                                                            <Plus size={13} /> Ajouter le champ
                                                        </button>
                                                        <button
                                                            onClick={() => setPendingClick(null)}
                                                            className="px-3 py-2 text-gray-500 hover:text-gray-700 rounded-lg text-xs font-medium"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Liste des champs placés */}
                                        {champs.length > 0 && (
                                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                                <div className="px-5 py-3 border-b border-gray-100">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <CheckCircle size={13} className="text-indigo-500" />
                                                        {champs.length} champ{champs.length > 1 ? 's' : ''} placé{champs.length > 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <div className="divide-y divide-gray-50">
                                                    {champs.map((c, i) => (
                                                        <div key={i} className="flex items-center justify-between px-5 py-3">
                                                            <div>
                                                                <span className="text-sm font-semibold text-gray-800">{c.label}</span>
                                                                <span className="ml-2 text-xs text-gray-400 font-mono">{'{{' + c.key + '}}'}</span>
                                                                <span className="ml-2 text-xs text-gray-400">{c.x}% × {c.y}% — {c.font_size}px {c.bold ? '· gras' : ''}</span>
                                                            </div>
                                                            <button onClick={() => handleRemoveChamp(i)} className="text-gray-300 hover:text-rose-500 transition-colors p-1">
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
