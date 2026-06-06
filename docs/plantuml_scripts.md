# Scripts PlantUML — Smart e-Mairie

Copiez chaque bloc `@startuml ... @enduml` dans PlantUML.

---

## 1. Diagramme de Cas d'Utilisation

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle
skinparam actorStyle awesome
skinparam backgroundColor #FAFAFA
skinparam usecase {
  BackgroundColor #EEF2FF
  BorderColor #6366F1
  ArrowColor #6366F1
}

actor "Citoyen" as C #lightblue
actor "Agent" as A #lightgreen
actor "Administrateur" as ADM #lightyellow

ADM -up-|> A : hérite

rectangle "Authentification" {
  (S'inscrire) as UC1
  (Se connecter) as UC2
  (Réinitialiser\nmot de passe) as UC3
  (Gérer son profil) as UC4
}

rectangle "Espace Citoyen" {
  (Soumettre\nune demande) as UC5
  (Suivre\nses dossiers) as UC6
  (Consulter\nun dossier) as UC7
  (Télécharger\ndocument officiel) as UC8
  (Envoyer un\nmessage à l'agent) as UC9
}

rectangle "Espace Agent" {
  (Voir tous\nles dossiers) as UC10
  (Prendre en charge\nun dossier) as UC11
  (Valider un dossier) as UC12
  (Rejeter un dossier) as UC13
  (Demander\npièce manquante) as UC14
  (Ajouter\nnote interne) as UC15
  (Répondre\naux messages) as UC16
  (Générer\ndocument PDF) as UC17
}

rectangle "Espace Administrateur" {
  (Tableau de\nbord statistiques) as UC18
  (Gérer les\nutilisateurs) as UC19
  (Gérer modèles\nde documents) as UC20
  (Configurer\nparamètres système) as UC21
  (Exporter\nles données) as UC22
}

C --> UC1
C --> UC2
C --> UC3
C --> UC4
C --> UC5
C --> UC6
C --> UC7
C --> UC8
C --> UC9

A --> UC2
A --> UC4
A --> UC10
A --> UC11
A --> UC12
A --> UC13
A --> UC14
A --> UC15
A --> UC16
A --> UC17

ADM --> UC18
ADM --> UC19
ADM --> UC20
ADM --> UC21
ADM --> UC22
@enduml
```

---

## 2. Diagramme de Classes

```plantuml
@startuml
skinparam classAttributeIconSize 0
skinparam backgroundColor #FAFAFA
skinparam class {
  BackgroundColor #EEF2FF
  BorderColor #6366F1
  ArrowColor #4F46E5
  HeaderBackgroundColor #6366F1
  HeaderFontColor #FFFFFF
}

enum RoleEnum {
  citoyen
  agent
  administrateur
}

enum StatutEnum {
  en_attente
  en_cours
  document_manquant
  validee
  rejetee
}

enum PrioriteEnum {
  normale
  haute
  urgente
}

class User {
  +int id
  +String prenom
  +String nom
  +String email
  +String telephone
  +RoleEnum role
  +boolean is_active
  +String avatar_path
  --
  +demandes()
  +messages()
  +notifications()
}

class TypeDemande {
  +int id
  +String code
  +String libelle
  +String description
  +int delai_jours_ouvrables
  +boolean is_active
  --
  +demandes()
  +documentTemplate()
}

class Demande {
  +int id
  +String uuid
  +String numero_dossier
  +int user_id
  +int agent_id
  +int type_demande_id
  +StatutEnum statut
  +PrioriteEnum priorite
  +String description
  +String motif_rejet
  +String piece_manquante
  +String notes_internes
  +Date date_echeance
  +DateTime date_cloture
  --
  +user()
  +agent()
  +typeDemande()
  +documents()
  +historiqueStatuts()
}

class HistoriqueStatut {
  +int id
  +int demande_id
  +int user_id
  +String ancien_statut
  +String nouveau_statut
  +String commentaire
  +DateTime created_at
}

class Document {
  +int id
  +int demande_id
  +String nom_original
  +String nom_fichier
  +String chemin
  +String mime_type
  +int taille_octets
}

class Message {
  +int id
  +int sender_id
  +int receiver_id
  +int demande_id
  +String contenu
  +boolean lu
  +DateTime lu_at
  +DateTime edited_at
}

class Notification {
  +int id
  +int user_id
  +int demande_id
  +String type
  +String message
  +boolean lu
  +DateTime lu_at
}

class DocumentTemplate {
  +int id
  +int type_demande_id
  +String nom
  +String chemin_image
  +JSON champs
  +boolean actif
}

class DemandeNaissance {
  +int id
  +int demande_id
  +String nom
  +String prenoms
  +Date date_naissance
  +String lieu_naissance
  +String genre
  +String nom_pere
  +String prenom_pere
  +String profession_pere
  +String nom_mere
  +String prenom_mere
  +String profession_mere
  +String motif
  +int nombre_copies
}

class DemandeResidence {
  +int id
  +int demande_id
  +String nom
  +String prenoms
  +String adresse_complete
  +String quartier_commune
  +String duree_residence
  +String motif
  +int nombre_copies
}

class DemandeMariage {
  +int id
  +int demande_id
  +String nom_epoux
  +String prenom_epoux
  +String nom_epouse
  +String prenom_epouse
  +Date date_mariage
  +String lieu_mariage
  +String motif
  +int nombre_copies
}

class DemandeLegalisation {
  +int id
  +int demande_id
  +String nom
  +String prenoms
  +String type_document
  +String pays_destination
  +String usage_prevu
  +int nombre_copies
}

' Relations
User "1" --o{ "0..*" Demande : soumet
User "1" --o{ "0..*" Demande : traite
TypeDemande "1" --o{ "0..*" Demande : catégorise
TypeDemande "1" --o| "0..1" DocumentTemplate : possède

Demande "1" --o{ "0..*" HistoriqueStatut : retrace
Demande "1" --o{ "0..*" Document : contient
Demande "1" --o| "0..1" DemandeNaissance : détaille
Demande "1" --o| "0..1" DemandeResidence : détaille
Demande "1" --o| "0..1" DemandeMariage : détaille
Demande "1" --o| "0..1" DemandeLegalisation : détaille

User "1" --o{ "0..*" Message : envoie
User "1" --o{ "0..*" Notification : reçoit

User .. RoleEnum
Demande .. StatutEnum
Demande .. PrioriteEnum
@enduml
```

---

## 3. Diagramme de Séquence — Soumission d'une Demande

```plantuml
@startuml
skinparam backgroundColor #FAFAFA
skinparam sequenceArrowColor #6366F1
skinparam sequenceParticipantBackgroundColor #EEF2FF
skinparam sequenceParticipantBorderColor #6366F1
skinparam noteBackgroundColor #FEF3C7
skinparam noteBorderColor #D97706

actor "Citoyen" as C
participant "React\n(Frontend)" as UI #EEF2FF
participant "Laravel API\n/api/v1" as API #DCFCE7
participant "MySQL" as DB #FEE2E2
participant "Storage" as Store #FEF3C7

C -> UI : Ouvre /citoyen/nouvelle-demande
UI -> API : GET /api/v1/demandes/types
API -> DB : SELECT types_demandes\nWHERE is_active = true
DB --> API : Liste des types actifs
API --> UI : [ACTE_NAISSANCE, CERTIFICAT_RESIDENCE, ...]
UI --> C : Affiche le formulaire dynamique

C -> UI : Remplit le formulaire\n+ upload pièces jointes
C -> UI : Clique "Lancer la demande"
UI -> API : POST /api/v1/demandes\n(FormData multipart)

API -> API : Validation\nStoreDemandeRequest

alt Validation échouée
  API --> UI : 422 Unprocessable\n{errors: {...}}
  UI --> C : Affiche les erreurs\nen rouge par champ
else Validation réussie
  API -> DB : INSERT INTO demandes\n(uuid, numero_dossier, statut=en_attente)
  API -> DB : INSERT INTO demande_naissances\n(ou résidences / mariages / ...)
  API -> Store : Stocke les fichiers joints\ndans storage/public/documents/
  API -> DB : INSERT INTO documents\n(nom_original, chemin, mime_type)
  DB --> API : Demande créée
  API --> UI : 201 Created\n{numero_dossier: "MAI-2026-00001"}
  UI --> C : Redirige vers\n/citoyen/mes-dossiers
end
@enduml
```

---

## 4. Diagramme de Séquence — Traitement d'un Dossier (Agent)

```plantuml
@startuml
skinparam backgroundColor #FAFAFA
skinparam sequenceArrowColor #6366F1
skinparam sequenceParticipantBackgroundColor #EEF2FF
skinparam sequenceParticipantBorderColor #6366F1

actor "Agent" as A
participant "React\n(Frontend)" as UI #EEF2FF
participant "Laravel API\n/api/v1/agent" as API #DCFCE7
participant "MySQL" as DB #FEE2E2

A -> UI : Ouvre /agent/demandes
UI -> API : GET /api/v1/agent/demandes
API -> DB : SELECT demandes\nWITH user, typeDemande, agent
DB --> API : Liste paginée
API --> UI : Dossiers (JSON)
UI --> A : Tableau des dossiers

A -> UI : Clique "Prendre en charge"\nsur un dossier
UI -> API : POST /api/v1/agent/demandes/{uuid}/assign
API -> DB : UPDATE demandes\nSET agent_id = current_user,\nstatut = 'en_cours'
API -> DB : INSERT INTO historique_statuts\n(ancien=en_attente, nouveau=en_cours)
DB --> API : OK
API --> UI : 200 {message: "Dossier assigné"}
UI --> A : Toast succès + liste rafraîchie

A -> UI : Clique sur le dossier
UI -> API : GET /api/v1/agent/demandes/{uuid}
API -> DB : SELECT demande WITH\ntoutes relations
DB --> API : Données complètes
API --> UI : Dossier complet (JSON)
UI --> A : Page détail dossier

group Décision de l'agent
  alt Valider
    A -> UI : Clique "Valider le dossier"
    UI -> API : PATCH .../statut\n{statut: "validee"}
    API -> DB : UPDATE demandes\nSET statut=validee,\ndate_cloture=NOW()
    API -> DB : INSERT INTO historique_statuts
    API --> UI : 200 OK
    UI --> A : Toast "Dossier validé"

  else Rejeter
    A -> UI : Saisit le motif\nClique "Confirmer"
    UI -> API : PATCH .../statut\n{statut: "rejetee",\nmotif_rejet: "..."}
    API -> DB : UPDATE demandes\nSET statut=rejetee,\nmotif_rejet=...,\ndate_cloture=NOW()
    API -> DB : INSERT INTO historique_statuts
    API --> UI : 200 OK
    UI --> A : Toast "Dossier rejeté"

  else Document manquant
    A -> UI : Saisit la pièce requise\nClique "Notifier le citoyen"
    UI -> API : PATCH .../statut\n{statut: "document_manquant",\npiece_manquante: "CNI"}
    API -> DB : UPDATE demandes\nSET statut=document_manquant,\npiece_manquante="CNI"
    API -> DB : INSERT INTO historique_statuts\n(commentaire: "Pièce requise : CNI")
    API -> DB : INSERT INTO notifications\n(user_id=citoyen)
    API --> UI : 200 OK
    UI --> A : Toast "Citoyen notifié"
  end
end
@enduml
```

---

## 5. Diagramme de Séquence — Génération du Document PDF

```plantuml
@startuml
skinparam backgroundColor #FAFAFA
skinparam sequenceArrowColor #6366F1
skinparam sequenceParticipantBackgroundColor #EEF2FF
skinparam sequenceParticipantBorderColor #6366F1

actor "Citoyen / Agent" as U
participant "React\n(Frontend)" as UI #EEF2FF
participant "Laravel API" as API #DCFCE7
participant "DocumentGenerator\nService" as SVC #D1FAE5
participant "MySQL" as DB #FEE2E2
participant "Storage" as Store #FEF3C7

U -> UI : Clique "Télécharger\nDocument Officiel"\n(has_active_template = true)

UI -> API : GET /api/v1/demandes/{uuid}/generer-document\n(responseType: blob)

API -> DB : SELECT demande WITH\nuser, typeDemande, agent,\nnaissance, résidence...
DB --> API : Demande complète

API -> API : Vérifier statut === 'validee'

alt Statut non validé
  API --> UI : 422\n{message: "Dossier non validé"}
  UI --> U : Toast erreur

else Statut validé
  API -> DB : SELECT document_templates\nWHERE type_demande_id = X\nAND actif = true
  DB --> API : Template trouvé (ou pas)

  alt Pas de template actif
    API --> UI : 404
    UI --> U : Toast "Aucun modèle activé"

  else Template trouvé
    API -> SVC : generer(demande)
    SVC -> Store : Lire image template
    Store --> SVC : Binaire image (PNG/JPG)
    SVC -> SVC : Encoder image\nen base64 (data:image/...)
    SVC -> SVC : extraireDonnees(demande)\n→ {nom, prenoms,\ndate_naissance, ...}
    SVC -> SVC : Construire HTML A4\n(image fond +\ntextes positionnés en %)
    SVC -> SVC : Pdf::loadHTML(html)\n→ .setPaper('a4')\n→ .output()
    SVC --> API : Contenu PDF binaire
    API --> UI : 200 application/pdf\n(blob binaire)
    UI -> UI : createObjectURL(blob)
    UI -> UI : <a>.click() → téléchargement
    UI --> U : Fichier PDF téléchargé\n"Document_MAI-2026-00001.pdf"
  end
end
@enduml
```

---

## 6. Diagramme d'État — Cycle de Vie d'un Dossier

```plantuml
@startuml
skinparam backgroundColor #FAFAFA
skinparam state {
  BackgroundColor #EEF2FF
  BorderColor #6366F1
  ArrowColor #4F46E5
  StartColor #6366F1
  EndColor #6366F1
}

[*] --> en_attente : Citoyen soumet la demande\n(numéro dossier généré)

state en_attente : Dossier en file d'attente\nAucun agent assigné

state en_cours : Agent assigné\nTraitement en cours

state document_manquant : Pièce complémentaire\nrequise au citoyen\nNotification envoyée

state validee : Dossier clôturé ✅\nDate clôture enregistrée\nDocument PDF disponible

state rejetee : Dossier clôturé ❌\nMotif de rejet enregistré\nCitoyen informé

en_attente --> en_cours : Agent prend en charge\n[POST /assign]

en_cours --> validee : Agent valide\n[PATCH statut=validee]

en_cours --> rejetee : Agent rejette\n(motif obligatoire)\n[PATCH statut=rejetee]

en_cours --> document_manquant : Agent demande\nune pièce\n[PATCH statut=document_manquant]

document_manquant --> en_cours : Citoyen fournit\nla pièce manquante\n(agent remet en cours)

document_manquant --> rejetee : Pièce non fournie\ndans les délais

validee --> [*]
rejetee --> [*]
@enduml
```

---

## 7. Modèle Conceptuel de Données (MCD / ERD)

```plantuml
@startuml
skinparam backgroundColor #FAFAFA
skinparam entity {
  BackgroundColor #EEF2FF
  BorderColor #6366F1
}
skinparam arrowColor #4F46E5

entity "USERS" as U {
  * id : INT <<PK>>
  --
  * prenom : VARCHAR
  * nom : VARCHAR
  * email : VARCHAR <<UK>>
  * telephone : VARCHAR
  * role : ENUM(citoyen|agent|admin)
  * is_active : BOOLEAN
    avatar_path : VARCHAR
}

entity "TYPES_DEMANDES" as TD {
  * id : INT <<PK>>
  --
  * code : VARCHAR <<UK>>
  * libelle : VARCHAR
    description : TEXT
  * delai_jours_ouvrables : INT
  * is_active : BOOLEAN
}

entity "DEMANDES" as D {
  * id : INT <<PK>>
  --
  * uuid : VARCHAR <<UK>>
  * numero_dossier : VARCHAR <<UK>>
  * user_id : INT <<FK>>
    agent_id : INT <<FK>>
  * type_demande_id : INT <<FK>>
  * statut : ENUM
  * priorite : ENUM
    motif_rejet : VARCHAR
    piece_manquante : VARCHAR
    notes_internes : TEXT
    date_cloture : DATETIME
}

entity "HISTORIQUE_STATUTS" as HS {
  * id : INT <<PK>>
  --
  * demande_id : INT <<FK>>
  * user_id : INT <<FK>>
  * ancien_statut : VARCHAR
  * nouveau_statut : VARCHAR
    commentaire : TEXT
  * created_at : DATETIME
}

entity "DOCUMENTS" as DOC {
  * id : INT <<PK>>
  --
  * demande_id : INT <<FK>>
  * nom_original : VARCHAR
  * nom_fichier : VARCHAR
  * chemin : VARCHAR
  * mime_type : VARCHAR
  * taille_octets : INT
}

entity "MESSAGES" as MSG {
  * id : INT <<PK>>
  --
  * sender_id : INT <<FK>>
  * receiver_id : INT <<FK>>
    demande_id : INT <<FK>>
  * contenu : TEXT
  * lu : BOOLEAN
    lu_at : DATETIME
    edited_at : DATETIME
}

entity "NOTIFICATIONS" as N {
  * id : INT <<PK>>
  --
  * user_id : INT <<FK>>
    demande_id : INT <<FK>>
  * type : VARCHAR
  * message : VARCHAR
  * lu : BOOLEAN
}

entity "DOCUMENT_TEMPLATES" as DT {
  * id : INT <<PK>>
  --
  * type_demande_id : INT <<FK,UK>>
  * nom : VARCHAR
  * chemin_image : VARCHAR
    champs : JSON
  * actif : BOOLEAN
}

entity "DEMANDE_NAISSANCES" as DN {
  * id : INT <<PK>>
  --
  * demande_id : INT <<FK,UK>>
  * nom : VARCHAR
  * prenoms : VARCHAR
  * date_naissance : DATE
  * lieu_naissance : VARCHAR
  * genre : CHAR(1)
  * nom_pere : VARCHAR
  * nom_mere : VARCHAR
  * motif : VARCHAR
  * nombre_copies : INT
}

entity "DEMANDE_RESIDENCES" as DR {
  * id : INT <<PK>>
  --
  * demande_id : INT <<FK,UK>>
  * nom : VARCHAR
  * adresse_complete : VARCHAR
  * quartier_commune : VARCHAR
  * duree_residence : VARCHAR
  * motif : VARCHAR
}

entity "DEMANDE_MARIAGES" as DM {
  * id : INT <<PK>>
  --
  * demande_id : INT <<FK,UK>>
  * nom_epoux : VARCHAR
  * nom_epouse : VARCHAR
  * date_mariage : DATE
  * lieu_mariage : VARCHAR
  * motif : VARCHAR
}

entity "DEMANDE_LEGALISATIONS" as DL {
  * id : INT <<PK>>
  --
  * demande_id : INT <<FK,UK>>
  * nom : VARCHAR
  * type_document : VARCHAR
  * pays_destination : VARCHAR
  * usage_prevu : TEXT
}

' Cardinalités
U ||--o{ D : "soumet (user_id)"
U ||--o{ D : "traite (agent_id)"
TD ||--o{ D : "catégorise"
TD ||--o| DT : "possède"

D ||--o{ HS : "retrace"
D ||--o{ DOC : "contient"
D ||--o{ N : "génère"
D ||--o| DN : "détaille"
D ||--o| DR : "détaille"
D ||--o| DM : "détaille"
D ||--o| DL : "détaille"

U ||--o{ MSG : "envoie (sender_id)"
U ||--o{ MSG : "reçoit (receiver_id)"
U ||--o{ N : "reçoit"
@enduml
```

---

*Tous ces scripts sont compatibles avec PlantUML v1.2024+*
*Rendu en ligne : https://www.plantuml.com/plantuml/uml/*
