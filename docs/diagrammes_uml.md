# Diagrammes UML
## Smart e-Mairie — Portail Numérique de la Mairie

---

**Version** : 1.0  
**Date** : Juin 2026  
**Outil** : Mermaid (rendu dans GitHub, Notion, VS Code + extension)

---

## 1. Diagramme de Cas d'Utilisation

```mermaid
graph TD
    Citoyen(["👤 Citoyen"])
    Agent(["👷 Agent"])
    Admin(["🛡️ Administrateur"])

    subgraph "Authentification"
        UC1[S'inscrire]
        UC2[Se connecter]
        UC3[Réinitialiser mot de passe]
        UC4[Gérer son profil]
    end

    subgraph "Espace Citoyen"
        UC5[Soumettre une demande]
        UC6[Suivre ses dossiers]
        UC7[Consulter un dossier]
        UC8[Télécharger document officiel]
        UC9[Envoyer un message à l'agent]
    end

    subgraph "Espace Agent"
        UC10[Voir tous les dossiers]
        UC11[Prendre en charge un dossier]
        UC12[Valider un dossier]
        UC13[Rejeter un dossier]
        UC14[Demander pièce manquante]
        UC15[Ajouter note interne]
        UC16[Répondre aux messages]
        UC17[Générer document PDF]
    end

    subgraph "Espace Administrateur"
        UC18[Voir tableau de bord stats]
        UC19[Gérer les utilisateurs]
        UC20[Gérer modèles documents]
        UC21[Configurer paramètres système]
        UC22[Exporter données]
        UC23[Consulter tous les dossiers]
    end

    Citoyen --> UC1
    Citoyen --> UC2
    Citoyen --> UC3
    Citoyen --> UC4
    Citoyen --> UC5
    Citoyen --> UC6
    Citoyen --> UC7
    Citoyen --> UC8
    Citoyen --> UC9

    Agent --> UC2
    Agent --> UC4
    Agent --> UC10
    Agent --> UC11
    Agent --> UC12
    Agent --> UC13
    Agent --> UC14
    Agent --> UC15
    Agent --> UC16
    Agent --> UC17

    Admin --> UC2
    Admin --> UC18
    Admin --> UC19
    Admin --> UC20
    Admin --> UC21
    Admin --> UC22
    Admin --> UC23
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13
```

---

## 2. Diagramme de Classes

