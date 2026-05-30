<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification Officielle — Registre Numérique Mairie</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background: radial-gradient(circle at top left, #0f172a 0%, #020617 100%);
        }
        .official-stamp {
            font-family: 'Playfair Display', serif;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 text-slate-100 relative overflow-x-hidden">
    <!-- Decorative Blurs -->
    <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

    <div class="w-full max-w-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative">
        <!-- Top Ribbon badge -->
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 text-slate-950">
            Serveur de Certification Sécurisé
        </div>

        <!-- Mairie Header -->
        <div class="text-center space-y-3 mt-4">
            <h1 class="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">RÉPUBLIQUE DE GUINÉE</h1>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">PORTAIL CIVIL NUMÉRIQUE</h2>
            <p class="text-xs text-slate-400 max-w-md mx-auto">Vérification et authentification instantanée des actes civils de la commune.</p>
        </div>

        <div class="my-10 border-t border-slate-800/80"></div>

        <!-- Seal of Authenticity -->
        <div class="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 shadow-inner relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
            <div class="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
            </div>
            <div class="text-center sm:text-left space-y-1">
                <div class="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Statut du Document</div>
                <div class="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    Document Authentique
                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <p class="text-xs text-emerald-300/80">Ce document a été signé numériquement et validé par la cellule administrative.</p>
            </div>
        </div>

        <!-- Document Details Table -->
        <div class="space-y-6">
            <h3 class="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Données Certifiées</h3>
            <div class="bg-slate-950/40 border border-slate-800/60 rounded-[2rem] p-6 sm:p-8 space-y-4">
                <div class="grid grid-cols-2 gap-y-6 text-xs">
                    <div>
                        <div class="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">RÉFÉRENCE DOSSIER</div>
                        <div class="font-extrabold text-white tracking-wider uppercase bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 inline-block">{{ $demande->numero_dossier }}</div>
                    </div>
                    <div>
                        <div class="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">TYPE D'ACTE</div>
                        <div class="font-extrabold text-indigo-400 uppercase">{{ $demande->typeDemande->libelle }}</div>
                    </div>
                    <div>
                        <div class="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">TITULAIRE (CITOYEN)</div>
                        <div class="font-extrabold text-white text-[13px]">{{ $demande->user->prenom }} {{ $demande->user->nom }}</div>
                        <div class="text-[10px] text-slate-400 italic mt-0.5">{{ $demande->user->email }}</div>
                    </div>
                    <div>
                        <div class="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">DATE DE VALIDATION</div>
                        <div class="font-extrabold text-white">{{ $demande->updated_at->translatedFormat('d F Y à H\hi') }}</div>
                    </div>
                    <div>
                        <div class="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">AGENT EN CHARGE</div>
                        <div class="font-extrabold text-white">{{ $demande->agent ? ($demande->agent->prenom . ' ' . $demande->agent->nom) : 'Administration Centrale' }}</div>
                    </div>
                    <div>
                        <div class="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">EMPREINTE NUMÉRIQUE</div>
                        <div class="font-mono text-[9px] text-slate-400 bg-slate-900/50 p-2 rounded-lg break-all border border-slate-800">SHA256:{{ hash('sha256', $demande->uuid . $demande->numero_dossier) }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Seal footer -->
        <div class="mt-12 flex flex-col items-center justify-center gap-4 text-center border-t border-slate-800/80 pt-8">
            <div class="official-stamp text-xs font-bold text-slate-400/60 uppercase tracking-[0.2em] italic">
                Cachet Électronique e-Mairie Certifié
            </div>
            <div class="text-[9px] text-slate-500">
                Généré automatiquement par le serveur de la Commune. &copy; {{ date('Y') }} Mairie de la Commune. Tous droits réservés.
            </div>
        </div>
    </div>
</body>
</html>
