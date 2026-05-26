import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, BarChart3, Settings,
    LogOut, Menu, Bell, ShieldCheck, Monitor, FileText
} from 'lucide-react';
import { Toaster } from 'sonner';

const NAV = [
    { name: 'Tableau de bord',   href: '/admin/tableau-de-bord', icon: LayoutDashboard },
    { name: 'Gestion Dossiers',  href: '/admin/dossiers',        icon: FileText },
    { name: 'Gestion Personnel', href: '/admin/utilisateurs',    icon: Users },
    { name: 'Statistiques',      href: '/admin/statistiques',    icon: BarChart3 },
    { name: 'État Système',      href: '/admin/systeme',         icon: Monitor },
    { name: 'Paramètres',        href: '/admin/parametres',      icon: Settings },
];

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (href) => currentUrl === href || currentUrl.startsWith(href);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans antialiased">
            <Toaster position="top-right" richColors />

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-900/80 flex flex-col transition-all duration-300 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-900/50">
                    <div className="w-9 h-9 bg-gradient-to-tr from-mairie-blue to-mairie-cyan rounded-xl flex items-center justify-center shadow-lg shadow-mairie-cyan/10 ring-4 ring-mairie-cyan/15">
                        <ShieldCheck size={18} className="text-white" />
                    </div>
                    <div className="leading-none">
                        <p className="text-white font-black text-sm tracking-tight">Smart e-Mairie</p>
                        <p className="text-mairie-cyan text-[9px] font-black uppercase tracking-widest mt-1">Administration</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                    {NAV.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest relative transition-luxury ${
                                    active
                                        ? 'bg-slate-900/50 border border-slate-800/80 text-white shadow-xl shadow-black/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-900/40 hover:scale-[1.02] hover:translate-x-1 active:scale-95'
                                }`}
                            >
                                {active && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-mairie-cyan to-mairie-blue rounded-r-full shadow-lg shadow-mairie-cyan/50" />
                                )}
                                <item.icon size={16} className={`transition-transform duration-300 group-hover:scale-115 ${active ? 'text-mairie-cyan' : 'text-slate-400 group-hover:text-white'}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="p-4 border-t border-slate-900/50">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl mb-3 bg-slate-900/40 border border-slate-900/60">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-mairie-blue to-mairie-cyan flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg shadow-mairie-cyan/15 ring-2 ring-mairie-cyan/10">
                            {auth?.user?.prenom?.[0]}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-xs font-black truncate leading-none mb-1">{auth?.user?.prenom} {auth?.user?.nom}</p>
                            <p className="text-mairie-cyan text-[8px] font-black uppercase tracking-widest leading-none">Administrateur</p>
                        </div>
                    </div>
                    <Link
                        href="/logout" method="post" as="button"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-luxury text-xs font-black uppercase tracking-wider border border-transparent hover:border-rose-500/10"
                    >
                        <LogOut size={14} />
                        Déconnexion
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
                {/* Header */}
                <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-luxury">
                            <Menu size={18} />
                        </button>
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">{title}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/notifications"
                            className={`relative p-2.5 rounded-xl transition-luxury ${isActive('/admin/notifications') ? 'bg-mairie-cyan/10 text-mairie-cyan border border-mairie-cyan/15' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
                        </Link>
                        <div className="w-px h-5 bg-slate-200" />
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider text-emerald-500 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Mode Admin
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
