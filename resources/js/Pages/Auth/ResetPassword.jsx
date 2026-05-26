import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Lock, ShieldCheck, ChevronLeft, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function ResetPassword({ token, email }) {
    const [form, setForm] = useState({
        token,
        email,
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            toast.error('Les mots de passe ne correspondent pas.');
            return;
        }
        setLoading(true);
        try {
            await axios.post('/reset-password', form);
            setDone(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lien expiré ou invalide. Veuillez recommencer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <Head title="Réinitialisation du mot de passe - Smart e-Mairie" />
            <Toaster position="top-right" richColors />

            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-10 md:p-12">
                    <Link
                        href="/connexion"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all mb-10 group text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Retour à la connexion
                    </Link>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <div>
                            <span className="font-black text-xl tracking-tighter text-slate-900 uppercase block leading-none">Smart</span>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">e-Mairie</span>
                        </div>
                    </div>

                    {done ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-6 border border-green-100">
                                <CheckCircle2 size={32} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter mb-3">Mot de passe modifié</h1>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
                            </p>
                            <Link
                                href="/connexion"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                            >
                                Se connecter
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Nouveau mot de passe</h1>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                                Choisissez un mot de passe sécurisé d'au moins 8 caractères.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nouveau mot de passe</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                        <input
                                            type={showPwd ? 'text' : 'password'}
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd(v => !v)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                                        >
                                            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Confirmer le mot de passe</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                        <input
                                            type={showPwd ? 'text' : 'password'}
                                            value={form.password_confirmation}
                                            onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                                            placeholder="••••••••"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                                >
                                    {loading && <Loader2 size={16} className="animate-spin" />}
                                    Réinitialiser le mot de passe
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