```mermaid
classDiagram
    direction TB

    class User {
        +int id
        +string prenom
        +string nom
        +string email
        +string telephone
        +string password
        +RoleEnum role
        +bool is_active
        +string avatar_path
        +timestamps()
    }

    class TypeDemande {
        +int id
        +string code
        +string libelle
        +string description
        +int delai_jours_ouvrables
        +bool is_active
    }

    class Demande {
        +int id
        +string uuid
        +string numero_dossier
        +int user_id
        +int agent_id
        +int type_demande_id
        +StatutEnum statut
        +PrioriteEnum priorite
        +string description
        +string motif_rejet
        +string piece_manquante
        +string notes_internes
        +date date_echeance
        +datetime date_cloture
        +timestamps()
    }

    class HistoriqueStatut {
        +int id
        +int demande_id
        +int user_id
        +string ancien_statut
        +string nouveau_statut
        +string commentaire
        +timestamps()
    }

    class Document {
        +int id
        +int demande_id
        +string nom_original
        +string nom_fichier
        +string chemin
        +string mime_type
        +int taille_octets
        +timestamps()
    }

    class Message {
        +int id
        +int sender_id
        +int receiver_id
        +int demande_id
        +text contenu
        +bool lu
        +datetime lu_at
        +datetime edited_at
        +timestamps()
    }

    class Notification {
        +int id
        +int user_id
        +int demande_id
        +string type
        +string message
        +bool lu
        +datetime lu_at
        +timestamps()
    }

    class DocumentTemplate {
        +int id
        +int type_demande_id
        +string nom
        +string chemin_image
        +json champs
        +bool actif
        +timestamps()
    }

    class DemandeNaissance {
        +int id
        +int demande_id
        +string nom
        +string prenoms
        +date date_naissance
        +string lieu_naissance
        +string genre
        +string nom_pere
        +string prenom_pere
        +string profession_pere
        +string nom_mere
        +string prenom_mere
        +string profession_mere
        +string motif
        +int nombre_copies
    }

    class DemandeResidence {
        +int id
        +int demande_id
        +string nom
        +string prenoms
        +string adresse_complete
        +string quartier_commune
        +string duree_residence
        +string motif
        +int nombre_copies
    }

    class DemandeMariage {
        +int id
        +int demande_id
        +string nom_epoux
        +string prenom_epoux
        +string nom_epouse
        +string prenom_epouse
        +date date_mariage
        +string lieu_mariage
        +string motif
        +int nombre_copies
    }

    class DemandeLegalisation {
        +int id
        +int demande_id
        +string nom
        +string prenoms
        +string type_document
        +string pays_destination
        +string usage_prevu
        +int nombre_copies
    }

    %% Relations
    User "1" --> "0..*" Demande : soumet (user_id)
    User "1" --> "0..*" Demande : traite (agent_id)
    TypeDemande "1" --> "0..*" Demande : categorise
    TypeDemande "1" --> "0..1" DocumentTemplate : possède

    Demande "1" --> "0..*" HistoriqueStatut : retrace
    Demande "1" --> "0..*" Document : contient
    Demande "1" --> "0..1" DemandeNaissance : détaille
    Demande "1" --> "0..1" DemandeResidence : détaille
    Demande "1" --> "0..1" DemandeMariage : détaille
    Demande "1" --> "0..1" DemandeLegalisation : détaille

    User "1" --> "0..*" Message : envoie
    User "1" --> "0..*" Message : reçoit
    User "1" --> "0..*" Notification : reçoit
```

---

## 3. Diagramme de Séquence — Soumission d'une Demande

```mermaid
sequenceDiagram
    actor C as Citoyen
    participant UI as React (Frontend)
    participant API as Laravel API
    participant DB as MySQL
    participant Store as Storage

    C->>UI: Ouvre /citoyen/nouvelle-demande
    UI->>API: GET /api/v1/demandes/types
    API->>DB: SELECT types_demandes WHERE is_active=true
    DB-->>API: Liste des types actifs
    API-->>UI: [ACTE_NAISSANCE, CERTIFICAT_RESIDENCE, ...]
    UI-->>C: Affiche le formulaire

    C->>UI: Remplit le formulaire + upload pièces jointes
    C->>UI: Clique "Lancer la demande"

    UI->>API: POST /api/v1/demandes (FormData)
    API->>API: Validation StoreDemandeRequest

    alt Validation échouée
        API-->>UI: 422 + erreurs JSON
        UI-->>C: Affiche les erreurs en rouge
    else Validation réussie
        API->>DB: INSERT INTO demandes (uuid, numero_dossier, statut=en_attente)
        API->>DB: INSERT INTO demande_naissances / résidences / ...
        API->>Store: Stocke les fichiers joints
        API->>DB: INSERT INTO documents
        DB-->>API: Demande créée (numero_dossier)
        API-->>UI: 201 {numero_dossier: "MAI-2026-00001"}
        UI-->>C: Redirige vers /citoyen/mes-dossiers
    end
```

---

## 4. Diagramme de Séquence — Traitement d'un Dossier par l'Agent

