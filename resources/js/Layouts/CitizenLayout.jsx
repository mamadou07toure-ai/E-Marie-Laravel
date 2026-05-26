import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import {
    LayoutDashboard, FileText, PlusCircle, Bell, LogOut,
    Menu, X, ChevronRight, Search, ShieldCheck, Clock, Check, MessageSquare
} from 'lucide-react';
import { Toaster } from 'sonner';

const NAV = [
    { name: 'Tableau de bord', href: '/citoyen/tableau-de-bord', icon: LayoutDashboard },
    { name: 'Mes dossiers',    href: '/citoyen/mes-dossiers',    icon: FileText },
    { name: 'Nouvelle demande',href: '/citoyen/nouvelle-demande',icon: PlusCircle },
    { name: 'Messages',         href: '/citoyen/messages',        icon: MessageSquare },
];

export default function CitizenLayout({ children, title }) {
    const { auth, notifications: initialNotifs = [] } = usePage().props;
    const currentUrl = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifs, setShowNotifs]   = useState(false);
    const [search, setSearch]           = useState('');
    const [notifs, setNotifs]           = useState(initialNotifs);

    const unread = notifs.filter(n => !n.lu).length;
    const [unreadMessages, setUnreadMessages] = useState(0);

    // Polling toutes les 30 secondes
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get('/api/v1/notifications');
                setNotifs(res.data);
            } catch {}
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const markRead = async (id) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
        await axios.patch(`/api/v1/notifications/${id}/lu`, {}, { withCredentials: true }).catch(() => {});
    };

    const markAllRead = async () => {
        setNotifs(prev => prev.map(n => ({ ...n, lu: true })));
        await axios.post('/api/v1/notifications/mark-all-read', {}, { withCredentials: true }).catch(() => {});
    };

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await axios.get('/api/v1/messages/conversations');
                const total = (res.data || []).reduce((sum, c) => sum + (c.unread || 0), 0);
                setUnreadMessages(total);
            } catch {}
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && search.trim()) {
            router.get('/citoyen/mes-dossiers', { search });
        }
    };

    const isActive = (href) => currentUrl === href || currentUrl.startsWith(href);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans antialiased">
            <Toaster position="top-right" richColors />

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-900/80 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-900">
                    <div className="w-8 h-8 bg-gradient-to-tr from-mairie-blue to-mairie-cyan rounded-xl flex items-center justify-center shadow-lg shadow-mairie-cyan/10">
                        <ShieldCheck size={18} className="text-white" />
                    </div>
                    <div className="leading-none">
                        <p className="text-white font-black text-xs uppercase tracking-wider">Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-mairie-blue to-mairie-cyan">e-Mairie</span></p>
                        <p className="text-mairie-cyan text-[9px] font-black uppercase tracking-widest mt-1">Espace Citoyen</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1.5">
                    {NAV.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-luxury ${
                                isActive(item.href)
                                    ? 'bg-gradient-to-r from-mairie-blue/40 to-mairie-cyan/15 text-white border-l-4 border-mairie-cyan shadow-lg'
                                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                            }`}
                        >
                            <item.icon size={16} className={isActive(item.href) ? 'text-mairie-cyan' : 'text-slate-400'} />
                            <span>{item.name}</span>
                            {item.href === '/citoyen/messages' && unreadMessages > 0 && (
                                <span className="ml-auto min-w-5 h-5 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center px-1">
                                    {unreadMessages}
                                </span>
                            )}
                            {isActive(item.href) && !(item.href === '/citoyen/messages' && unreadMessages > 0) && <ChevronRight size={14} className="ml-auto text-mairie-cyan opacity-80" />}
                        </Link>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="p-4 border-t border-slate-900">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2 bg-slate-900/20 border border-slate-900/50">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-mairie-blue to-mairie-cyan flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
                            {auth?.user?.avatar_path
                                ? <img src={`/storage/${auth.user.avatar_path}`} alt="avatar" className="w-full h-full object-cover" />
                                : <>{auth?.user?.prenom?.[0]}{auth?.user?.nom?.[0]}</>
                            }
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-xs font-bold truncate leading-none">{auth?.user?.prenom} {auth?.user?.nom}</p>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-wider mt-1.5">Citoyen</p>
                        </div>
                    </div>
                    <Link
                        href="/logout" method="post" as="button"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-luxury text-[10px] font-black uppercase tracking-wider"
                    >
                        <LogOut size={13} />
                        Déconnexion
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                            <Menu size={20} />
                        </button>
                        <h1 className="text-base font-semibold text-gray-800">{title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="hidden md:flex items-center relative">
                            <Search className="absolute left-3 text-gray-400" size={15} />
                            <input
                                type="text"
                                placeholder="Chercher un dossier…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifs(!showNotifs)}
                                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                <Bell size={20} />
                                {unread > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                                )}
                            </button>

                            {showNotifs && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifs(false)} />
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-800">Notifications</span>
                                            {unread > 0 && (
                                                <button onClick={markAllRead} className="text-xs text-indigo-600 font-medium hover:underline">
                                                    Tout marquer lu
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                                            {notifs.length === 0 ? (
                                                <p className="text-xs text-gray-400 text-center py-6">Aucune notification</p>
                                            ) : notifs.map(n => (
                                                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!n.lu ? 'bg-indigo-50/50' : ''}`}>
                                                    {!n.lu && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />}
                                                    <div className={`flex-1 min-w-0 ${n.lu ? 'pl-3.5' : ''}`}>
                                                        <p className={`text-sm ${!n.lu ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{n.message}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                            <Clock size={11} />
                                                            {new Date(n.created_at).toLocaleString('fr-FR')}
                                                        </p>
                                                    </div>
                                                    {!n.lu && (
                                                        <button onClick={() => markRead(n.id)} className="text-gray-300 hover:text-indigo-500 transition-colors shrink-0">
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-3 border-t border-gray-100 text-center">
                                            <Link href="/citoyen/notifications" onClick={() => setShowNotifs(false)} className="text-xs text-indigo-600 font-medium hover:underline">
                                                Voir toutes les notifications
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="w-px h-6 bg-gray-200 mx-1" />

                        <Link href="/citoyen/parametres" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                {auth?.user?.prenom?.[0]}
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-700">{auth?.user?.prenom}</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
