# Spécifications Fonctionnelles et Techniques
## Smart e-Mairie — Portail Numérique de la Mairie

---

**Version** : 1.0  
**Date** : Juin 2026  
**Auteur** : Équipe de développement  
**Statut** : Final  

---

## Table des matières

1. [Contexte et présentation du projet](#1-contexte-et-présentation)
2. [Objectifs](#2-objectifs)
3. [Périmètre du projet](#3-périmètre)
4. [Acteurs du système](#4-acteurs)
5. [Spécifications fonctionnelles](#5-spécifications-fonctionnelles)
6. [Spécifications techniques](#6-spécifications-techniques)
7. [Architecture du système](#7-architecture)
8. [Sécurité](#8-sécurité)
9. [Exigences non fonctionnelles](#9-exigences-non-fonctionnelles)
10. [Glossaire](#10-glossaire)

---

## 1. Contexte et Présentation

### 1.1 Contexte général

Les services administratifs des mairies traitent quotidiennement un volume important de demandes citoyennes (actes d'état civil, certificats de résidence, légalisations, etc.). Ces démarches nécessitent traditionnellement un déplacement physique, génèrent des files d'attente et ralentissent le traitement des dossiers.

**Smart e-Mairie** est une plateforme web de dématérialisation des services municipaux permettant aux citoyens d'effectuer leurs demandes administratives en ligne, de suivre leur traitement en temps réel et de télécharger leurs documents officiels.

### 1.2 Problématique

- Files d'attente longues aux guichets
- Perte de documents papier
- Absence de traçabilité des dossiers
- Communication difficile entre citoyens et agents
- Manque de statistiques pour le pilotage administratif

### 1.3 Solution apportée

Plateforme web trois niveaux (Citoyen / Agent / Administrateur) permettant :
- La soumission en ligne de demandes administratives
- Le traitement dématérialisé par les agents
- La génération automatique de documents PDF officiels
- La communication directe citoyen ↔ agent
- Le pilotage statistique par l'administration

---

## 2. Objectifs

### 2.1 Objectifs principaux

| # | Objectif | Indicateur de succès |
|---|----------|----------------------|
| O1 | Dématérialiser les demandes administratives | 100 % des types de demandes disponibles en ligne |
| O2 | Réduire les délais de traitement | Traçabilité complète avec horodatage |
| O3 | Améliorer la communication citoyen-mairie | Messagerie intégrée fonctionnelle |
| O4 | Automatiser la génération de documents | PDF généré à la validation du dossier |
| O5 | Donner de la visibilité à l'administration | Tableau de bord statistique en temps réel |

### 2.2 Objectifs secondaires

- Archivage numérique des dossiers et pièces jointes
- Gestion des priorités (normale, haute, urgente)
- Notification automatique des citoyens à chaque étape
- Système de modèles de documents configurables par l'admin

---

## 3. Périmètre

### 3.1 Inclus dans le projet

- Gestion des comptes utilisateurs (inscription, connexion, profil)
- 4 types de demandes : Acte de Naissance, Certificat de Résidence, Certificat de Mariage, Légalisation de Document
- Workflow complet : dépôt → assignation → traitement → validation/rejet
- Messagerie interne citoyen ↔ agent
- Notifications en temps réel
- Génération de PDF depuis modèles image
- Tableau de bord statistique admin
- Gestion des utilisateurs (agents, citoyens)
- Export des données (Excel, PDF)

### 3.2 Hors périmètre

- Paiement en ligne des frais administratifs
- Signature électronique qualifiée
- Intégration avec le système d'état civil national
- Application mobile native
- Certificat de Décès (prévu, non implémenté dans cette version)

---

## 4. Acteurs

### 4.1 Citoyen

**Profil** : Tout habitant inscrit sur la plateforme.

**Accès** : Espace `/citoyen/*`

| Capacité | Description |
|----------|-------------|
| S'inscrire | Création de compte avec email, nom, prénom, téléphone |
| Se connecter | Authentification par email + mot de passe |
| Soumettre une demande | Formulaire adapté au type, upload de pièces jointes |
| Suivre ses dossiers | Liste de ses demandes avec statuts en temps réel |
| Consulter un dossier | Détail complet, historique, pièce manquante, motif rejet |
| Contacter l'agent | Messagerie intégrée depuis la page du dossier |
| Télécharger le document | PDF officiel si dossier validé et template actif |
| Gérer son profil | Modifier ses informations, changer son mot de passe |

### 4.2 Agent

**Profil** : Employé municipal habilité à traiter les dossiers.

**Accès** : Espace `/agent/*`

| Capacité | Description |
|----------|-------------|
| Voir tous les dossiers | Liste globale de toutes les demandes (tous agents) |
| Prendre en charge | Assigner un dossier à soi-même |
| Consulter un dossier | Données complètes du formulaire + pièces jointes |
| Valider un dossier | Changer le statut à "validée", clôturer le dossier |
| Rejeter un dossier | Saisir un motif de rejet obligatoire |
| Demander un document manquant | Notifier le citoyen d'une pièce complémentaire requise |
| Ajouter une note interne | Commentaires visibles uniquement par les agents |
| Répondre aux messages | Messagerie intégrée avec les citoyens |
| Télécharger le document | PDF officiel généré depuis le template actif |

### 4.3 Administrateur

**Profil** : Responsable de la gestion de la plateforme.

**Accès** : Espace `/admin/*` (a également accès à l'espace agent)

| Capacité | Description |
|----------|-------------|
| Tableau de bord | Statistiques globales en temps réel |
| Gérer les utilisateurs | Créer des agents, activer/désactiver des comptes |
| Consulter tous les dossiers | Vue complète avec filtres et export |
| Gérer les modèles documents | Upload image, placement des champs, activation par type |
| Paramètres système | Configuration nom/email mairie, maintenance, 2FA |
| Exporter les données | Export Excel et PDF des dossiers et statistiques |

---

## 5. Spécifications Fonctionnelles

### 5.1 Module Authentification

#### SF-AUTH-01 : Inscription citoyen
- **Déclencheur** : Le citoyen clique sur "S'inscrire"
- **Données** : Prénom, Nom, Email (unique), Téléphone, Mot de passe (min 8 car.)
- **Résultat** : Compte créé, rôle `citoyen` attribué, redirection vers le tableau de bord

#### SF-AUTH-02 : Connexion
- **Déclencheur** : L'utilisateur soumet le formulaire de connexion
- **Authentification** : Email + mot de passe, session Sanctum
- **Redirection** : Selon le rôle — `/citoyen/tableau-de-bord`, `/agent/tableau-de-bord`, `/admin/tableau-de-bord`

#### SF-AUTH-03 : Réinitialisation mot de passe
- Envoi d'un lien par email via le système de reset Laravel
- Token valide 60 minutes

---

### 5.2 Module Demandes (Citoyen)

#### SF-DEM-01 : Création d'une demande
- **Types disponibles** :
  - Acte de Naissance (`ACTE_NAISSANCE`)
  - Certificat de Résidence (`CERTIFICAT_RESIDENCE`)
  - Certificat de Mariage (`CERTIFICAT_MARIAGE`)
  - Légalisation de Document (`LEGALISATION_DOCUMENT`)
- **Données communes** : type, priorité (normale/haute/urgente), description
- **Données spécifiques** : formulaire dynamique selon le type sélectionné
- **Pièces jointes** : PDF, JPG, PNG, max 10 Mo par fichier
- **Résultat** : Numéro de dossier généré (`MAI-AAAA-XXXXX`), statut initial `en_attente`

#### SF-DEM-02 : Suivi des dossiers
- Liste paginée filtrée par statut
- Indicateurs visuels de statut (couleurs, badges)
- Accès au détail de chaque dossier

#### SF-DEM-03 : Consultation d'un dossier
- Affichage des données du formulaire
- Historique horodaté des changements de statut avec commentaires
- Bandeau d'alerte si pièce manquante (avec le libellé exact)
- Bouton "Télécharger Document Officiel" si validé et template actif

---

### 5.3 Module Traitement (Agent)

#### SF-AGT-01 : File de traitement
- Affichage de tous les dossiers (tous agents confondus)
- Filtrage par statut, recherche par numéro/citoyen/type
- Badge "Non assigné" si aucun agent n'a pris en charge
- Bouton "Prendre en charge" par dossier

#### SF-AGT-02 : Prise en charge
- Assigne l'agent authentifié sur le dossier
- Passe le statut de `en_attente` à `en_cours`
- Crée une entrée dans l'historique

#### SF-AGT-03 : Mise à jour du statut

| Statut | Conditions | Effets |
|--------|-----------|--------|
| `en_cours` | Dossier assigné | Réinitialise pièce_manquante |
| `document_manquant` | Dossier assigné | Sauvegarde la pièce requise, notifie le citoyen |
| `validee` | Dossier assigné | Clôture le dossier, date de clôture |
| `rejetee` | Dossier assigné | Motif obligatoire, clôture le dossier |

#### SF-AGT-04 : Notes internes
- Texte libre horodaté, visible uniquement par les agents
- Accumulatif (les notes s'ajoutent sans effacer les précédentes)

---

### 5.4 Module Messagerie

#### SF-MSG-01 : Envoi de message
- Citoyen envoie depuis la page de son dossier ou depuis `/citoyen/messages`
- Agent répond depuis `/agent/messages`
- Message lié à une demande (optionnel)
- Notification automatique au destinataire

#### SF-MSG-02 : Interface de messagerie
- Liste des conversations avec dernier message et nombre de non-lus
- Fenêtre de chat en temps réel (polling 5s)
- Modification et suppression des messages envoyés
- Badge de messages non lus dans la sidebar (polling 30s)

---

### 5.5 Module Modèles de Documents

#### SF-DOC-01 : Gestion des templates (Admin)
- Un template par type de demande (unicité)
- Upload d'une image PNG/JPG du formulaire officiel vierge
- Placement visuel des champs par clic sur l'image (coordonnées en %)
- Configuration par champ : variable, taille de police, gras, couleur
- Activation/désactivation par toggle

#### SF-DOC-02 : Génération de PDF
- Déclenchée par le citoyen ou l'agent depuis la page Show du dossier
- Condition : dossier en statut `validée` + template actif pour ce type
- L'image sert de fond, le texte est superposé aux coordonnées définies
- Téléchargement direct du PDF nommé `Document_{numero_dossier}.pdf`

---

### 5.6 Module Administration

#### SF-ADM-01 : Gestion des utilisateurs
- Création de compte agent par l'admin
- Activation/désactivation d'un compte (blocage de connexion)
- Visualisation des rôles et statuts

#### SF-ADM-02 : Statistiques
- Nombre total de dossiers, par statut, par type
- Taux de traitement, délai moyen
- Évolution mensuelle
- Export Excel et PDF

#### SF-ADM-03 : Paramètres système
- Nom et email de la mairie
- Mode maintenance
- Authentification à deux facteurs
- Sauvegarde cloud

---

## 6. Spécifications Techniques

### 6.1 Stack technologique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Backend | Laravel | 13.x |
| Langage serveur | PHP | 8.3 |
| Frontend | React | 19.x |
| Bridge SPA | Inertia.js | 3.x |
| CSS | Tailwind CSS | 4.x |
| Base de données | MySQL | 8.x |
| Authentification | Laravel Sanctum | Session SPA |
| PDF | barryvdh/laravel-dompdf | 3.1 |
| Notifications | Sonner (toasts) | — |
| Icônes | Lucide React | — |
| HTTP client | Axios | — |
| Build | Vite | — |

### 6.2 Versions et compatibilité

- **PHP** : 8.3 minimum (propriétés readonly, enums, fibers)
- **Node.js** : 20.x minimum (build Vite)
- **MySQL** : 8.0 minimum (JSON columns, window functions)
- **Navigateurs** : Chrome 100+, Firefox 100+, Edge 100+, Safari 15+

---

## 7. Architecture

### 7.1 Architecture générale

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Navigateur)                  │
│         React 19 + Inertia.js + Tailwind CSS            │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / JSON (Inertia + Axios)
┌──────────────────────▼──────────────────────────────────┐
│                  SERVEUR (Laravel 13)                    │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ Web Routes  │  │  API Routes  │  │  Middleware    │ │
│  │ (Inertia)   │  │  /api/v1/*   │  │  Auth/Rôles    │ │
│  └──────┬──────┘  └──────┬───────┘  └────────────────┘ │
│         │                │                               │
│  ┌──────▼────────────────▼───────────────────────────┐  │
│  │               Controllers                          │  │
│  │  Auth │ Agent │ Admin │ Demande │ Message │ ...    │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                                │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │               Models / Services                    │  │
│  │  Demande │ User │ DocumentTemplate │ Message │ ... │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                                │
└─────────────────────────┼────────────────────────────── ┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                  BASE DE DONNÉES (MySQL)                 │
│         + Storage (images templates, documents)          │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Schéma de la base de données

| Table | Description |
|-------|-------------|
| `users` | Citoyens, agents, administrateurs |
| `types_demandes` | Catalogue des types de demandes |
| `demandes` | Dossiers soumis par les citoyens |
| `demande_naissances` | Données spécifiques acte de naissance |
| `demande_residences` | Données spécifiques certificat de résidence |
| `demande_mariages` | Données spécifiques certificat de mariage |
| `demande_legalisations` | Données spécifiques légalisation |
| `historique_statuts` | Traçabilité de chaque changement de statut |
| `documents` | Pièces jointes uploadées |
| `messages` | Messagerie interne |
| `notifications` | Notifications utilisateurs |
| `document_templates` | Modèles image pour génération PDF |
| `settings` | Paramètres système |
| `audit_logs` | Journal d'audit |

### 7.3 Pattern architectural

- **MVC** : Contrôleurs, Modèles Eloquent, Vues React via Inertia
- **Repository-like** : Services dédiés pour la logique métier complexe (`DocumentGeneratorService`)
- **Form Requests** : Validation centralisée dans des classes dédiées (`StoreDemandeRequest`)
- **Enums** : `RoleEnum`, `StatutDemandeEnum`, `PrioriteEnum` pour les valeurs typées
- **Shared data** : `HandleInertiaRequests` partage `auth` et `notifications` sur toutes les pages

---

## 8. Sécurité

### 8.1 Authentification

- Sessions sécurisées via **Laravel Sanctum** (mode SPA stateful)
- Cookies `HttpOnly` + `SameSite=Lax`
- Protection CSRF sur toutes les mutations (token XSRF via Axios)
- Mots de passe hachés avec **bcrypt** (coût : 12)

### 8.2 Contrôle d'accès

- Middleware `CheckRole` sur toutes les routes protégées
- Trois rôles : `citoyen`, `agent`, `administrateur`
- Vérification que le citoyen ne peut accéder qu'à ses propres dossiers
- Les endpoints API agent/admin sont inaccessibles aux citoyens

### 8.3 Validation des données

- Validation côté serveur via `FormRequest` pour chaque endpoint
- Validation côté client pour l'UX (erreurs affichées immédiatement)
- Upload de fichiers : types autorisés (pdf, jpg, jpeg, png), taille max 10 Mo

### 8.4 Protection contre les injections

- Requêtes via Eloquent ORM (protection SQL injection)
- Sortie HTML via React (protection XSS)
- Pas d'exécution de commandes système côté application

---

## 9. Exigences Non Fonctionnelles

### 9.1 Performance

| Exigence | Valeur cible |
|----------|-------------|
| Temps de réponse page | < 2 secondes |
| Temps de génération PDF | < 5 secondes |
| Polling messagerie | Toutes les 5 secondes |
| Polling notifications | Toutes les 30 secondes |

### 9.2 Disponibilité

- Application disponible 24h/24, 7j/7
- Fenêtre de maintenance planifiée (configurable depuis l'admin)

### 9.3 Maintenabilité

- Code commenté pour les sections non triviales
- Variables d'environnement dans `.env` (pas de valeurs en dur)
- Migrations versionnées pour l'évolution du schéma
- Seeders pour les données de référence et de test

### 9.4 Scalabilité

- Architecture sans état côté session (Sanctum stateful SPA)
- Stockage des fichiers sur disque public (prévu pour S3 en production)
- Pagination sur toutes les listes (20 éléments par page)

---

## 10. Glossaire

| Terme | Définition |
|-------|-----------|
| **Dossier / Demande** | Requête administrative soumise par un citoyen |
| **Numéro de dossier** | Identifiant unique format `MAI-AAAA-XXXXX` |
| **Statut** | État courant d'un dossier (en_attente, en_cours, document_manquant, validée, rejetée) |
| **Priorité** | Niveau d'urgence : normale, haute, urgente |
| **Template** | Modèle image d'un formulaire officiel utilisé pour générer le PDF |
| **Pièce manquante** | Document complémentaire demandé par l'agent au citoyen |
| **Historique** | Journal horodaté de tous les changements de statut d'un dossier |
| **Note interne** | Commentaire agent visible uniquement par les agents |
| **SPA** | Single Page Application — l'application React chargée une seule fois |
| **Inertia.js** | Adaptateur permettant d'utiliser React comme moteur de vues Laravel |
| **Sanctum** | Package Laravel d'authentification légère pour les SPA |

---

*Document généré dans le cadre du projet Smart e-Mairie — Tous droits réservés*
