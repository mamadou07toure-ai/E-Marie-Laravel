import { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';
import axios from 'axios';
import {
    User,
    Mail,
    Phone,
    Lock,
    ShieldCheck,
    Camera,
    Check,
    Loader2,
    X
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Settings({ auth }) {
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(
        auth.user.avatar_path ? `/storage/${auth.user.avatar_path}` : null
    );
    const avatarInputRef = useRef(null);
    const [profile, setProfile] = useState({
        telephone: auth.user.telephone || '',
    });

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        setLoadingAvatar(true);
        try {
            const res = await axios.post('/api/v1/auth/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAvatarUrl(res.data.avatar_url);
            toast.success('Photo de profil mise à jour !');
        } catch {
            toast.error('Erreur lors de l\'upload. Max 2 Mo.');
        } finally {
            setLoadingAvatar(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            await axios.patch('/api/v1/auth/profile', profile);
            toast.success('Profil mis à jour avec succès !');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour.');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.password !== passwordData.password_confirmation) {
            toast.error('Les mots de passe ne correspondent pas.');
            return;
        }
        setLoadingPassword(true);
        try {
            await axios.patch('/api/v1/auth/password', passwordData);
            toast.success('Mot de passe modifié avec succès !');
            setShowPasswordModal(false);
            setPasswordData({ current_password: '', password: '', password_confirmation: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la modification.');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <CitizenLayout title="Mon Profil">
            <Head title="Paramètres - Smart e-Mairie" />
            <Toaster position="top-right" richColors />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Profile */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                            <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-600/20 border-4 border-white overflow-hidden">
                                {avatarUrl
                                    ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                    : <>{auth.user.nom?.[0]}{auth.user.prenom?.[0]}</>
                                }
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors">
                                {loadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                            </div>
                            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>

                        <div className="text-center md:text-left">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">{auth.user.prenom} {auth.user.nom}</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Citoyen numérique certifié</p>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Check size={12} /> Compte Actif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Infos Personnelles */}
                    <form onSubmit={handleProfileUpdate} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <User size={18} className="text-indigo-600" />
                            Informations Personnelles
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Adresse Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        type="email"
                                        value={auth.user.email}
                                        className="w-full bg-slate-100 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-500 outline-none cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        type="tel"
                                        value={profile.telephone}
                                        onChange={e => setProfile({ ...profile, telephone: e.target.value })}
                                        placeholder="+224 6XX XX XX XX"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-700 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingProfile}
                            className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                        >
                            {loadingProfile && <Loader2 size={14} className="animate-spin" />}
                            Enregistrer les modifications
                        </button>
                    </form>

                    {/* Sécurité */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <Lock size={18} className="text-indigo-600" />
                            Sécurité & Accès
                        </h3>

                        <div
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                    <Lock size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800">Changer le mot de passe</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Sécurisez votre compte</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest group-hover:underline">Modifier</span>
                        </div>

                        <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dernière connexion</p>
                            <p className="text-xs font-bold text-slate-600">Session active — aujourd'hui</p>
                        </div>
                    </div>
                </div>

                {/* Account Security Info */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 flex gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h4 className="font-black text-indigo-900 text-sm uppercase tracking-tight mb-2">Protection des données personnelles</h4>
                        <p className="text-indigo-800/70 text-xs leading-relaxed font-medium">
                            Votre compte est protégé par chiffrement. Vos informations personnelles ne sont partagées qu'avec les agents habilités de la mairie pour le traitement de vos dossiers.
                        </p>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setShowPasswordModal(false)}
                >
                    <div
                        className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-black text-slate-900 uppercase tracking-tight">Nouveau mot de passe</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Mot de passe actuel</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.current_password}
                                    onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={passwordData.password}
                                    onChange={e => setPasswordData({ ...passwordData, password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.password_confirmation}
                                    onChange={e => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 py-3 border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loadingPassword}
                                    className="flex-1 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                                >
                                    {loadingPassword && <Loader2 size={14} className="animate-spin" />}
                                    Mettre à jour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CitizenLayout>
    );
}
