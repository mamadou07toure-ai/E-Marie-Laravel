import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';
import axios from 'axios';
import {
    FileText,
    CheckCircle2,
    Upload,
    Info,
    User,
    MapPin,
    Heart,
    FileCheck,
    RefreshCw,
    ChevronRight,
    X,
    FileUp,
    AlertCircle,
    Building2,
    Download
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Create({ auth }) {
    const [selectedType, setSelectedType] = useState(null);
    const [data, _setData] = useState({
        type_demande_id: '',
        priorite: 'normale',
        description: 'Demande effectuée via le portail citoyen.',
        fields: { nombre_copies: 1 },
        documents: [],
        is_physical_pickup: false
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const setData = (field, value) => _setData(prev => ({ ...prev, [field]: value }));

    const requestTypes = [
        { id: 'ACTE_NAISSANCE', name: 'Acte de naissance', icon: User, color: 'text-blue-600', bg: 'bg-blue-50', docs: ['Ancien Extrait de Naissance (Facultatif)'] },
        { id: 'CERTIFICAT_RESIDENCE', name: 'Certificat de résidence', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50', docs: ['Justificatif de domicile (quittance, bail, facture)', "Photo d'identité récente (Obligatoire)"] },
        { id: 'CERTIFICAT_MARIAGE', name: 'Certificat de mariage', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', docs: ["Copie de l'acte de mariage original (si disponible)"] },
        { id: 'LEGALISATION_DOCUMENT', name: 'Légalisation de document', icon: FileCheck, color: 'text-amber-600', bg: 'bg-amber-50', docs: ['Carte nationale d\'identité', 'Document original à légaliser (Obligatoire)', 'Copie du document (Obligatoire)'] },
    ];

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setData('type_demande_id', type.id);
        setData('fields', { nombre_copies: 1 });
    };

    const handleFieldChange = (name, value) => {
        setData('fields', { ...data.fields, [name]: value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('type_demande_id', data.type_demande_id);
        formData.append('priorite', data.priorite);
        formData.append('description', data.description);
        formData.append('is_physical_pickup', data.is_physical_pickup ? '1' : '0');
        Object.entries(data.fields).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                formData.append(`fields[${key}]`, value);
            }
        });
        data.documents.forEach((file, index) => {
            formData.append(`documents[${index}]`, file);
        });

        try {
            await axios.post('/api/v1/demandes', formData);
            toast.success('Votre demande officielle a été enregistrée dans le registre.');
            router.visit('/citoyen/mes-dossiers');
        } catch (error) {
            const serverErrors = error.response?.data?.errors || {};
            setErrors(serverErrors);
            const firstMsg = Object.values(serverErrors).flat()[0];
            toast.error(firstMsg || error.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setProcessing(false);
        }
    };

    const inputClass = (error) => `w-full bg-slate-50 border ${error ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200'} rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700`;
    const labelClass = "text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2.5 block ml-1";
    const sectionTitle = "text-base font-black text-slate-900 mb-8 flex items-center gap-3 pb-3 border-b-2 border-slate-100 italic";

    const renderForm = () => {
        if (!selectedType) return null;

        switch (selectedType.id) {
            // Note: les case correspondent aux codes en base de données
            case 'ACTE_NAISSANCE':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="col-span-full"><h4 className={sectionTitle}><User size={20} className="text-indigo-600" /> Identité du titulaire</h4></div>
                        <div>
                            <label className={labelClass}>Nom</label>
                            <input type="text" required value={data.fields.nom ?? ''} onChange={e => handleFieldChange('nom', e.target.value)} className={inputClass(errors['fields.nom'])} />
                            {errors['fields.nom'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.nom']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Prénom(s)</label>
                            <input type="text" required value={data.fields.prenoms ?? ''} onChange={e => handleFieldChange('prenoms', e.target.value)} className={inputClass(errors['fields.prenoms'])} />
                            {errors['fields.prenoms'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.prenoms']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Date de naissance</label>
                            <input type="date" required value={data.fields.date_naissance ?? ''} onChange={e => handleFieldChange('date_naissance', e.target.value)} className={inputClass(errors['fields.date_naissance'])} />
                            {errors['fields.date_naissance'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.date_naissance']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Lieu de naissance</label>
                            <input type="text" required value={data.fields.lieu_naissance ?? ''} onChange={e => handleFieldChange('lieu_naissance', e.target.value)} className={inputClass(errors['fields.lieu_naissance'])} />
                            {errors['fields.lieu_naissance'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.lieu_naissance']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Genre</label>
                            <select required value={data.fields.genre ?? ''} onChange={e => handleFieldChange('genre', e.target.value)} className={inputClass(errors['fields.genre'])}>
                                <option value="">Choisir...</option>
                                <option value="F">Féminin (F)</option>
                                <option value="M">Masculin (M)</option>
                            </select>
                            {errors['fields.genre'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.genre']}</span>}
                        </div>

                        <div className="col-span-full mt-6"><h4 className={sectionTitle}><Info size={20} className="text-indigo-600" /> Informations du Père</h4></div>
                        <div>
                            <label className={labelClass}>Nom du père</label>
                            <input type="text" required value={data.fields.nom_pere ?? ''} onChange={e => handleFieldChange('nom_pere', e.target.value)} className={inputClass(errors['fields.nom_pere'])} />
                            {errors['fields.nom_pere'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.nom_pere']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Prénom(s) du père</label>
                            <input type="text" required value={data.fields.prenom_pere ?? ''} onChange={e => handleFieldChange('prenom_pere', e.target.value)} className={inputClass(errors['fields.prenom_pere'])} />
                            {errors['fields.prenom_pere'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.prenom_pere']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Date de naissance (Père)</label>
                            <input type="date" required value={data.fields.date_naissance_pere ?? ''} onChange={e => handleFieldChange('date_naissance_pere', e.target.value)} className={inputClass(errors['fields.date_naissance_pere'])} />
                            {errors['fields.date_naissance_pere'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.date_naissance_pere']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Profession (Père)</label>
                            <input type="text" required value={data.fields.profession_pere ?? ''} onChange={e => handleFieldChange('profession_pere', e.target.value)} className={inputClass(errors['fields.profession_pere'])} />
                            {errors['fields.profession_pere'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.profession_pere']}</span>}
                        </div>

                        <div className="col-span-full mt-6"><h4 className={sectionTitle}><Heart size={20} className="text-indigo-600" /> Informations de la Mère</h4></div>
                        <div>
                            <label className={labelClass}>Nom de naissance de la mère</label>
                            <input type="text" required value={data.fields.nom_mere ?? ''} onChange={e => handleFieldChange('nom_mere', e.target.value)} className={inputClass(errors['fields.nom_mere'])} />
                            {errors['fields.nom_mere'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.nom_mere']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Prénom(s) de la mère</label>
                            <input type="text" required value={data.fields.prenom_mere ?? ''} onChange={e => handleFieldChange('prenom_mere', e.target.value)} className={inputClass(errors['fields.prenom_mere'])} />
                            {errors['fields.prenom_mere'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.prenom_mere']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Date de naissance (Mère)</label>
                            <input type="date" required value={data.fields.date_naissance_mere ?? ''} onChange={e => handleFieldChange('date_naissance_mere', e.target.value)} className={inputClass(errors['fields.date_naissance_mere'])} />
                            {errors['fields.date_naissance_mere'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.date_naissance_mere']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Profession (Mère)</label>
                            <input type="text" required value={data.fields.profession_mere ?? ''} onChange={e => handleFieldChange('profession_mere', e.target.value)} className={inputClass(errors['fields.profession_mere'])} />
                            {errors['fields.profession_mere'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.profession_mere']}</span>}
                        </div>

                        <div className="col-span-full mt-6"><h4 className={sectionTitle}><CheckCircle2 size={20} className="text-indigo-600" /> Détails demande</h4></div>
                        <div>
                            <label className={labelClass}>Motif de la demande</label>
                            <select required value={data.fields.motif ?? ''} onChange={e => handleFieldChange('motif', e.target.value)} className={inputClass(errors['fields.motif'])}>
                                <option value="">Choisir...</option>
                                <option value="administratif">Usage administratif</option>
                                <option value="mariage">Mariage</option>
                                <option value="voyage">Voyage</option>
                                <option value="autre">Autre</option>
                            </select>
                            {errors['fields.motif'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.motif']}</span>}
                        </div>
                    </div>
                );

            case 'CERTIFICAT_RESIDENCE':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="col-span-full"><h4 className={sectionTitle}><MapPin size={20} className="text-indigo-600" /> Identité & Domicile</h4></div>
                        <div>
                            <label className={labelClass}>Nom</label>
                            <input type="text" required value={data.fields.nom ?? ''} onChange={e => handleFieldChange('nom', e.target.value)} className={inputClass(errors['fields.nom'])} />
                            {errors['fields.nom'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.nom']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Prénom(s)</label>
                            <input type="text" required value={data.fields.prenoms ?? ''} onChange={e => handleFieldChange('prenoms', e.target.value)} className={inputClass(errors['fields.prenoms'])} />
                            {errors['fields.prenoms'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.prenoms']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Date de naissance</label>
                            <input type="date" required value={data.fields.date_naissance ?? ''} onChange={e => handleFieldChange('date_naissance', e.target.value)} className={inputClass(errors['fields.date_naissance'])} />
                            {errors['fields.date_naissance'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.date_naissance']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Lieu de naissance</label>
                            <input type="text" required value={data.fields.lieu_naissance ?? ''} onChange={e => handleFieldChange('lieu_naissance', e.target.value)} className={inputClass(errors['fields.lieu_naissance'])} />
                            {errors['fields.lieu_naissance'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.lieu_naissance']}</span>}
                        </div>
                        <div className="col-span-full">
                            <label className={labelClass}>Adresse complète de résidence</label>
                            <textarea required value={data.fields.adresse_complete ?? ''} onChange={e => handleFieldChange('adresse_complete', e.target.value)} className={inputClass(errors['fields.adresse_complete'])} rows="2"></textarea>
                            {errors['fields.adresse_complete'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.adresse_complete']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Profession</label>
                            <input type="text" value={data.fields.profession ?? ''} onChange={e => handleFieldChange('profession', e.target.value)} className={inputClass(errors['fields.profession'])} />
                            {errors['fields.profession'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.profession']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Quartier / Commune</label>
                            <input type="text" required value={data.fields.quartier_commune ?? ''} onChange={e => handleFieldChange('quartier_commune', e.target.value)} className={inputClass(errors['fields.quartier_commune'])} />
                            {errors['fields.quartier_commune'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.quartier_commune']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Durée de résidence à cette adresse</label>
                            <input type="text" required placeholder="Ex: 3 ans" value={data.fields.duree_residence ?? ''} onChange={e => handleFieldChange('duree_residence', e.target.value)} className={inputClass(errors['fields.duree_residence'])} />
                            {errors['fields.duree_residence'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.duree_residence']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Motif</label>
                            <select required value={data.fields.motif ?? ''} onChange={e => handleFieldChange('motif', e.target.value)} className={inputClass(errors['fields.motif'])}>
                                <option value="">Choisir...</option>
                                <option value="emploi">Emploi</option>
                                <option value="banque">Banque</option>
                                <option value="scolarite">Scolarité</option>
                                <option value="voyage">Voyage</option>
                                <option value="autre">Autre</option>
                            </select>
                            {errors['fields.motif'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.motif']}</span>}
                        </div>
                    </div>
                );

            case 'CERTIFICAT_MARIAGE':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="col-span-full"><h4 className={sectionTitle}><User size={20} className="text-indigo-600" /> Identité de l'Époux</h4></div>
                        <div>
                            <label className={labelClass}>Nom de l'époux</label>
                            <input type="text" required value={data.fields.nom_epoux ?? ''} onChange={e => handleFieldChange('nom_epoux', e.target.value)} className={inputClass(errors['fields.nom_epoux'])} />
                            {errors['fields.nom_epoux'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.nom_epoux']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Prénom(s) de l'époux</label>
                            <input type="text" required value={data.fields.prenom_epoux ?? ''} onChange={e => handleFieldChange('prenom_epoux', e.target.value)} className={inputClass(errors['fields.prenom_epoux'])} />
                            {errors['fields.prenom_epoux'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.prenom_epoux']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Date de naissance (Époux)</label>
                            <input type="date" required value={data.fields.date_naissance_epoux ?? ''} onChange={e => handleFieldChange('date_naissance_epoux', e.target.value)} className={inputClass(errors['fields.date_naissance_epoux'])} />
                            {errors['fields.date_naissance_epoux'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.date_naissance_epoux']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Lieu de naissance (Époux)</label>
                            <input type="text" required value={data.fields.lieu_naissance_epoux ?? ''} onChange={e => handleFieldChange('lieu_naissance_epoux', e.target.value)} className={inputClass(errors['fields.lieu_naissance_epoux'])} />
                            {errors['fields.lieu_naissance_epoux'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.lieu_naissance_epoux']}</span>}
                        </div>

                        <div className="col-span-full mt-8"><h4 className={sectionTitle}><Heart size={20} className="text-rose-600" /> Identité de l'Épouse</h4></div>
                        <div>
                            <label className={labelClass}>Nom de naissance de l'épouse</label>
                            <input type="text" required value={data.fields.nom_epouse ?? ''} onChange={e => handleFieldChange('nom_epouse', e.target.value)} className={inputClass(errors['fields.nom_epouse'])} />
                            {errors['fields.nom_epouse'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.nom_epouse']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Prénom(s) de l'épouse</label>
                            <input type="text" required value={data.fields.prenom_epouse ?? ''} onChange={e => handleFieldChange('prenom_epouse', e.target.value)} className={inputClass(errors['fields.prenom_epouse'])} />
                            {errors['fields.prenom_epouse'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.prenom_epouse']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Date de naissance (Épouse)</label>
                            <input type="date" required value={data.fields.date_naissance_epouse ?? ''} onChange={e => handleFieldChange('date_naissance_epouse', e.target.value)} className={inputClass(errors['fields.date_naissance_epouse'])} />
                            {errors['fields.date_naissance_epouse'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.date_naissance_epouse']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Lieu de naissance (Épouse)</label>
                            <input type="text" required value={data.fields.lieu_naissance_epouse ?? ''} onChange={e => handleFieldChange('lieu_naissance_epouse', e.target.value)} className={inputClass(errors['fields.lieu_naissance_epouse'])} />
                            {errors['fields.lieu_naissance_epouse'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.lieu_naissance_epouse']}</span>}
                        </div>

                        <div className="col-span-full mt-8"><h4 className={sectionTitle}><FileCheck size={20} className="text-indigo-600" /> Informations sur l'Union</h4></div>
                        <div>
                            <label className={labelClass}>Date du mariage</label>
                            <input type="date" required value={data.fields.date_mariage ?? ''} onChange={e => handleFieldChange('date_mariage', e.target.value)} className={inputClass(errors['fields.date_mariage'])} />
                            {errors['fields.date_mariage'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.date_mariage']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Lieu du mariage</label>
                            <input type="text" required value={data.fields.lieu_mariage ?? ''} onChange={e => handleFieldChange('lieu_mariage', e.target.value)} className={inputClass(errors['fields.lieu_mariage'])} />
                            {errors['fields.lieu_mariage'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.lieu_mariage']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Numéro d'acte (si connu)</label>
                            <input type="text" value={data.fields.numero_acte_mariage ?? ''} onChange={e => handleFieldChange('numero_acte_mariage', e.target.value)} className={inputClass(errors['fields.numero_acte_mariage'])} />
                            {errors['fields.numero_acte_mariage'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.numero_acte_mariage']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Motif</label>
                            <select required value={data.fields.motif ?? ''} onChange={e => handleFieldChange('motif', e.target.value)} className={inputClass(errors['fields.motif'])}>
                                <option value="">Choisir...</option>
                                <option value="administration">Administration</option>
                                <option value="voyage">Voyage</option>
                                <option value="famille">Famille</option>
                                <option value="autre">Autre</option>
                            </select>
                            {errors['fields.motif'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.motif']}</span>}
                        </div>
                    </div>
                );

            case 'LEGALISATION_DOCUMENT':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="col-span-full"><h4 className={sectionTitle}><FileCheck size={20} className="text-indigo-600" /> Titulaire & Document</h4></div>
                        <div>
                            <label className={labelClass}>Nom</label>
                            <input type="text" required value={data.fields.nom ?? ''} onChange={e => handleFieldChange('nom', e.target.value)} className={inputClass(errors['fields.nom'])} />
                            {errors['fields.nom'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.nom']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Prénom(s)</label>
                            <input type="text" required value={data.fields.prenoms ?? ''} onChange={e => handleFieldChange('prenoms', e.target.value)} className={inputClass(errors['fields.prenoms'])} />
                            {errors['fields.prenoms'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.prenoms']}</span>}
                        </div>
                        <div className="col-span-full">
                            <label className={labelClass}>Type de document à légaliser</label>
                            <select required value={data.fields.type_document ?? ''} onChange={e => handleFieldChange('type_document', e.target.value)} className={inputClass(errors['fields.type_document'])}>
                                <option value="">Choisir...</option>
                                <option value="acte_notarie">Acte notarié</option>
                                <option value="contrat">Contrat</option>
                                <option value="diplome">Diplôme</option>
                                <option value="procuration">Procuration</option>
                                <option value="autre">Autre</option>
                            </select>
                            {errors['fields.type_document'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.type_document']}</span>}
                        </div>
                        <div className="col-span-full">
                            <label className={labelClass}>Description du document</label>
                            <textarea required value={data.fields.description_document ?? ''} onChange={e => handleFieldChange('description_document', e.target.value)} className={inputClass(errors['fields.description_document'])} rows="2"></textarea>
                            {errors['fields.description_document'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.description_document']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Langue du document</label>
                            <input type="text" required value={data.fields.langue_document ?? ''} onChange={e => handleFieldChange('langue_document', e.target.value)} className={inputClass(errors['fields.langue_document'])} />
                            {errors['fields.langue_document'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.langue_document']}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>Pays de destination</label>
                            <input type="text" required value={data.fields.pays_destination ?? ''} onChange={e => handleFieldChange('pays_destination', e.target.value)} className={inputClass(errors['fields.pays_destination'])} />
                            {errors['fields.pays_destination'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.pays_destination']}</span>}
                        </div>
                        <div className="col-span-full">
                            <label className={labelClass}>Usage prévu</label>
                            <textarea required value={data.fields.usage_prevu ?? ''} onChange={e => handleFieldChange('usage_prevu', e.target.value)} className={inputClass(errors['fields.usage_prevu'])} rows="2"></textarea>
                            {errors['fields.usage_prevu'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.usage_prevu']}</span>}
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <CitizenLayout title="Soumettre une demande">
            <Head title="Nouvelle Demande - Smart e-Mairie" />
            <Toaster position="top-right" richColors />

            {!selectedType ? (
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Portail des Services Officiels</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sélectionnez le type d'acte ou de document administratif</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {requestTypes.map((type) => (
                            <button key={type.id} onClick={() => handleTypeSelect(type)} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-500 transition-all text-left group">
                                <div className={`w-16 h-16 rounded-2xl ${type.bg} ${type.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-inner`}><type.icon size={32} /></div>
                                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{type.name}</h3>
                                <div className="flex items-center gap-3 text-indigo-600 mt-6"><span className="text-[10px] font-black uppercase tracking-widest">Choisir ce document</span><ChevronRight size={16} /></div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <form onSubmit={submit} className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="text-sm font-black text-red-700 mb-2">Veuillez corriger les erreurs suivantes :</p>
                                <ul className="space-y-1">
                                    {Object.entries(errors).map(([key, msgs]) => (
                                        <li key={key} className="text-xs text-red-600 font-bold">
                                            • {Array.isArray(msgs) ? msgs[0] : msgs}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-2xl ${selectedType.bg} ${selectedType.color} flex items-center justify-center shadow-inner`}><selectedType.icon size={32} /></div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-black text-slate-900 text-xl tracking-tight">{selectedType.name}</h3>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-lg border border-emerald-200 tracking-widest">Client Portal</span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Conformité Spécifications 7.x</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => setSelectedType(null)} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-inner"><X size={24} /></button>
                    </div>

                    <div className="bg-white p-16 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">
                        {renderForm()}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12 border-t-2 border-slate-50">
                            <div>
                                <label className={labelClass}>Nombre de copies souhaitées</label>
                                <input type="number" min="1" value={data.fields.nombre_copies ?? 1} required onChange={e => handleFieldChange('nombre_copies', parseInt(e.target.value, 10))} className={inputClass(errors['fields.nombre_copies'])} />
                                {errors['fields.nombre_copies'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.nombre_copies']}</span>}
                            </div>
                            <div>
                                <label className={labelClass}>Observations / Précisions</label>
                                <textarea rows="1" value={data.fields.observations ?? ''} onChange={e => handleFieldChange('observations', e.target.value)} className={inputClass(errors['fields.observations'])} placeholder="Note optionnelle..."></textarea>
                                {errors['fields.observations'] && <span className="text-xs text-red-500 font-bold mt-1.5 block ml-1">{errors['fields.observations']}</span>}
                            </div>
                        </div>
                    </div>

                    {/* PIÈCES JUSTIFICATIVES DÉTAILLÉES */}
                    <div className="bg-white p-16 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4"><FileUp className="text-indigo-600" size={24} /><h3 className="font-black text-slate-900 text-lg tracking-tight">Pièces justificatives requises</h3></div>
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{selectedType.docs.length} Documents</span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {selectedType.docs.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm">
                                            <FileText size={20} />
                                        </div>
                                        <p className="text-xs font-bold text-slate-600">{doc}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">À joindre</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                const invalid = files.filter(f => !/(pdf|jpe?g|png)$/i.test(f.name));
                                if (invalid.length > 0) {
                                    toast.error(`Fichiers refusés : ${invalid.map(f => f.name).join(', ')}. Formats acceptés : PDF, JPG, PNG.`);
                                }
                                const valid = files.filter(f => /(pdf|jpe?g|png)$/i.test(f.name));
                                if (valid.length > 0) {
                                    setData('documents', [...data.documents, ...valid]);
                                    toast.success(`${valid.length} fichier(s) ajouté(s)`);
                                }
                            }}
                        />
                        <div 
                            onClick={() => document.getElementById('file-upload').click()}
                            className="border-4 border-dashed border-slate-100 rounded-[3rem] p-16 text-center bg-slate-50/50 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer group shadow-inner relative"
                        >
                            <Upload className="mx-auto text-slate-200 mb-6 group-hover:text-indigo-400 group-hover:scale-110 transition-all" size={64} />
                            <p className="text-base font-black text-slate-900 mb-2">Cliquez pour ajouter des documents</p>
                            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-black">PDF, JPG, PNG (Max 10MB)</p>
                        </div>

                        {data.documents.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    Fichiers sélectionnés ({data.documents.length})
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {data.documents.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <FileText size={16} className="text-indigo-500 shrink-0" />
                                                <span className="text-[11px] font-bold text-slate-700 truncate">{file.name}</span>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setData('documents', data.documents.filter((_, idx) => idx !== i));
                                                }}
                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MODE DE RETRAIT */}
                    <div className="bg-white p-16 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
                        <div className="flex items-center gap-4">
                            <Building2 className="text-indigo-600" size={24} />
                            <h3 className="font-black text-slate-900 text-lg tracking-tight">Mode de retrait souhaité</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-6">Choisissez comment vous souhaitez récupérer votre document officiel une fois validé.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div 
                                onClick={() => setData('is_physical_pickup', false)}
                                className={`cursor-pointer rounded-[2rem] border-2 p-8 transition-all duration-300 ${
                                    !data.is_physical_pickup 
                                    ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10' 
                                    : 'border-slate-100 bg-white hover:border-slate-200'
                                }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                                    !data.is_physical_pickup ? 'bg-indigo-600 text-white shadow-inner' : 'bg-slate-50 text-slate-400'
                                }`}>
                                    <Download className="w-7 h-7" />
                                </div>
                                <h4 className="font-black text-slate-900 text-lg mb-2">Téléchargement Numérique</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">Téléchargez votre document officiel directement depuis votre espace citoyen. Rapide et disponible 24h/24.</p>
                                {!data.is_physical_pickup && (
                                    <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-200">
                                        <CheckCircle2 size={14} /> Sélectionné
                                    </div>
                                )}
                            </div>

                            <div 
                                onClick={() => setData('is_physical_pickup', true)}
                                className={`cursor-pointer rounded-[2rem] border-2 p-8 transition-all duration-300 ${
                                    data.is_physical_pickup 
                                    ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10' 
                                    : 'border-slate-100 bg-white hover:border-slate-200'
                                }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                                    data.is_physical_pickup ? 'bg-emerald-600 text-white shadow-inner' : 'bg-slate-50 text-slate-400'
                                }`}>
                                    <Building2 className="w-7 h-7" />
                                </div>
                                <h4 className="font-black text-slate-900 text-lg mb-2">Retrait Physique (Mairie)</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">Récupérez la copie certifiée conforme, tamponnée et signée au guichet physique de la Mairie de Kaloum.</p>
                                {data.is_physical_pickup && (
                                    <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-200">
                                        <CheckCircle2 size={14} /> Sélectionné
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6">
                        <div className="flex items-start gap-3 max-w-xs">
                            <AlertCircle className="text-amber-500 shrink-0" size={16} />
                            <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">Assurez-vous que toutes les informations saisies correspondent à vos documents officiels.</p>
                        </div>
                        <button type="submit" disabled={processing} className="px-14 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 hover:bg-indigo-600 hover:-translate-y-2 transition-all flex items-center gap-4 group">
                            {processing ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle2 size={20} className="group-hover:scale-125 transition-transform" />}
                            Lancer la demande client
                        </button>
                    </div>
                </form>
            )}
        </CitizenLayout>
    );
}
