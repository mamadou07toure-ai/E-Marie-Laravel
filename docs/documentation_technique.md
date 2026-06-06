# Documentation Technique
## Smart e-Mairie — Portail Numérique de la Mairie

---

**Version** : 1.0  
**Date** : Juin 2026  
**Public cible** : Développeurs, équipe technique  

---

## Table des matières

1. [Stack technique](#1-stack-technique)
2. [Prérequis et installation](#2-prérequis-et-installation)
3. [Structure du projet](#3-structure-du-projet)
4. [Architecture applicative](#4-architecture-applicative)
5. [Base de données](#5-base-de-données)
6. [API REST — Référence complète](#6-api-rest--référence-complète)
7. [Authentification et sécurité](#7-authentification-et-sécurité)
8. [Services métier](#8-services-métier)
9. [Frontend — Composants clés](#9-frontend--composants-clés)
10. [Données de test](#10-données-de-test)

---

## 1. Stack technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Backend framework | Laravel | 13.8.0 |
| Langage serveur | PHP | 8.4.8 |
| Frontend library | React | 19.x |
| SPA bridge | Inertia.js | 3.x |
| CSS framework | Tailwind CSS | 4.x |
| Build tool | Vite | — |
| Base de données | MySQL | 8.x |
| Authentification | Laravel Sanctum | Session SPA |
| Génération PDF | barryvdh/laravel-dompdf | 3.1 |
| Icônes | Lucide React | — |
| Toasts | Sonner | — |
| Client HTTP | Axios | — |
| Tableaux Excel | maatwebsite/excel | 3.x |

---

## 2. Prérequis et installation

### 2.1 Prérequis système

| Outil | Version minimale |
|-------|-----------------|
| PHP | 8.3+ |
| Composer | 2.x |
| Node.js | 20.x |
| npm | 10.x |
| MySQL | 8.0+ |
| Git | 2.x |

### 2.2 Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-depot> mairie-digital
cd mairie-digital

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances Node.js
npm install

# 4. Configurer l'environnement
cp .env.example .env
php artisan key:generate
```

### 2.3 Configuration `.env`

```env
APP_NAME="Smart e-Mairie"
APP_ENV=local
APP_KEY=base64:...          # Généré par artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=emairie
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io  # Remplacer par votre SMTP
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS="noreply@mairie.gn"
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8000,127.0.0.1
SESSION_DRIVER=database
SESSION_LIFETIME=120

FILESYSTEM_DISK=public
```

### 2.4 Initialisation de la base de données

```bash
# Créer la base de données MySQL
mysql -u root -p -e "CREATE DATABASE emairie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Exécuter toutes les migrations
php artisan migrate

# Créer le lien symbolique pour le storage
php artisan storage:link

# Insérer les données de test
php artisan db:seed
```

### 2.5 Lancement en développement

```bash
# Terminal 1 — Serveur Laravel
php artisan serve

# Terminal 2 — Build Vite (hot reload)
npm run dev
```

L'application est accessible sur `http://localhost:8000`.

### 2.6 Build de production

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 3. Structure du projet

```
mairie-digital/
├── app/
│   ├── Enums/                    # Énumérations PHP
│   │   ├── PrioriteEnum.php
│   │   ├── RoleEnum.php
│   │   └── StatutDemandeEnum.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/V1/           # Tous les contrôleurs API
│   │   │       ├── AgentController.php
│   │   │       ├── AdminController.php
│   │   │       ├── AuthController.php
│   │   │       ├── CitoyenController.php
│   │   │       ├── DemandeController.php
│   │   │       ├── DocumentController.php
│   │   │       ├── DocumentTemplateController.php
│   │   │       ├── MessageController.php
│   │   │       ├── ProfileController.php
│   │   │       └── RendezVousController.php
│   │   ├── Middleware/
│   │   │   └── CheckRole.php     # Contrôle d'accès par rôle
│   │   └── Requests/
│   │       └── Demande/
│   │           └── StoreDemandeRequest.php
│   ├── Models/                   # Modèles Eloquent
│   │   ├── Demande.php
│   │   ├── DemandeNaissance.php
│   │   ├── DemandeResidence.php
│   │   ├── DemandeMariage.php
│   │   ├── DemandeLegalisation.php
│   │   ├── Document.php
│   │   ├── DocumentTemplate.php
│   │   ├── HistoriqueStatut.php
│   │   ├── Message.php
│   │   ├── Notification.php
│   │   ├── TypeDemande.php
│   │   └── User.php
│   └── Services/
│       └── DocumentGeneratorService.php
├── database/
│   ├── migrations/               # 25 migrations versionnées
│   └── seeders/                  # Données de test
├── docs/                         # Documentation du projet
│   ├── specifications.md
│   ├── diagrammes_uml.md
│   ├── plantuml_scripts.md
│   ├── manuel_utilisateur.md
│   ├── guide_administration.md
│   └── documentation_technique.md
├── resources/
│   ├── js/
│   │   ├── Layouts/              # Layouts par rôle
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AgentLayout.jsx
│   │   │   └── CitizenLayout.jsx
│   │   └── Pages/                # Pages Inertia/React
│   │       ├── Admin/
│   │       ├── Agent/
│   │       │   └── Demandes/
│   │       │       ├── Index.jsx
│   │       │       └── Show.jsx
│   │       ├── Auth/
│   │       └── Citoyen/
│   │           └── Demandes/
│   │               ├── Create.jsx
│   │               ├── Index.jsx
│   │               └── Show.jsx
│   └── views/
│       ├── app.blade.php         # Template racine Inertia
│       └── pdf/                  # Templates PDF Blade
├── routes/
│   ├── api.php                   # Routes API /api/v1/*
│   └── web.php                   # Routes web (Inertia)
├── storage/
│   └── app/public/
│       ├── documents/            # Pièces jointes citoyens
│       └── templates/            # Images des modèles documents
├── .env
├── composer.json
├── package.json
└── vite.config.js
```

---

## 4. Architecture applicative

### 4.1 Pattern MVC + SPA

```
Requête HTTP
     │
     ▼
routes/web.php (Inertia)
     │
     ▼
Controller → Inertia::render('Page', $props)
     │
     ▼
React Component (reçoit $props comme props React)
     │
     ▼ (appels axios pour les mutations)
routes/api.php (/api/v1/*)
     │
     ▼
API Controller → Response JSON
```

### 4.2 Flux d'authentification (Sanctum SPA)

```
1. POST /api/v1/auth/login
   → Laravel crée une session + cookie session + cookie XSRF-TOKEN

2. Requêtes suivantes
   → Axios envoie automatiquement :
     - Cookie de session (withCredentials: true)
     - Header X-XSRF-TOKEN (withXSRFToken: true)

3. Middleware auth:sanctum
   → Vérifie la session (mode stateful SPA)
   → Résout l'utilisateur courant

4. Middleware CheckRole
   → Vérifie que role ∈ [roles_autorisés]
```

### 4.3 Middleware CheckRole

```php
// Exemple d'utilisation dans les routes
Route::middleware(['auth:sanctum', 'role:agent,administrateur'])
    ->prefix('agent')
    ->group(function () { ... });

// Le middleware accepte plusieurs rôles séparés par virgule
// L'admin hérite des accès agent ET citoyen
```

### 4.4 Données partagées Inertia

Définies dans `HandleInertiaRequests::share()`, disponibles dans **toutes** les pages React :

```php
[
  'auth' => ['user' => $request->user()],  // Utilisateur connecté
  'notifications' => [...],                  // 20 dernières notifications
]
```

Accès en React :
```js
const { auth, notifications } = usePage().props;
```

---

## 5. Base de données

### 5.1 Liste des migrations (ordre chronologique)

| Migration | Description |
|-----------|-------------|
| `create_users_table` | Table users de base Laravel |
| `modify_users_table` | Ajout : prenom, nom, telephone, role, is_active |
| `create_types_demandes_table` | Catalogue des types de demandes |
| `create_demandes_table` | Table principale des dossiers |
| `create_historique_statuts_table` | Journal des changements de statut |
| `create_documents_table` | Pièces jointes |
| `create_notifications_table` | Notifications utilisateurs |
| `create_audit_logs_table` | Journal d'audit |
| `create_personal_access_tokens_table` | Tokens Sanctum |
| `add_donnees_formulaire_to_demandes` | Colonne JSON données formulaire |
| `create_demande_naissances_table` | Données acte de naissance |
| `create_demande_residences_table` | Données certificat de résidence |
| `create_demande_mariages_table` | Données certificat de mariage |
| `create_demande_legalisations_table` | Données légalisation |
| `create_demande_autorisations_table` | Données autorisation admin |
| `create_demande_changement_adresses_table` | Données changement d'adresse |
| `create_messages_table` | Messagerie interne |
| `add_avatar_to_users_table` | Avatar utilisateur |
| `create_settings_table` | Paramètres système clé/valeur |
| `add_piece_manquante_to_demandes` | Colonne pièce manquante |
| `create_rendez_vous_table` | Rendez-vous en mairie |
| `add_is_physical_pickup_to_demandes` | Retrait physique |
| `create_document_templates_table` | Modèles de documents image |

### 5.2 Énumérations

```php
// RoleEnum
enum RoleEnum: string {
    case CITOYEN        = 'citoyen';
    case AGENT          = 'agent';
    case ADMINISTRATEUR = 'administrateur';
}

// StatutDemandeEnum
enum StatutDemandeEnum: string {
    case EN_ATTENTE        = 'en_attente';
    case EN_COURS          = 'en_cours';
    case DOCUMENT_MANQUANT = 'document_manquant';
    case VALIDEE           = 'validee';
    case REJETEE           = 'rejetee';
}

// PrioriteEnum
enum PrioriteEnum: string {
    case NORMALE = 'normale';
    case HAUTE   = 'haute';
    case URGENTE = 'urgente';
}
```

### 5.3 Génération du numéro de dossier

Logique dans `Demande::booted()` (event `creating`) :

```php
$year  = date('Y');
$count = static::whereYear('created_at', $year)->count() + 1;
$demande->numero_dossier = "MAI-{$year}-" . str_pad($count, 5, '0', STR_PAD_LEFT);
// Exemple : MAI-2026-00001
```

---

## 6. API REST — Référence complète

> **Base URL** : `http://localhost:8000/api/v1`  
> **Auth** : Session Sanctum (cookie `laravel_session` + header `X-XSRF-TOKEN`)  
> **Format** : JSON (sauf upload fichiers → multipart/form-data)

---

### 6.1 Authentification

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| POST | `/auth/register` | Public | Inscription citoyen |
| POST | `/auth/login` | Public | Connexion |
| POST | `/auth/logout` | Auth | Déconnexion |
| GET | `/auth/me` | Auth | Utilisateur courant |
| PATCH | `/auth/profile` | Auth | Modifier profil |
| PATCH | `/auth/password` | Auth | Changer mot de passe |
| POST | `/auth/avatar` | Auth | Uploader avatar |

**POST /auth/register**
```json
// Body
{
  "prenom": "Ibrahima",
  "nom": "DIALLO",
  "email": "ibrahima@gmail.com",
  "telephone": "+224 600 000 000",
  "password": "motdepasse",
  "password_confirmation": "motdepasse"
}
// Réponse 201
{ "user": {...}, "message": "Compte créé." }
```

**POST /auth/login**
```json
// Body
{ "email": "ibrahima@gmail.com", "password": "motdepasse" }
// Réponse 200
{ "user": { "id": 4, "prenom": "Ibrahima", "role": "citoyen", ... } }
```

---

### 6.2 Demandes (Citoyen)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| GET | `/demandes/types` | citoyen | Types de demandes actifs |
| GET | `/demandes/stats` | citoyen | Statistiques personnelles |
| GET | `/demandes` | citoyen | Liste des demandes du citoyen |
| POST | `/demandes` | citoyen | Créer une demande (multipart) |
| GET | `/demandes/{uuid}` | citoyen | Détail d'une demande |
| POST | `/demandes/{uuid}/documents` | citoyen | Ajouter un document |
| GET | `/demandes/{uuid}/generer-document` | auth | Générer le PDF officiel |

**POST /demandes** (multipart/form-data)
```
type_demande_id  = "ACTE_NAISSANCE"
priorite         = "normale"
description      = "Demande effectuée via le portail."
fields[nom]      = "DIALLO"
fields[prenoms]  = "Ibrahima"
fields[date_naissance] = "1990-03-12"
fields[lieu_naissance] = "Conakry"
fields[genre]    = "M"
fields[nom_pere] = "DIALLO"
fields[prenom_pere]    = "Mamadou"
fields[date_naissance_pere] = "1960-01-01"
fields[profession_pere]     = "Commerçant"
fields[nom_mere] = "CAMARA"
fields[prenom_mere]    = "Fatoumata"
fields[date_naissance_mere] = "1965-06-15"
fields[profession_mere]     = "Ménagère"
fields[motif]    = "Renouvellement CNI"
fields[nombre_copies] = "2"
documents[0]     = <fichier binaire>
```
```json
// Réponse 201
{
  "message": "Votre demande officielle a été enregistrée.",
  "numero_dossier": "MAI-2026-00001"
}
```

---

### 6.3 Traitement Agent

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| GET | `/agent/stats` | agent | Statistiques de l'agent |
| GET | `/agent/demandes` | agent | Tous les dossiers (param: `mine=1`, `statut=...`) |
| GET | `/agent/demandes/{uuid}` | agent | Détail complet d'un dossier |
| POST | `/agent/demandes/{uuid}/assign` | agent | Prendre en charge |
| PATCH | `/agent/demandes/{uuid}/statut` | agent | Mettre à jour le statut |
| POST | `/agent/demandes/{uuid}/notes` | agent | Ajouter une note interne |

**PATCH /agent/demandes/{uuid}/statut**
```json
// Valider
{ "statut": "validee", "commentaire": "Dossier conforme." }

// Rejeter
{ "statut": "rejetee", "motif_rejet": "Pièce d'identité expirée.", "commentaire": "..." }

// Document manquant
{ "statut": "document_manquant", "piece_manquante": "Copie CNI en cours de validité" }

// Réponse 200
{ "message": "Statut mis à jour avec succès.", "demande": {...} }
```

---

### 6.4 Messagerie

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| GET | `/messages/conversations` | auth | Liste des conversations |
| GET | `/messages/{userId}` | auth | Messages avec un utilisateur |
| POST | `/messages` | auth | Envoyer un message |
| PATCH | `/messages/{id}` | auth | Modifier un message |
| DELETE | `/messages/{id}` | auth | Supprimer un message |

**POST /messages**
```json
// Body
{
  "receiver_id": 2,
  "contenu": "Bonjour, voici la pièce demandée.",
  "demande_id": 15
}
// Réponse 201 — message créé + notification envoyée au destinataire
```

**GET /messages/conversations**
```json
// Réponse 200
[
  {
    "user_id": 2,
    "user": { "id": 2, "prenom": "Mamadou", "nom": "DIALL", "role": "agent" },
    "last_message": "Votre dossier a été validé.",
    "last_time": "2026-06-04T10:30:00.000Z",
    "unread": 1
  }
]
```

---

### 6.5 Modèles de documents (Admin)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| GET | `/document-templates` | admin | Liste types + templates |
| POST | `/document-templates` | admin | Upload image + créer template |
| PUT | `/document-templates/{id}/champs` | admin | Sauvegarder les champs |
| PATCH | `/document-templates/{id}/toggle` | admin | Activer / Désactiver |
| DELETE | `/document-templates/{id}` | admin | Supprimer |

**POST /document-templates** (multipart/form-data)
```
type_demande_id = 1
nom             = "Acte de naissance officiel Conakry"
image           = <fichier PNG/JPG>
```

**PUT /document-templates/{id}/champs**
```json
{
  "champs": [
    { "key": "nom", "label": "Nom", "x": 25.5, "y": 33.2, "font_size": 12, "bold": false, "color": "#000000" },
    { "key": "prenoms", "label": "Prénom(s)", "x": 25.5, "y": 38.0, "font_size": 12, "bold": false, "color": "#000000" },
    { "key": "date_naissance", "label": "Date de naissance", "x": 55.0, "y": 33.2, "font_size": 12, "bold": false, "color": "#000000" }
  ]
}
```

---

### 6.6 Notifications

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| GET | `/notifications` | auth | 20 dernières notifications |
| PATCH | `/notifications/{id}/lu` | auth | Marquer comme lue |
| POST | `/notifications/mark-all-read` | auth | Marquer toutes comme lues |

---

### 6.7 Documents

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| GET | `/documents/{id}/download` | auth | Télécharger une pièce jointe |
| DELETE | `/documents/{id}` | auth | Supprimer un document |

---

## 7. Authentification et sécurité

### 7.1 Configuration Sanctum

```php
// bootstrap/app.php
$middleware->statefulApi(); // Active l'auth par session pour les routes API
```

```php
// config/sanctum.php — domaines traités comme SPA
'stateful' => ['localhost', 'localhost:8000', '127.0.0.1', ...]
```

### 7.2 Configuration Axios (bootstrap.js)

```js
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;   // Envoie les cookies de session
window.axios.defaults.withXSRFToken = true;     // Header X-XSRF-TOKEN auto
```

### 7.3 Middleware CheckRole

```php
// app/Http/Middleware/CheckRole.php
public function handle(Request $request, Closure $next, ...$roles): Response
{
    $allowedRoles = [];
    foreach ($roles as $role) {
        foreach (explode(',', $role) as $r) {
            $allowedRoles[] = trim($r);
        }
    }

    if (!$request->user()) {
        return $request->expectsJson()
            ? response()->json(['message' => 'Non authentifié.'], 401)
            : redirect()->route('login');
    }

    if (!in_array($request->user()->role->value, $allowedRoles)) {
        return $request->expectsJson()
            ? response()->json(['message' => 'Accès non autorisé.'], 403)
            : redirect('/citoyen/tableau-de-bord');
    }

    return $next($request);
}
```

---

## 8. Services métier

### 8.1 DocumentGeneratorService

**Fichier** : `app/Services/DocumentGeneratorService.php`

**Méthode principale** : `generer(Demande $demande): string`

**Algorithme** :
1. Charge le `DocumentTemplate` actif pour le type de la demande
2. Lit l'image depuis `storage/public/templates/{chemin_image}`
3. Encode en base64 pour l'intégration inline dans le HTML (contournement des limitations dompdf sur les chemins locaux)
4. Appelle `extraireDonnees()` pour construire le tableau de variables
5. Génère le HTML : image A4 en fond absolu + `<div>` positionnés en `left:{x}%; top:{y}%`
6. Retourne `Pdf::loadHTML($html)->setPaper('a4','portrait')->output()`

**Variables extraites** : `numero_dossier`, `date_depot`, `date_validation`, `citoyen_*`, `agent_*`, et tous les champs spécifiques selon le type (naissance, résidence, mariage, légalisation).

### 8.2 StoreDemandeRequest

**Fichier** : `app/Http/Requests/Demande/StoreDemandeRequest.php`

Validation dynamique : les règles changent selon `type_demande_id` transmis.
Messages d'erreur entièrement traduits en français via `messages()`.

---

## 9. Frontend — Composants clés

### 9.1 Layouts

| Layout | Fichier | Description |
|--------|---------|-------------|
| `CitizenLayout` | `Layouts/CitizenLayout.jsx` | Sidebar indigo, NAV citoyen, polling notifs + messages |
| `AgentLayout` | `Layouts/AgentLayout.jsx` | Sidebar slate, NAV agent, polling notifs + messages |
| `AdminLayout` | `Layouts/AdminLayout.jsx` | Sidebar admin, NAV admin |

Chaque layout intègre :
- Gestion des notifications (polling 30s, badge, dropdown)
- Badge messages non lus (polling 30s)
- Déconnexion

### 9.2 Pages principales

| Page | Chemin | Description |
|------|--------|-------------|
| Create | `Citoyen/Demandes/Create.jsx` | Formulaire dynamique multi-type, axios + FormData |
| Index citoyen | `Citoyen/Demandes/Index.jsx` | Liste dossiers citoyen |
| Show citoyen | `Citoyen/Demandes/Show.jsx` | Détail dossier + messagerie + téléchargement PDF |
| Messages citoyen | `Citoyen/Messages.jsx` | Interface chat |
| Index agent | `Agent/Demandes/Index.jsx` | File de traitement + assign en ligne |
| Show agent | `Agent/Demandes/Show.jsx` | Traitement complet dossier |
| DocumentTemplates | `Admin/DocumentTemplates.jsx` | Éditeur visuel de templates |

### 9.3 Pattern de soumission de formulaire

Les formulaires avec fichiers utilisent **Axios + FormData** (pas Inertia `useForm`) pour contourner les limitations CSRF des routes web :

```js
const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type_demande_id', data.type_demande_id);
    Object.entries(data.fields).forEach(([key, value]) => {
        formData.append(`fields[${key}]`, value);
    });
    data.documents.forEach((file, i) => formData.append(`documents[${i}]`, file));

    try {
        await axios.post('/api/v1/demandes', formData);
        router.visit('/citoyen/mes-dossiers');
    } catch (error) {
        const errors = error.response?.data?.errors || {};
        setErrors(errors);
    }
};
```

### 9.4 Génération PDF côté client

```js
const handleGenerateDocument = async () => {
    const res = await axios.get(`/api/v1/demandes/${uuid}/generer-document`, {
        responseType: 'blob',
    });
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `Document_${demande.numero_dossier}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
};
```

---

## 10. Données de test

### 10.1 Comptes disponibles après `db:seed`

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | `admin@mairie.gn` | `password` |
| Agent | `agent1@mairie.gn` | `password` |
| Agent | `agent2@mairie.gn` | `password` |
| Agent | `agent3@mairie.gn` | `password` |
| Citoyen | `citoyen1@gmail.com` | `password` |
| Citoyen | `citoyen2@gmail.com` | `password` |
| … | `citoyen3` à `citoyen10@gmail.com` | `password` |

### 10.2 Réinitialiser la base de données

```bash
# Réinitialiser et re-seeder
php artisan migrate:fresh --seed

# Re-créer le lien storage si perdu
php artisan storage:link
```

### 10.3 Commandes utiles

```bash
# Lister toutes les routes
php artisan route:list

# Vider les caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Accéder au REPL PHP avec le contexte Laravel
php artisan tinker

# Vérifier l'état des migrations
php artisan migrate:status
```

---

*Smart e-Mairie — Documentation Technique v1.0 — Juin 2026*  
*PHP 8.4.8 · Laravel 13.8.0 · React 19 · MySQL 8.x*
