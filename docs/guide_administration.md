# Guide d'Administration
## Smart e-Mairie — Portail Numérique de la Mairie

---

**Version** : 1.0  
**Date** : Juin 2026  
**Public cible** : Administrateur système de la mairie  

---

## Table des matières

1. [Accès à l'espace administrateur](#1-accès-à-lespace-administrateur)
2. [Tableau de bord](#2-tableau-de-bord)
3. [Gestion des utilisateurs](#3-gestion-des-utilisateurs)
4. [Gestion des dossiers](#4-gestion-des-dossiers)
5. [Modèles de documents](#5-modèles-de-documents)
6. [Statistiques et rapports](#6-statistiques-et-rapports)
7. [État du système](#7-état-du-système)
8. [Paramètres système](#8-paramètres-système)
9. [Gestion des notifications](#9-gestion-des-notifications)

---

## 1. Accès à l'espace administrateur

### Identifiants

| Champ | Valeur |
|-------|--------|
| Email | `admin@mairie.gn` |
| Mot de passe | `password` |
| URL | `/connexion` |

Après connexion, vous êtes redirigé vers `/admin/tableau-de-bord`.

> **Sécurité** : Changez le mot de passe par défaut immédiatement en production via **Paramètres → Sécurité**.

---

## 2. Tableau de bord

### Indicateurs affichés

| Indicateur | Description |
|-----------|-------------|
| **Total dossiers** | Nombre total de demandes dans le système |
| **En attente** | Dossiers non encore assignés à un agent |
| **En cours** | Dossiers en traitement actif |
| **Traités** | Dossiers validés ou rejetés |

### Section dossiers récents

Affiche les 10 dernières demandes soumises avec :
- Nom du citoyen
- Type de demande
- Statut actuel
- Date de dépôt
- Lien vers le détail

---

## 3. Gestion des utilisateurs

### Accès
Navigation → **"Gestion Personnel"** → `/admin/utilisateurs`

### 3.1 Voir la liste des utilisateurs

Le tableau affiche tous les utilisateurs (citoyens + agents) avec :
- Nom, prénom, email
- Rôle (citoyen / agent / administrateur)
- Statut du compte (actif / inactif)
- Date d'inscription

### 3.2 Créer un compte agent

Seul l'administrateur peut créer des comptes agents.

1. Cliquez sur **"Nouvel agent"** (bouton en haut à droite)
2. Remplissez le formulaire :
   - Prénom et Nom
   - Adresse e-mail professionnelle
   - Mot de passe temporaire (à communiquer à l'agent)
3. Cliquez sur **"Créer le compte"**
4. Le compte est créé avec le rôle `agent` et le statut actif

> **Recommandation** : Demandez à l'agent de changer son mot de passe à la première connexion via *Paramètres → Sécurité*.

### 3.3 Activer / Désactiver un compte

1. Dans la liste, repérez l'utilisateur concerné
2. Cliquez sur le bouton **toggle** (vert = actif, rouge = inactif) dans la colonne "Statut"
3. Confirmez l'action

**Effets d'une désactivation** :
- L'utilisateur ne peut plus se connecter
- Ses données et dossiers sont conservés
- La désactivation est réversible

**Cas d'usage** :
- Agent qui quitte la mairie → désactiver son compte
- Citoyen avec comportement abusif → désactiver temporairement

---

## 4. Gestion des dossiers

### Accès
Navigation → **"Gestion Dossiers"** → `/admin/dossiers`

### 4.1 Vue complète

L'administrateur voit **tous les dossiers** de tous les citoyens avec :
- Numéro de dossier
- Citoyen demandeur
- Type de demande
- Agent assigné
- Statut
- Priorité
- Date de dépôt

### 4.2 Filtres disponibles

- Par statut (en_attente, en_cours, document_manquant, validée, rejetée)
- Par type de demande
- Par agent assigné
- Par période (date de début / fin)

### 4.3 Export des données

Cliquez sur les boutons d'export en haut à droite :

| Bouton | Format | Contenu |
|--------|--------|---------|
| **Export Excel** | `.xlsx` | Tous les dossiers filtrés avec tous les champs |
| **Export PDF** | `.pdf` | Rapport formaté des dossiers |

---

## 5. Modèles de documents

### Accès
Navigation → **"Modèles documents"** → `/admin/modeles-documents`

Cette fonctionnalité permet de configurer la génération automatique de PDF pour chaque type de demande.

### 5.1 Comprendre le principe

1. Vous uploadez une **image** (scan du formulaire officiel vierge de la mairie)
2. Vous **placez visuellement** les zones où le texte du citoyen doit apparaître
3. Vous **activez** le template
4. Dès qu'un dossier de ce type est validé → le PDF est généré automatiquement

### 5.2 Préparer l'image template

**Recommandations pour l'image :**
- Format : **PNG** (meilleure qualité) ou JPG
- Résolution : minimum **1240 × 1754 px** (A4 à 150 dpi)
- L'image doit être le formulaire officiel **vierge** (sans données)
- Fond blanc de préférence pour une meilleure lisibilité du texte généré

### 5.3 Créer un template

#### Étape 1 — Sélectionner le type de demande
Dans la colonne gauche, cliquez sur le type souhaité (ex : **"Extrait d'Acte de Naissance"**).

#### Étape 2 — Uploader l'image
1. Saisissez un nom descriptif dans le champ **"Nom du template"**
   - Exemple : `Acte de naissance officiel - Mairie Conakry`
2. Cliquez sur **"Choisir image"** → sélectionnez votre fichier PNG/JPG
3. Cliquez sur **"Upload"**

L'image apparaît dans l'éditeur visuel.

#### Étape 3 — Placer les champs

1. **Cliquez sur l'image** à l'endroit exact où vous voulez que le texte apparaisse
   - Un point rouge se positionne à l'endroit cliqué
   - Un panneau s'ouvre en dessous de l'image

2. **Configurez le champ** :

   | Option | Description |
   |--------|-------------|
   | **Variable** | Choisissez la donnée à afficher (ex : "Nom (titulaire)", "Date de naissance") |
   | **Taille de police** | Entre 6 et 72 (recommandé : 11-13 pour les formulaires standard) |
   | **Couleur** | Noir (`#000000`) par défaut, modifiable |
   | **Gras** | Cochez si le champ doit être en gras |

3. Cliquez sur **"Ajouter le champ"**
   - Un label bleu apparaît sur l'image à la position cliquée
   - Le champ s'ajoute à la liste en dessous

4. Répétez pour chaque zone du formulaire.

#### Variables disponibles

| Variable | Valeur insérée |
|----------|---------------|
| `numero_dossier` | MAI-2026-00042 |
| `date_validation` | 04/06/2026 |
| `date_depot` | 15/05/2026 |
| `citoyen_nom` | DIALLO |
| `citoyen_prenom` | Ibrahima |
| `agent_nom` | CAMARA |
| `nom` | Nom du titulaire de l'acte |
| `prenoms` | Prénoms du titulaire |
| `date_naissance` | 12/03/1990 |
| `lieu_naissance` | Conakry |
| `genre` | Masculin / Féminin |
| `nom_pere` | Nom du père |
| `nom_mere` | Nom de la mère |
| `adresse_complete` | Adresse de résidence |
| `quartier_commune` | Quartier / Commune |
| `duree_residence` | Durée de résidence |
| `nom_epoux` / `nom_epouse` | Noms des époux (mariage) |
| `date_mariage` | Date du mariage |
| `lieu_mariage` | Lieu du mariage |
| `type_document` | Type de document à légaliser |
| `pays_destination` | Pays de destination (légalisation) |
| `motif` | Motif de la demande |
| `nombre_copies` | Nombre de copies demandées |

#### Étape 4 — Sauvegarder les champs
Cliquez sur **"Sauvegarder les champs"** (bouton bleu). Les positions sont enregistrées.

#### Étape 5 — Activer le template
Cliquez sur le toggle **"Inactif — cliquez pour activer"**.

Il passe à **"Actif ✅"**.

> Dès l'activation, le bouton "Télécharger Document Officiel" apparaît automatiquement pour tous les dossiers validés de ce type.

### 5.4 Modifier un template existant

1. Sélectionnez le type dans la liste gauche
2. Pour changer l'image : re-uploadez une nouvelle image (l'ancienne est supprimée)
3. Pour modifier les champs : cliquez sur **×** à côté du champ à supprimer, puis re-cliquez sur l'image pour replacer
4. N'oubliez pas de cliquer **"Sauvegarder les champs"**

### 5.5 Désactiver un template

Cliquez sur le toggle **"Actif — cliquez pour désactiver"**.

Le template est désactivé. L'ancien système de téléchargement reprend automatiquement pour ce type.

### 5.6 Supprimer un template

Cliquez sur l'icône **poubelle** (🗑) à droite des actions.

> Cette action supprime définitivement l'image et la configuration. Elle est irréversible.

---

## 6. Statistiques et rapports

### Accès
Navigation → **"Statistiques"** → `/admin/statistiques`

### Indicateurs disponibles

| Indicateur | Description |
|-----------|-------------|
| **Volume par statut** | Répartition des dossiers par état |
| **Volume par type** | Répartition par type de demande |
| **Évolution mensuelle** | Courbe du nombre de demandes par mois |
| **Performance des agents** | Nombre de dossiers traités par agent |
| **Délai moyen de traitement** | Temps moyen entre dépôt et clôture |

### Export des statistiques

| Bouton | Format |
|--------|--------|
| **Export Excel** | Données brutes en `.xlsx` |
| **Export PDF** | Rapport formaté avec graphiques |

---

## 7. État du système

### Accès
Navigation → **"État Système"** → `/admin/systeme`

Cette page affiche l'état technique de la plateforme :

| Indicateur | Description |
|-----------|-------------|
| **Espace disque** | Utilisation du stockage (fichiers uploadés) |
| **Base de données** | Taille et état de la BDD |
| **File de messages** | État du système de notifications |
| **Version** | Version de l'application |
| **PHP / Laravel** | Versions des composants |

---

## 8. Paramètres système

### Accès
Navigation → **"Paramètres"** → `/admin/parametres`

### 8.1 Informations de la mairie

| Champ | Description |
|-------|-------------|
| **Nom de la mairie** | Affiché sur les documents et e-mails |
| **Email de contact** | Adresse de réponse pour les notifications |

### 8.2 Sécurité

| Option | Description |
|--------|-------------|
| **Authentification à deux facteurs (2FA)** | Active la vérification en deux étapes pour tous les comptes admin |

### 8.3 Mode maintenance

Activez le **mode maintenance** avant toute intervention technique :
- Les citoyens et agents voient une page "Portail temporairement indisponible"
- L'administrateur peut toujours se connecter
- **Désactivez** le mode dès la fin de l'intervention

### 8.4 Sauvegarde cloud

Active la sauvegarde automatique des données vers un stockage distant.

---

## 9. Gestion des notifications

### Accès
Navigation → **"Notifications"** → `/admin/notifications`

L'administrateur peut consulter l'historique de toutes les notifications envoyées :
- À qui elles ont été envoyées
- Le message
- La date
- Si elles ont été lues

---

## Procédures courantes

### Créer le compte d'un nouvel agent

1. Aller dans **Gestion Personnel**
2. Cliquer sur **"Nouvel agent"**
3. Remplir prénom, nom, email, mot de passe temporaire
4. Cliquer sur **"Créer le compte"**
5. Communiquer les identifiants à l'agent de façon sécurisée

### Configurer un modèle pour un nouveau type de demande

1. Préparer l'image du formulaire officiel (PNG, A4, haute résolution)
2. Aller dans **Modèles documents**
3. Sélectionner le type → uploader l'image → placer les champs → sauvegarder → activer

### Exporter le rapport mensuel des dossiers

1. Aller dans **Gestion Dossiers**
2. Filtrer par période (mois souhaité)
3. Cliquer sur **"Export Excel"** ou **"Export PDF"**

### Désactiver temporairement un agent parti en congé

1. Aller dans **Gestion Personnel**
2. Trouver l'agent → cliquer sur le toggle de statut → confirmer
3. Réactiver à son retour de la même façon

---

## Contacts et support

En cas de problème technique non résolu :

| Type | Contact |
|------|---------|
| Bug critique (plateforme inaccessible) | Contacter l'équipe technique |
| Demande d'évolution | Soumettre via le système de tickets |
| Formation | Manuel d'utilisation disponible dans `/docs/` |

---

*Smart e-Mairie — Guide d'Administration v1.0 — Juin 2026*
