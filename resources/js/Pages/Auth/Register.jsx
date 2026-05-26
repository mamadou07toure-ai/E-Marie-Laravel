import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ShieldCheck, 
    User, 
    Mail, 
    Phone, 
    Lock, 
    ArrowRight, 
    CheckCircle2,
    ChevronLeft,
    FileText
} from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/inscription', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
            <Head title="Inscription - Smart e-Mairie" />

            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="/citoyens_satisfaits.png" 
                        className="w-full h-full object-cover scale-110" 
                        alt="Background" 
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/90 to-indigo-600/70"></div>
                
                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Inscription Citoyenne
                        </div>
                        <h2 className="text-5xl font-black text-white leading-tight">Créez votre identité numérique.</h2>
                        <p className="text-indigo-100 text-lg leading-relaxed">
                            Accédez à tous les services de la mairie sans quitter votre domicile. Simple, rapide et 100% sécurisé.
                        </p>
                    </div>

                    <div className="space-y-6 pt-12 border-t border-white/10">
                        {[
                            "Suivi de dossiers en temps réel",
                            "Archivage numérique de vos actes",
                            "Notifications instantanées"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={18} />
                                </div>
                                <span className="font-bold text-white text-sm tracking-wide">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-[550px] bg-white p-8 md:p-12 flex flex-col justify-between relative z-10 shadow-2xl overflow-y-auto">
                <div className="max-w-md mx-auto w-full">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-8 group text-sm font-bold">
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Retour à l'accueil
                    </Link>

                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tight text-slate-900 uppercase">Smart <span className="text-indigo-600">e-Mairie</span></span>
                    </div>

                    <div className="space-y-2 mb-8 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Devenir citoyen numérique</h1>
                        <p className="text-slate-500 text-sm leading-relaxed">Remplissez le formulaire ci-dessous pour créer votre compte et commencer vos démarches.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5 pb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Nom</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={data.nom}
                                        onChange={e => setData('nom', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                                        required
                                    />
                                </div>
                                {errors.nom && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.nom}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Prénom</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={data.prenom}
                                        onChange={e => setData('prenom', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                                        required
                                    />
                                </div>
                                {errors.prenom && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.prenom}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Adresse Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="email" 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="jean.dupont@mail.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="tel" 
                                    value={data.telephone}
                                    onChange={e => setData('telephone', e.target.value)}
                                    placeholder="+224 6XX XX XX XX"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                                    required
                                />
                            </div>
                            {errors.telephone && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.telephone}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                                    required
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.password}</p>}
                        </div>

                        <div className="flex items-start gap-3 pt-2">
                            <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                J'accepte les <a href="#" className="font-bold text-indigo-600 hover:underline">Conditions d'Utilisation</a> et la <a href="#" className="font-bold text-indigo-600 hover:underline">Politique de Confidentialité</a>.
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group mt-4"
                        >
                            Créer mon compte 
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                <div className="pt-8 text-center border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                        Vous avez déjà un compte ? <Link href="/connexion" className="font-black text-indigo-600 hover:underline">Connectez-vous ici</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
