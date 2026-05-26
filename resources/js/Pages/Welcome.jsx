import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ShieldCheck, 
    ChevronRight, 
    FileText, 
    Users, 
    Clock, 
    ArrowRight,
    MapPin,
    Phone,
    Mail,
    Globe,
    CheckCircle2,
    Lock,
    Zap,
    Building2,
    Target,
    Heart
} from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
            <Head title="Portail Citoyen - Smart e-Mairie" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100/80 transition-luxury">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-mairie-blue to-mairie-cyan rounded-2xl flex items-center justify-center shadow-lg shadow-mairie-blue/15 hover:rotate-6 transition-transform">
                            <ShieldCheck size={22} className="text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tight text-slate-900 uppercase">
                            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-mairie-blue to-mairie-cyan">e-Mairie</span>
                        </span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
                        <a href="#services" className="hover:text-mairie-cyan transition-colors">Services</a>
                        <a href="#about" className="hover:text-mairie-cyan transition-colors">À propos</a>
                        <a href="#contact" className="hover:text-mairie-cyan transition-colors">Contact</a>
                    </div>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <Link 
                                href={auth.user.role === 'agent' ? '/agent/tableau-de-bord' : '/citoyen/tableau-de-bord'}
                                className="px-6 py-3 bg-gradient-to-r from-mairie-blue to-mairie-blue-light text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-mairie-blue/10"
                            >
                                Mon Tableau de bord
                            </Link>
                        ) : (
                            <>
                                <Link href="/connexion" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-mairie-cyan transition-colors">Connexion</Link>
                                <Link 
                                    href="/inscription" 
                                    className="px-6 py-3 bg-gradient-to-r from-mairie-blue to-mairie-cyan text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-mairie-blue/10"
                                >
                                    S'inscrire
                                </Link>
                            </>
                        )}
                    </div>
                </div>            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-gradient-to-b from-slate-50/50 to-white"></div>
                    <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-mairie-cyan/8 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-mairie-blue/6 rounded-full blur-[150px] animate-pulse"></div>
                    <img 
                        src="/hero_bg.png" 
                        className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-5 blur-xs mask-gradient"
                        alt=""
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mairie-cyan/10 text-mairie-cyan-dark text-[10px] font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-mairie-cyan animate-ping"></span>
                            Nouveau : Tous vos actes en ligne
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.08] tracking-tight">
                            Votre Mairie, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mairie-blue via-indigo-650 to-mairie-cyan">Toujours avec vous.</span>
                        </h1>
                        <p className="text-base font-medium text-slate-550 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Simplifiez vos démarches administratives grâce à notre plateforme sécurisée. État civil, urbanisme, demandes d'actes... Tout se fait désormais en quelques clics.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link 
                                href="/inscription" 
                                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-mairie-blue hover:scale-105 active:scale-95 transition-luxury shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                            >
                                Commencer maintenant <ArrowRight size={14} />
                            </Link>
                            <a href="#services" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-luxury border border-slate-200 flex items-center justify-center gap-2">
                                Voir les services
                            </a>
                        </div>
                    </div>

                    <div className="relative group lg:block hidden">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-mairie-blue/10 to-mairie-cyan/10 rounded-[2.5rem] blur-2xl group-hover:opacity-100 transition-luxury"></div>
                        <div className="relative bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden p-3 transition-luxury group-hover:scale-[1.01]">
                             <img 
                                src="/hero_bg.png" 
                                className="w-full h-auto rounded-[2rem] shadow-sm"
                                alt="Modern Mairie"
                            />
                        </div>
                        
                        {/* Satisfaction Badge with Image */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-3 rounded-card shadow-2xl border border-slate-100/80 animate-bounce-slow flex items-center gap-4 max-w-xs">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                                <img src="/citoyens_satisfaits.png" className="w-full h-full object-cover" alt="Citoyens satisfaits" />
                            </div>
                            <div className="pr-4">
                                <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">98%</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Satisfaction Citoyenne</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Clock, title: "Rapide", desc: "Traitement de vos dossiers en moins de 48h." },
                        { icon: Lock, title: "Sécurisé", desc: "Vos données sont cryptées et protégées à 100%." },
                        { icon: Zap, title: "Efficace", desc: "Plus besoin de vous déplacer, tout se fait en ligne." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-mairie-cyan/30 transition-luxury hover:shadow-xl hover:shadow-mairie-blue/5 group">
                            <div className="w-14 h-14 bg-mairie-cyan/10 text-mairie-cyan rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon size={26} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-550 leading-relaxed text-sm font-semibold">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-tr from-mairie-blue to-mairie-cyan rounded-[3rem] rotate-3 relative overflow-hidden shadow-2xl">
                             <img 
                                src="/citoyens_satisfaits.png" 
                                className="w-full h-full object-cover -rotate-3 scale-110 opacity-80"
                                alt="Équipe Mairie"
                            />
                        </div>
                        <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-card shadow-xl border border-slate-100 max-w-xs">
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-mairie-blue to-mairie-cyan font-black text-4xl mb-1">10+</p>
                            <p className="text-xs font-black text-slate-700 leading-normal">Années d'innovation au service de la commune.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Engagés pour une administration transparente et moderne.</h2>
                            <p className="text-base font-medium text-slate-550 leading-relaxed">
                                Smart e-Mairie n'est pas seulement une plateforme, c'est une vision du service public au 21ème siècle. Nous croyons que la technologie doit simplifier la vie de chaque citoyen.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Target, title: "Notre Mission", desc: "Digitaliser 100% des services municipaux d'ici 2027." },
                                { icon: Heart, title: "Notre Valeur", desc: "Placer l'humain au cœur de chaque ligne de code." }
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="w-10 h-10 bg-mairie-cyan/10 text-mairie-cyan rounded-xl flex items-center justify-center">
                                        <item.icon size={18} />
                                    </div>
                                    <h4 className="font-black text-slate-800 text-sm tracking-tight">{item.title}</h4>
                                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                             <button className="flex items-center gap-2 text-mairie-blue font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                                En savoir plus sur notre vision <ArrowRight size={14} />
                             </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Un accès complet aux services municipaux</h2>
                        <p className="text-slate-550 leading-relaxed font-semibold">Découvrez la liste des démarches que vous pouvez effectuer dès aujourd'hui sans vous rendre physiquement à la mairie.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Acte de Naissance", icon: FileText, color: "bg-blue-50 text-blue-600" },
                            { title: "Certificat de Résidence", icon: MapPin, color: "bg-amber-50 text-amber-600" },
                            { title: "Acte de Mariage", icon: Users, color: "bg-red-50 text-red-600" },
                            { title: "Permis de Construire", icon: Globe, color: "bg-green-50 text-green-600" },
                            { title: "Légalisation", icon: ShieldCheck, color: "bg-purple-50 text-purple-600" },
                            { title: "Demande d'Audience", icon: Mail, color: "bg-slate-100 text-slate-650" },
                        ].map((service, i) => (
                            <Link 
                                key={i} 
                                href="/inscription"
                                className="bg-white border border-slate-200/60 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-mairie-blue/5 hover:-translate-y-1 transition-luxury group relative overflow-hidden"
                            >
                                <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                                    <service.icon size={26} />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-2">{service.title}</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Disponible en ligne</p>
                                <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-mairie-blue to-mairie-cyan group-hover:w-full transition-all duration-500"></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-slate-950 text-white pt-24 pb-12 overflow-hidden relative border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-mairie-blue to-mairie-cyan rounded-xl flex items-center justify-center">
                                <ShieldCheck size={22} className="text-white" />
                            </div>
                            <span className="font-black text-xl tracking-tight uppercase">Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-mairie-blue to-mairie-cyan">e-Mairie</span></span>
                        </div>
                        <p className="text-slate-400 max-w-md leading-relaxed text-sm font-semibold">
                            Le portail officiel de votre administration communale. Engagés pour une gouvernance transparente, moderne et accessible à tous.
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-mairie-cyan">Liens rapides</h4>
                        <ul className="space-y-4 text-xs font-black uppercase tracking-wider text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Accueil</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">F.A.Q</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Mentions Légales</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-mairie-cyan">Contact</h4>
                        <ul className="space-y-4 text-xs font-black uppercase tracking-wider text-slate-400">
                            <li className="flex items-center gap-3">
                                <Phone size={14} className="text-mairie-cyan" />
                                +224 621 00 00 00
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={14} className="text-mairie-cyan" />
                                contact@mairie.gn
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 italic lowercase tracking-normal">
                                Ouvert de 08h00 à 16h30
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
                    <p>© 2026 Smart e-Mairie. Développé par l'Agence Nationale du Numérique.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Facebook</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>

                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-mairie-cyan/5 rounded-full blur-[120px]"></div>
            </footer>
        </div>
    );
}
