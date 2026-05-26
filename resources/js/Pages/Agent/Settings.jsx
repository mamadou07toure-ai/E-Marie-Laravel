import { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AgentLayout from '@/Layouts/AgentLayout';
import axios from 'axios';
import { User, Mail, Phone, Shield, Lock, Loader2, X, Camera } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Settings({ auth }) {
    const [loading, setLoading] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(
        auth.user.avatar_path ? `/storage/${auth.user.avatar_path}` : null
    );
    const avatarInputRef = useRef(null);
    const [profile, setProfile] = useState({
        nom: auth.user.nom,
        prenom: auth.user.prenom,
        telephone: auth.user.telephone,
    });

    const [showPasswordModal, setShowPasswordModal] = useState(false);
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
        setLoading(true);
        try {
            await axios.patch('/api/v1/auth/profile', profile);
            toast.success('Profil mis à jour avec succès !');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.patch('/api/v1/auth/password', passwordData);
            toast.success('Mot de passe modifié !');
            setShowPasswordModal(false);
            setPasswordData({ current_password: '', password: '', password_confirmation: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la modification.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AgentLayout title="Paramètres">
            <Head title="Paramètres - Espace Agent" />
            <Toaster position="top-right" richColors />

            <div className="max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Paramètres du compte</h1>
                    <p className="text-slate-500 text-sm">Gérez vos informations personnelles et vos préférences de sécurité.</p>
                </div>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <form onSubmit={handleProfileUpdate} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <User size={18} className="text-indigo-500" />
                                Informations de profil
                            </h3>
                        </div>
                        <div className="p-6 pb-0 flex items-center gap-4">
                            <div className="relative cursor-pointer group" onClick={() => avatarInputRef.current?.click()}>
                                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 font-black flex items-center justify-center text-xl overflow-hidden border border-indigo-200 shadow-sm">
                                    {avatarUrl
                                        ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                        : <>{auth.user.prenom?.[0]}{auth.user.nom?.[0]}</>
                                    }
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow group-hover:border-indigo-500 transition-colors">
                                    {loadingAvatar ? <Loader2 size={10} className="animate-spin text-indigo-500" /> : <Camera size={10} className="text-slate-400" />}
                                </div>
                                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{auth.user.prenom} {auth.user.nom}</p>
                                <p className="text-xs text-slate-400">Cliquez sur la photo pour modifier</p>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Prénom</label>
                                <input 
                                    type="text" 
                                    value={profile.prenom} 
                                    onChange={e => setProfile({...profile, prenom: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nom</label>
                                <input 
                                    type="text" 
                                    value={profile.nom} 
                                    onChange={e => setProfile({...profile, nom: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email professionnel</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input type="email" value={auth.user.email} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={profile.telephone} 
                                        onChange={e => setProfile({...profile, telephone: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin" size={14} />}
                                Sauvegarder les modifications
                            </button>
                        </div>
                    </form>

                    {/* Security Section */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Shield size={18} className="text-indigo-500" />
                                Sécurité et Accès
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div 
                                onClick={() => setShowPasswordModal(true)}
                                className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Changer le mot de passe</p>
                                        <p className="text-xs text-slate-500">Sécurisez votre compte avec un mot de passe fort</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-indigo-600 group-hover:underline">Modifier</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">Nouveau mot de passe</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mot de passe actuel</label>
                                <input 
                                    type="password" 
                                    required
                                    value={passwordData.current_password}
                                    onChange={e => setPasswordData({...passwordData, current_password: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nouveau mot de passe</label>
                                <input 
                                    type="password" 
                                    required
                                    value={passwordData.password}
                                    onChange={e => setPasswordData({...passwordData, password: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirmer le mot de passe</label>
                                <input 
                                    type="password" 
                                    required
                                    value={passwordData.password_confirmation}
                                    onChange={e => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50 transition-all"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                                >
                                    {loading && <Loader2 className="animate-spin" size={16} />}
                                    Mettre à jour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AgentLayout>
    );
}
