import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    UserPlus,
    Search,
    Mail,
    UserCheck,
    UserMinus,
    X,
    MoreHorizontal,
    ShieldCheck,
    Briefcase,
    Filter,
    Users,
    Edit,
    Trash2,
    UserCircle,
    Phone,
    Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export default function Index({ auth, users, filters, counts = {} }) {
    const activeTab = filters?.tab ?? 'personnel';
    const [showAddModal, setShowAddModal] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');

    // Add dropdown and modal states
    const [activeDropdownUserId, setActiveDropdownUserId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        prenom: '',
        email: '',
        role: 'agent',
        password: '',
    });

    const editForm = useForm({
        nom: '',
        prenom: '',
        email: '',
        role: 'agent',
        password: '',
    });

    const openEditModal = (user) => {
        setSelectedUser(user);
        editForm.setData({
            nom: user.nom || '',
            prenom: user.prenom || '',
            email: user.email || '',
            role: user.role || 'agent',
            password: '',
        });
        setShowEditModal(true);
        setActiveDropdownUserId(null);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(`/admin/utilisateurs/${selectedUser.id}`, {
            onSuccess: () => {
                setShowEditModal(false);
                setSelectedUser(null);
                editForm.reset();
                toast.success('Compte agent modifié avec succès');
            },
        });
    };

    const handleDeleteSubmit = (e) => {
        e.preventDefault();
        router.delete(`/admin/utilisateurs/${userToDelete.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setUserToDelete(null);
                toast.success('Compte supprimé avec succès');
            },
            onError: (err) => {
                toast.error(err.error || 'Erreur lors de la suppression');
            }
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/utilisateurs', { search }, { preserveState: true });
    };

    const submit = (e) => {
        e.preventDefault();
        post('/admin/utilisateurs', {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
                toast.success('Compte agent créé avec succès');
            },
        });
    };

    const switchTab = (tab) => {
        router.get('/admin/utilisateurs', { tab, search: '' }, { preserveState: false });
    };

    const toggleStatus = (id, name) => {
        router.post(`/admin/utilisateurs/${id}/toggle`, {}, {
            onSuccess: () => toast.success(`Statut de ${name} mis à jour`),
        });
    };

    return (
        <AdminLayout title="Gestion des Utilisateurs">
            <Head title="Gestion des Utilisateurs - Smart e-Mairie" />

            <div className="space-y-10">
                {/* Header Action Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-mairie-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 transition-all duration-500 group-hover:scale-150"></div>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-slate-950/20 border border-slate-900">
                            <Users size={28} className="text-mairie-cyan" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Gestion des Utilisateurs</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                                <ShieldCheck className="text-mairie-cyan" size={14} />
                                Personnel, agents et citoyens inscrits
                            </p>
                        </div>
                    </div>
                    {activeTab === 'personnel' && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-8 py-4 bg-gradient-to-r from-mairie-blue to-mairie-cyan text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-mairie-cyan/15 active:scale-95 flex items-center justify-center gap-3 relative z-10"
                        >
                            <UserPlus size={18} />
                            Nouveau compte agent
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm w-fit">
                    <button
                        onClick={() => switchTab('personnel')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === 'personnel'
                                ? 'bg-slate-950 text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Briefcase size={14} />
                        Personnel
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${activeTab === 'personnel' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {counts.personnel ?? 0}
                        </span>
                    </button>
                    <button
                        onClick={() => switchTab('citoyens')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === 'citoyens'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <UserCircle size={14} />
                        Citoyens inscrits
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${activeTab === 'citoyens' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {counts.citoyens ?? 0}
                        </span>
                    </button>
                </div>

                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                        <form onSubmit={handleSearch} className="relative flex-1 max-w-lg group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-mairie-cyan transition-colors" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={activeTab === 'citoyens' ? 'Rechercher un citoyen…' : 'Rechercher par nom ou email…'}
                                className="w-full bg-white border-none rounded-2xl pl-12 pr-6 py-4 text-[11px] font-black uppercase tracking-widest placeholder:text-slate-300 focus:ring-4 focus:ring-mairie-cyan/10 outline-none transition-all shadow-sm"
                            />
                        </form>
                        <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-slate-50 shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Filter size={14} /> {users?.length || 0} {activeTab === 'citoyens' ? 'citoyens' : 'membres'}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {activeTab === 'citoyens' ? (
                        /* ── Tableau Citoyens (lecture seule) ── */
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-indigo-50/50 border-b border-indigo-100/60 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
                                    <th className="px-10 py-6">Citoyen</th>
                                    <th className="px-10 py-6">Email</th>
                                    <th className="px-10 py-6">Téléphone</th>
                                    <th className="px-10 py-6">Inscrit le</th>
                                    <th className="px-10 py-6">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users && users.length > 0 ? users.map((user, i) => (
                                    <tr key={i} className="hover:bg-indigo-50/30 transition-all group">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center text-sm font-black shadow-inner">
                                                    {user.prenom?.[0]}{user.nom?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 tracking-tight">{user.prenom} {user.nom}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Citoyen</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                                                <Mail size={13} className="text-slate-300 shrink-0" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                                                <Phone size={13} className="text-slate-300 shrink-0" />
                                                {user.telephone || <span className="text-slate-300 italic">—</span>}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                                                <Calendar size={13} className="text-slate-300 shrink-0" />
                                                {new Date(user.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {user.is_active ? 'Actif' : 'Suspendu'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-32 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-200 mx-auto mb-4 border border-indigo-100 shadow-inner">
                                                    <UserCircle size={32} />
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Aucun citoyen inscrit</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Aucun compte citoyen enregistré pour le moment.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        ) : (
                        /* ── Tableau Personnel (agents / admins) ── */
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
                                    <th className="px-10 py-6">Agent / Personnel</th>
                                    <th className="px-10 py-6">Coordonnées</th>
                                    <th className="px-10 py-6">Rôle & Privilèges</th>
                                    <th className="px-10 py-6">Statut Compte</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users && users.length > 0 ? users.map((user, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-sm font-black italic shadow-inner group-hover:bg-gradient-to-tr group-hover:from-mairie-blue group-hover:to-mairie-cyan group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-mairie-cyan/15 transition-all">
                                                    {user.prenom[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 tracking-tight group-hover:text-mairie-cyan transition-colors">{user.prenom} {user.nom}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">
                                                        {user.last_login_at
                                                            ? 'Accès: ' + new Date(user.last_login_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                                                            : 'Jamais connecté'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2.5 text-slate-500 text-[11px] font-black tracking-tight group-hover:text-mairie-cyan transition-colors">
                                                <Mail size={14} className="text-slate-300" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${
                                                user.role === 'administrateur' ? 'bg-mairie-cyan/10 text-mairie-cyan border-mairie-cyan/15 font-black' : 'bg-slate-50 text-slate-500 border-slate-100'
                                            }`}>
                                                {user.role === 'administrateur' && <ShieldCheck size={12} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {user.is_active ? 'Opérationnel' : 'Suspendu'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => toggleStatus(user.id, user.prenom)}
                                                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm active:scale-95 ${
                                                        user.is_active
                                                            ? 'bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white'
                                                            : 'bg-emerald-50 text-emerald-500 border border-emerald-100 hover:bg-emerald-500 hover:text-white'
                                                    }`}
                                                >
                                                    {user.is_active ? <UserMinus size={18} /> : <UserCheck size={18} />}
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setActiveDropdownUserId(activeDropdownUserId === user.id ? null : user.id)}
                                                        className={`w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-2xl hover:bg-mairie-cyan hover:text-white hover:border-mairie-cyan transition-all shadow-sm ${activeDropdownUserId === user.id ? 'bg-mairie-cyan text-white border-mairie-cyan' : 'text-slate-300'}`}
                                                    >
                                                        <MoreHorizontal size={18} />
                                                    </button>

                                                    {activeDropdownUserId === user.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-45"
                                                                onClick={() => setActiveDropdownUserId(null)}
                                                            />
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                                                                <button
                                                                    onClick={() => openEditModal(user)}
                                                                    className="w-full text-left px-5 py-3 text-[11px] font-black text-slate-600 hover:bg-slate-50 hover:text-mairie-cyan transition-all uppercase tracking-widest flex items-center gap-3"
                                                                >
                                                                    <Edit size={14} className="text-slate-400" />
                                                                    Modifier
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setUserToDelete(user);
                                                                        setShowDeleteModal(true);
                                                                        setActiveDropdownUserId(null);
                                                                    }}
                                                                    className="w-full text-left px-5 py-3 text-[11px] font-black text-rose-600 hover:bg-rose-50 transition-all uppercase tracking-widest flex items-center gap-3"
                                                                >
                                                                    <Trash2 size={14} className="text-rose-400" />
                                                                    Supprimer
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-32 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100 shadow-inner">
                                                    <Users size={32} />
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Aucun agent</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Votre registre du personnel est actuellement vide.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        )} {/* end activeTab ternary */}
                    </div>
                </div>
            </div>

            {/* Premium Add Agent Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
                        <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Nouvel Agent</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Créez des accès sécurisés pour le personnel</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-300 rounded-2xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-12 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                                    <input 
                                        type="text" 
                                        value={data.prenom}
                                        onChange={e => setData('prenom', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                                    <input 
                                        type="text" 
                                        value={data.nom}
                                        onChange={e => setData('nom', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Email Institutionnelle</label>
                                <input 
                                    type="email" 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe provisoire</label>
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/30 hover:bg-slate-900 transition-all mt-6 active:scale-[0.98]"
                            >
                                {processing ? 'Initialisation...' : 'Finaliser la création'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Premium Edit Agent Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => { setShowEditModal(false); setSelectedUser(null); }}>
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
                        <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Modifier l'Agent</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Mettez à jour les accès et rôles de {selectedUser.prenom}</p>
                            </div>
                            <button onClick={() => { setShowEditModal(false); setSelectedUser(null); }} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-300 rounded-2xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-12 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                                    <input 
                                        type="text" 
                                        value={editForm.data.prenom}
                                        onChange={e => editForm.setData('prenom', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                                        required
                                    />
                                    {editForm.errors.prenom && <p className="text-rose-500 text-xs font-bold">{editForm.errors.prenom}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                                    <input 
                                        type="text" 
                                        value={editForm.data.nom}
                                        onChange={e => editForm.setData('nom', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                                        required
                                    />
                                    {editForm.errors.nom && <p className="text-rose-500 text-xs font-bold">{editForm.errors.nom}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Email Institutionnelle</label>
                                <input 
                                    type="email" 
                                    value={editForm.data.email}
                                    onChange={e => editForm.setData('email', e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                                    required
                                />
                                {editForm.errors.email && <p className="text-rose-500 text-xs font-bold">{editForm.errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe (laisser vide si inchangé)</label>
                                <input 
                                    type="password" 
                                    value={editForm.data.password}
                                    onChange={e => editForm.setData('password', e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                                    placeholder="••••••••"
                                />
                                {editForm.errors.password && <p className="text-rose-500 text-xs font-bold">{editForm.errors.password}</p>}
                            </div>
                            <button 
                                type="submit" 
                                disabled={editForm.processing} 
                                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/30 hover:bg-slate-900 transition-all mt-6 active:scale-[0.98]"
                            >
                                {editForm.processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Premium Delete Confirmation Modal */}
            {showDeleteModal && userToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}>
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
                        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter">Supprimer le compte</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Confirmation requise</p>
                            </div>
                            <button onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-300 rounded-2xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-10 space-y-6 text-center">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto border border-rose-100 shadow-inner">
                                <Trash2 size={36} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-slate-800">
                                    Êtes-vous sûr de vouloir supprimer définitivement le compte de l'agent <span className="font-black text-slate-950">{userToDelete.prenom} {userToDelete.nom}</span> ?
                                </p>
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                    Cette action est irréversible et supprimera tous ses accès.
                                </p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}
                                    className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDeleteSubmit}
                                    className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
