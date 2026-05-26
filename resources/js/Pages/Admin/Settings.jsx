import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import {
    Settings as SettingsIcon,
    Shield,
    Bell,
    Lock,
    Globe,
    Mail,
    Save,
    RefreshCw,
    Cloud,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

const Toggle = ({ enabled, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

export default function Settings() {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        mairie_nom:   'Mairie Digitale de Conakry',
        mairie_email: 'support@mairie.gn',
        two_factor:   false,
        cloud_backup: false,
        maintenance:  false,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('/api/v1/settings');
                setSettings(prev => ({
                    ...prev,
                    mairie_nom:   res.data.mairie_nom   ?? prev.mairie_nom,
                    mairie_email: res.data.mairie_email ?? prev.mairie_email,
                    two_factor:   res.data.two_factor   === 'true' || res.data.two_factor === true,
                    cloud_backup: res.data.cloud_backup === 'true' || res.data.cloud_backup === true,
                    maintenance:  res.data.maintenance  === 'true' || res.data.maintenance === true,
                }));
            } catch {}
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('/api/v1/settings', {
                mairie_nom:   settings.mairie_nom,
                mairie_email: settings.mairie_email,
                two_factor:   settings.two_factor   ? 'true' : 'false',
                cloud_backup: settings.cloud_backup ? 'true' : 'false',
                maintenance:  settings.maintenance  ? 'true' : 'false',
            });
            toast.success('Paramètres sauvegardés avec succès.');
        } catch {
            toast.error('Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const set = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

    const tabs = [
        { id: 'general',       label: 'Général',       icon: Globe },
        { id: 'security',      label: 'Sécurité',      icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <AdminLayout title="Paramètres">
            <Head title="Paramètres — Administration" />
            <Toaster position="top-right" richColors />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Configuration du système</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Gérer les préférences globales de la plateforme</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Enregistrer
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Tabs */}
                    <div className="lg:w-56 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="animate-spin text-indigo-500" size={28} />
                            </div>
                        ) : (
                            <>
                                {/* General tab */}
                                {activeTab === 'general' && (
                                    <div className="space-y-6">
                                        <h3 className="text-base font-semibold text-gray-900 pb-4 border-b border-gray-100">Informations générales</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de la municipalité</label>
                                                <div className="relative">
                                                    <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={settings.mairie_nom}
                                                        onChange={e => set('mairie_nom', e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email de contact</label>
                                                <div className="relative">
                                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        value={settings.mairie_email}
                                                        onChange={e => set('mairie_email', e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Security tab */}
                                {activeTab === 'security' && (
                                    <div className="space-y-6">
                                        <h3 className="text-base font-semibold text-gray-900 pb-4 border-b border-gray-100">Options de sécurité</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                        <Lock size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Authentification à deux facteurs</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">Obligatoire pour les agents et admins</p>
                                                    </div>
                                                </div>
                                                <Toggle enabled={settings.two_factor} onChange={() => set('two_factor', !settings.two_factor)} />
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <Cloud size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Sauvegarde cloud automatique</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">Snapshots quotidiens de la base</p>
                                                    </div>
                                                </div>
                                                <Toggle enabled={settings.cloud_backup} onChange={() => set('cloud_backup', !settings.cloud_backup)} />
                                            </div>
                                        </div>

                                        {/* Danger zone */}
                                        <div className="mt-6 p-5 rounded-lg bg-red-50 border border-red-100">
                                            <div className="flex items-start gap-4">
                                                <AlertTriangle size={20} className="text-red-500 mt-0.5 shrink-0" />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-red-800">Mode maintenance</h4>
                                                    <p className="text-xs text-red-600 mt-1">Active le mode maintenance. Les citoyens ne pourront plus déposer de dossiers.</p>
                                                    <div className="flex items-center gap-4 mt-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => set('maintenance', !settings.maintenance)}
                                                            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                                                                settings.maintenance
                                                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                                                    : 'bg-white text-red-700 border border-red-200 hover:bg-red-100'
                                                            }`}
                                                        >
                                                            {settings.maintenance ? 'Désactiver' : 'Activer le mode maintenance'}
                                                        </button>
                                                        {settings.maintenance && (
                                                            <span className="flex items-center gap-1.5 text-xs text-red-600">
                                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                                Mode maintenance actif
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notifications tab */}
                                {activeTab === 'notifications' && (
                                    <div className="space-y-6">
                                        <h3 className="text-base font-semibold text-gray-900 pb-4 border-b border-gray-100">Préférences de notifications</h3>
                                        <p className="text-sm text-gray-500">Les notifications système sont envoyées automatiquement lors des changements de statut des dossiers. Configuration disponible dans les prochaines versions.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