```mermaid
sequenceDiagram
    actor A as Agent
    participant UI as React (Frontend)
    participant API as Laravel API
    participant DB as MySQL

    A->>UI: Ouvre /agent/demandes
    UI->>API: GET /api/v1/agent/demandes
    API->>DB: SELECT demandes WITH user, typeDemande, agent
    DB-->>API: Liste des dossiers
    API-->>UI: Dossiers paginés
    UI-->>A: Tableau des dossiers

    A->>UI: Clique "Prendre en charge" sur un dossier
    UI->>API: POST /api/v1/agent/demandes/{uuid}/assign
    API->>DB: UPDATE demandes SET agent_id=current, statut=en_cours
    API->>DB: INSERT INTO historique_statuts
    DB-->>API: OK
    API-->>UI: {message: "Dossier assigné"}
    UI-->>A: Toast succès, liste rafraîchie

    A->>UI: Ouvre le dossier
    UI->>API: GET /api/v1/agent/demandes/{uuid}
    API->>DB: SELECT demande WITH toutes relations
    DB-->>API: Données complètes
    API-->>UI: Dossier complet
    UI-->>A: Page détail dossier

    alt Validation
        A->>UI: Clique "Valider le dossier"
        UI->>API: PATCH /api/v1/agent/demandes/{uuid}/statut {statut: validee}
        API->>DB: UPDATE demandes SET statut=validee, date_cloture=now()
        API->>DB: INSERT INTO historique_statuts
        DB-->>API: OK
        API-->>UI: 200 {message: "Statut mis à jour"}
        UI-->>A: Toast succès

    else Rejet
        A->>UI: Clique "Rejeter", saisit motif
        UI->>API: PATCH /api/v1/agent/demandes/{uuid}/statut {statut: rejetee, motif_rejet: "..."}
        API->>DB: UPDATE demandes SET statut=rejetee, motif_rejet=..., date_cloture=now()
        API->>DB: INSERT INTO historique_statuts
        DB-->>API: OK
        API-->>UI: 200
        UI-->>A: Toast succès

    else Document manquant
        A->>UI: Saisit la pièce requise
        UI->>API: PATCH .../statut {statut: document_manquant, piece_manquante: "CNI"}
        API->>DB: UPDATE demandes SET statut=document_manquant, piece_manquante="CNI"
        API->>DB: INSERT INTO historique_statuts
        API->>DB: INSERT INTO notifications (user_id=citoyen)
        DB-->>API: OK
        API-->>UI: 200
        UI-->>A: Toast succès
    end
```

---

## 5. Diagramme de Séquence — Génération du Document PDF

```mermaid
sequenceDiagram
    actor U as Citoyen / Agent
    participant UI as React (Frontend)
    participant API as Laravel API
    participant Svc as DocumentGeneratorService
    participant DB as MySQL
    participant Store as Storage

    U->>UI: Clique "Télécharger Document Officiel"
    Note over UI: has_active_template = true

    UI->>API: GET /api/v1/demandes/{uuid}/generer-document (responseType: blob)
    API->>DB: SELECT demande WITH user, typeDemande, agent, naissance...
    API->>API: Vérifier statut === 'validee'

    alt Statut non validé
        API-->>UI: 422 {message: "Le dossier doit être validé"}
        UI-->>U: Toast erreur
    else Statut validé
        API->>DB: SELECT document_templates WHERE type_demande_id=X AND actif=true
        alt Pas de template actif
            API-->>UI: 404
            UI-->>U: Toast "Aucun modèle activé"
        else Template trouvé
            API->>Svc: generer(demande)
            Svc->>Store: Lire image template
            Store-->>Svc: Binaire image
            Svc->>Svc: Encoder image en base64
            Svc->>Svc: extraireDonnees(demande) → {nom, prenoms, date_naissance...}
            Svc->>Svc: Construire HTML (image fond + textes positionnés en %)
            Svc->>Svc: Pdf::loadHTML(html)->output()
            Svc-->>API: Contenu PDF binaire
            API-->>UI: 200 application/pdf (blob)
            UI->>UI: createObjectURL(blob) + a.click()
            UI-->>U: Téléchargement "Document_MAI-2026-00001.pdf"
        end
    end
```

---

## 6. Diagramme d'Activité — Cycle de Vie d'un Dossier

