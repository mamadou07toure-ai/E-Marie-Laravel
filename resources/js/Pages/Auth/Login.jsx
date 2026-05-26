import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ShieldCheck, 
    Mail, 
    Lock, 
    ArrowRight, 
    CheckCircle2,
    ChevronLeft,
    Clock,
    UserCircle
} from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/connexion');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
            <Head title="Connexion - Smart e-Mairie" />

            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="/images/mairie_solidarite_hero_bg.png" 
                        className="w-full h-full object-cover scale-110" 
                        alt="Background" 
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/90 to-indigo-600/70"></div>
                
                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-[10px] font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Accès Citoyen Sécurisé
                        </div>
                        <h2 className="text-5xl font-black text-white leading-tight tracking-tight">Le service public, en un clic.</h2>
                        <p className="text-indigo-100 text-lg leading-relaxed font-medium">
                            Reprenez vos démarches là où vous les avez laissées. Votre mairie vous accompagne partout, tout le temps.
                        </p>
                    </div>

                    <div className="space-y-6 pt-12 border-t border-white/10">
                        {[
                            "Signature électronique certifiée",
                            "Archivage à valeur probante",
                            "Suivi de traitement instantané"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-8 h-8 bg-white/10 text-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform backdrop-blur-md border border-white/10">
                                    <CheckCircle2 size={16} />
                                </div>
                                <span className="font-bold text-white text-sm tracking-wide opacity-90">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Abstract decorative elements */}
                <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-[550px] bg-white p-8 md:p-16 flex flex-col justify-between relative z-10 shadow-2xl overflow-y-auto">
                <div className="max-w-md mx-auto w-full">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all mb-12 group text-[10px] font-black uppercase tracking-[0.2em]">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Retour à l'accueil
                    </Link>

                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                            <ShieldCheck size={28} className="text-white" />
                        </div>
                        <div>
                            <span className="font-black text-xl tracking-tighter text-slate-900 uppercase block leading-none">Smart</span>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">e-Mairie</span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Bon retour parmi nous</h1>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed italic">"Simplifier l'administration pour chaque citoyen."</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Identifiant / Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="citoyen@mairie.gn"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold placeholder:text-slate-200"
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-widest">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between mb-2 px-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de passe</label>
                                <Link href="/mot-de-passe-oublie" className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Oublié ?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold placeholder:text-slate-200"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                                    />
                                    <div className="w-5 h-5 border-2 border-slate-100 rounded-lg bg-slate-50 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Rester connecté</span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group mt-4 text-[11px] uppercase tracking-[0.2em]"
                        >
                            Accéder à mon espace
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Social proof or status */}
                    <div className="mt-12 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Disponibilité</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">Services accessibles 24h/24 et 7j/7.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-12 text-center border-t border-slate-50">
                    <p className="text-xs text-slate-400 font-bold">
                        Première visite ? <Link href="/inscription" className="font-black text-indigo-600 hover:underline uppercase tracking-widest ml-1">Créer un compte citoyen</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
