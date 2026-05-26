import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Mail, ShieldCheck, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/mot-de-passe-oublie/envoyer', { email });
            setSent(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi. Vérifiez votre adresse email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <Head title="Mot de passe oublié - Smart e-Mairie" />
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

                    {sent ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-6 border border-green-100">
                                <CheckCircle2 size={32} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter mb-3">Email envoyé</h1>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                                Si un compte correspond à <strong className="text-slate-700">{email}</strong>, vous recevrez un lien de réinitialisation sous peu.
                            </p>
                            <Link
                                href="/connexion"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                            >
                                Retour à la connexion
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Mot de passe oublié ?</h1>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                                Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Adresse Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="votre@email.gn"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold placeholder:text-slate-200"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                                >
                                    {loading && <Loader2 size={16} className="animate-spin" />}
                                    Envoyer le lien de réinitialisation
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