```mermaid
stateDiagram-v2
    [*] --> en_attente : Citoyen soumet la demande

    en_attente --> en_cours : Agent prend en charge
    en_attente --> en_attente : Aucun agent disponible

    en_cours --> validee : Agent valide
    en_cours --> rejetee : Agent rejette (motif obligatoire)
    en_cours --> document_manquant : Agent demande une pièce

    document_manquant --> en_cours : Citoyen fournit la pièce\n(agent reprend le traitement)
    document_manquant --> rejetee : Citoyen ne fournit pas\nla pièce dans les délais

    validee --> [*] : Dossier clôturé ✅\nDocument PDF disponible
    rejetee --> [*] : Dossier clôturé ❌\nMotif communiqué au citoyen

    note right of en_attente
        Numéro dossier généré
        Notification citoyen
    end note

    note right of document_manquant
        Pièce manquante stockée
        Notification citoyen
        Bandeau alerte sur dossier
    end note

    note right of validee
        Date clôture enregistrée
        Bouton téléchargement activé
    end note
```

---

## 7. Modèle Conceptuel de Données (MCD)

```mermaid
erDiagram
    USERS {
        int id PK
        string prenom
        string nom
        string email UK
        string telephone
        enum role "citoyen|agent|administrateur"
        bool is_active
    }

    TYPES_DEMANDES {
        int id PK
        string code UK
        string libelle
        int delai_jours_ouvrables
        bool is_active
    }

    DEMANDES {
        int id PK
        string uuid UK
        string numero_dossier UK
        int user_id FK
        int agent_id FK
        int type_demande_id FK
        enum statut
        enum priorite
        string piece_manquante
        string motif_rejet
        datetime date_cloture
    }

    HISTORIQUE_STATUTS {
        int id PK
        int demande_id FK
        int user_id FK
        string ancien_statut
        string nouveau_statut
        text commentaire
        datetime created_at
    }

    DOCUMENTS {
        int id PK
        int demande_id FK
        string nom_original
        string chemin
        string mime_type
        int taille_octets
    }

    MESSAGES {
        int id PK
        int sender_id FK
        int receiver_id FK
        int demande_id FK
        text contenu
        bool lu
        datetime lu_at
    }

    NOTIFICATIONS {
        int id PK
        int user_id FK
        int demande_id FK
        string type
        string message
        bool lu
    }

    DOCUMENT_TEMPLATES {
        int id PK
        int type_demande_id FK UK
        string nom
        string chemin_image
        json champs
        bool actif
    }

    DEMANDE_NAISSANCES {
        int id PK
        int demande_id FK UK
        string nom
        string prenoms
        date date_naissance
        string lieu_naissance
        string genre
        string nom_pere
        string nom_mere
    }

    DEMANDE_RESIDENCES {
        int id PK
        int demande_id FK UK
        string nom
        string adresse_complete
        string quartier_commune
        string duree_residence
    }

    DEMANDE_MARIAGES {
        int id PK
        int demande_id FK UK
        string nom_epoux
        string nom_epouse
        date date_mariage
        string lieu_mariage
    }

    DEMANDE_LEGALISATIONS {
        int id PK
        int demande_id FK UK
        string nom
        string type_document
        string pays_destination
    }

    USERS ||--o{ DEMANDES : "soumet"
    USERS ||--o{ DEMANDES : "traite"
    TYPES_DEMANDES ||--o{ DEMANDES : "catégorise"
    TYPES_DEMANDES ||--o| DOCUMENT_TEMPLATES : "possède"
    DEMANDES ||--o{ HISTORIQUE_STATUTS : "retrace"
    DEMANDES ||--o{ DOCUMENTS : "contient"
    DEMANDES ||--o{ NOTIFICATIONS : "génère"
    DEMANDES ||--o| DEMANDE_NAISSANCES : "détaille"
    DEMANDES ||--o| DEMANDE_RESIDENCES : "détaille"
    DEMANDES ||--o| DEMANDE_MARIAGES : "détaille"
    DEMANDES ||--o| DEMANDE_LEGALISATIONS : "détaille"
    USERS ||--o{ MESSAGES : "envoie"
    USERS ||--o{ MESSAGES : "reçoit"
    USERS ||--o{ NOTIFICATIONS : "reçoit"
```

---

*Diagrammes générés avec Mermaid — Rendu disponible sur GitHub, Notion, draw.io (import), VS Code (extension Mermaid Preview)*
