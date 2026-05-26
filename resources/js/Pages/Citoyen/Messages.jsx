import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';
import axios from 'axios';
import {
    MessageSquare,
    Search,
    Send,
    CheckCheck,
    Trash2,
    Edit2,
    X,
    Loader2,
    UserCheck,
    ArrowLeft,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Messages({ auth, initial_agent_id }) {
    const [conversations, setConversations] = useState([]);
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations().then((convs) => {
            if (!initial_agent_id || convs === null) return;
            const existing = convs.find(c => c.user_id === initial_agent_id);
            if (existing) {
                openConversation(initial_agent_id, existing.user);
            } else {
                fetchUserAndOpen(initial_agent_id);
            }
        });
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Polling messages toutes les 5s quand une conversation est ouverte
    useEffect(() => {
        if (!selectedUserId) return;
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`/api/v1/messages/${selectedUserId}`);
                setMessages(res.data.messages);
            } catch {}
        }, 5000);
        return () => clearInterval(interval);
    }, [selectedUserId]);

    const fetchConversations = async () => {
        setLoadingConvs(true);
        try {
            const res = await axios.get('/api/v1/messages/conversations');
            const data = res.data || [];
            setConversations(data);
            return data;
        } catch (err) {
            console.error('Conversations error:', err.response?.status, err.response?.data);
            toast.error('Impossible de charger les conversations.');
            return null;
        } finally {
            setLoadingConvs(false);
        }
    };

    const fetchUserAndOpen = async (userId) => {
        try {
            const res = await axios.get(`/api/v1/messages/${userId}`);
            setSelectedUserId(userId);
            setSelectedUser(res.data.user);
            setMessages(res.data.messages);
        } catch {
            toast.error('Impossible d\'ouvrir cette conversation.');
        }
    };

    const openConversation = async (userId, user) => {
        setSelectedUserId(userId);
        setSelectedUser(user);
        setLoadingMessages(true);
        try {
            const res = await axios.get(`/api/v1/messages/${userId}`);
            setMessages(res.data.messages);
            // Refresh conversation list to clear unread count
            fetchConversations();
        } catch {
            toast.error('Impossible de charger les messages.');
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUserId) return;

        if (editingMessage) {
            setSendingMessage(true);
            try {
                const res = await axios.patch(`/api/v1/messages/${editingMessage.id}`, { contenu: newMessage });
                setMessages(prev => prev.map(m => m.id === editingMessage.id ? res.data : m));
                setEditingMessage(null);
                setNewMessage('');
                toast.success('Message modifié.');
            } catch {
                toast.error('Erreur lors de la modification.');
            } finally {
                setSendingMessage(false);
            }
            return;
        }

        setSendingMessage(true);
        const optimisticId = Date.now();
        const optimistic = {
            id: optimisticId,
            sender_id: auth.user.id,
            receiver_id: selectedUserId,
            contenu: newMessage,
            lu: false,
            created_at: new Date().toISOString(),
            edited_at: null,
            sender: { id: auth.user.id, nom: auth.user.nom, prenom: auth.user.prenom },
            _pending: true,
        };
        setMessages(prev => [...prev, optimistic]);
        setNewMessage('');

        try {
            const res = await axios.post('/api/v1/messages', {
                receiver_id: selectedUserId,
                contenu: optimistic.contenu,
            });
            setMessages(prev => prev.map(m => m.id === optimisticId ? res.data : m));
            fetchConversations();
        } catch {
            setMessages(prev => prev.filter(m => m.id !== optimisticId));
            setNewMessage(optimistic.contenu);
            toast.error('Erreur lors de l\'envoi.');
        } finally {
            setSendingMessage(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/v1/messages/${id}`);
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch {
            toast.error('Impossible de supprimer ce message.');
        }
    };

    const startEdit = (message) => {
        setEditingMessage(message);
        setNewMessage(message.contenu);
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setNewMessage('');
    };

    const filteredConversations = conversations.filter(c =>
        `${c.user?.prenom} ${c.user?.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        return isToday
            ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            : date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    };

    return (
        <CitizenLayout title="Messagerie">
            <Head title="Messagerie - Smart e-Mairie" />
            <Toaster position="top-right" richColors />

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 12rem)' }}>
                <div className="flex h-full">
                    {/* Sidebar — Conversation list */}
                    <div className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-5 border-b border-slate-50">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Messagerie</h2>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 border border-slate-100 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loadingConvs ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="animate-spin text-indigo-500" size={24} />
                                </div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                                        <MessageSquare size={28} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucune conversation</p>
                                    <p className="text-[10px] text-slate-300 font-bold mt-1">Contactez un agent depuis un dossier</p>
                                </div>
                            ) : (
                                filteredConversations.map(conv => (
                                    <button
                                        key={conv.user_id}
                                        onClick={() => openConversation(conv.user_id, conv.user)}
                                        className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-indigo-50/30 transition-all text-left border-b border-slate-50 ${selectedUserId === conv.user_id ? 'bg-indigo-50/50' : ''}`}
                                    >
                                        <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600 font-black flex items-center justify-center text-sm shrink-0">
                                            {conv.user?.prenom?.[0]}{conv.user?.nom?.[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-black text-slate-900 truncate">{conv.user?.prenom} {conv.user?.nom}</p>
                                                <span className="text-[9px] text-slate-400 font-bold shrink-0 ml-2">{formatTime(conv.last_time)}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-0.5">
                                                <p className="text-[10px] text-slate-400 truncate font-medium">{conv.last_message}</p>
                                                {conv.unread > 0 && (
                                                    <span className="ml-2 w-5 h-5 bg-indigo-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shrink-0">
                                                        {conv.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Main — Chat window */}
                    <div className={`flex-1 flex flex-col ${selectedUserId ? 'flex' : 'hidden md:flex'}`}>
                        {selectedUserId && selectedUser ? (
                            <>
                                {/* Chat header */}
                                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                                    <button
                                        onClick={() => setSelectedUserId(null)}
                                        className="md:hidden p-2 text-slate-400 hover:text-slate-600"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 font-black flex items-center justify-center text-sm">
                                        {selectedUser.prenom?.[0]}{selectedUser.nom?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{selectedUser.prenom} {selectedUser.nom}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <UserCheck size={11} className="text-indigo-500" />
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Agent État Civil</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
                                    {loadingMessages ? (
                                        <div className="flex items-center justify-center h-full">
                                            <Loader2 className="animate-spin text-indigo-500" size={28} />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Démarrez la conversation</p>
                                        </div>
                                    ) : (
                                        messages.map(msg => {
                                            const isMe = msg.sender_id === auth.user.id;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`group max-w-xs lg:max-w-md relative ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                                        <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                                                            isMe
                                                                ? 'bg-indigo-600 text-white rounded-br-sm'
                                                                : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-bl-sm'
                                                        } ${msg._pending ? 'opacity-70' : ''}`}>
                                                            {msg.contenu}
                                                        </div>
                                                        <div className={`flex items-center gap-2 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                            <span className="text-[9px] text-slate-400 font-bold">{formatTime(msg.created_at)}</span>
                                                            {msg.edited_at && <span className="text-[9px] text-slate-300 italic">modifié</span>}
                                                            {isMe && !msg._pending && (
                                                                <CheckCheck size={12} className={msg.lu ? 'text-indigo-500' : 'text-slate-300'} />
                                                            )}
                                                        </div>
                                                        {isMe && !msg._pending && (
                                                            <div className={`hidden group-hover:flex items-center gap-1 absolute -top-8 right-0 bg-white border border-slate-100 rounded-xl shadow-lg px-2 py-1`}>
                                                                <button onClick={() => startEdit(msg)} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                                                                    <Edit2 size={12} />
                                                                </button>
                                                                <button onClick={() => handleDelete(msg.id)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors">
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                {editingMessage && (
                                    <div className="px-6 py-2 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Edit2 size={12} className="text-indigo-600" />
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Modification en cours</span>
                                        </div>
                                        <button onClick={cancelEdit} className="text-indigo-400 hover:text-indigo-600">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <form onSubmit={handleSend} className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-white">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder="Écrire un message..."
                                        className="flex-1 bg-slate-50 rounded-2xl px-5 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 border border-slate-100 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || sendingMessage}
                                        className="w-11 h-11 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                    >
                                        {sendingMessage ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-300 mb-6 border border-indigo-100">
                                    <MessageSquare size={36} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">Messagerie sécurisée</h3>
                                <p className="text-slate-400 text-sm font-medium max-w-xs">
                                    Sélectionnez une conversation ou contactez un agent depuis un dossier.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CitizenLayout>
    );
}
