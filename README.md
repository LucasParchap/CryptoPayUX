# UX Indexer

## **Introduction**
Votre mission est de construire une interface utilisateur simple pour :
- Se connecter à Ethereum.
- Interagir avec la blockchain.
- Intégrer l'indexeur SQD.
- Permettre aux utilisateurs d'effectuer des transactions blockchain.

Vous récupérerez, afficherez et gérerez des données liées aux tokens, tout en vous concentrant sur une expérience utilisateur fluide à l'aide d'outils modernes.

---

## **Objectifs**
Ce dépôt décrit les tâches nécessaires pour configurer l'application. Les objectifs sont :
1. Configurer une application web3 moderne.
2. Se connecter et interagir avec Ethereum via **Wagmi.sh**.
3. Récupérer et afficher des données à l'aide de l'indexeur **SQD**.
4. Créer une interface utilisateur fonctionnelle pour l'envoi de transactions blockchain.

---

## **Liste des tâches**

### **Partie 1 : Connexion à Ethereum et Configuration de Base (9 pts)**
1. **Créer un Repository GitHub (1 pt)**
    - Créez un repository pour héberger votre projet.

2. **Initialiser une application Next.js avec Wagmi.sh (3 pts)**
    - Installez et configurez Wagmi pour interagir avec Ethereum.
    - Créez une page `/chain-info` qui :
        - Se connecte à Ethereum.
        - Affiche les informations suivantes :
            - ID de la chaîne actuelle.
            - Dernier numéro de bloc.
            - Dernier hash de bloc.
            - Gas utilisé.
            - Prix du gas.
            - Frais brûlés.

3. **Ajouter un bouton Connect (3 pts)**
    - Ajoutez une section Header avec un bouton **Connect Wallet** qui :
        - Permet aux utilisateurs de connecter ou déconnecter leur portefeuille.
        - Affiche l'adresse du portefeuille connecté et le solde en ETH.

4. **Gérer les erreurs de chaîne (2 pts)**
    - Affichez une erreur si l'utilisateur est connecté à une chaîne autre que **Ethereum Mainnet** ou un testnet spécifié (ex. Sepolia).
    - Ajoutez un bouton pour passer à **Ethereum Mainnet** ou au testnet spécifié.

---

### **Partie 2 : Intégration avec l'indexeur SQD (9 pts)**
1. **Tutoriel (2 pts)**
    - Complétez le tutoriel sur [SQD.dev](https://sqd.dev).

2. **Récupérer les données de l'indexeur (4 pts)**
    - Utilisez l'indexeur SQD pour récupérer :
        - Informations sur les tokens (ex. symbole, nom, décimales, offre totale).
        - Soldes des tokens pour une adresse spécifique.
        - Métriques (ex. nombre total de transferts, nombre de détenteurs).

3. **Créer une page de données (3 pts)**
    - Créez une page `/token-data` qui :
        - Affiche les informations sur les tokens (symbole, nom, décimales, offre totale).
        - Affiche les soldes des tokens pour une adresse sélectionnée.
        - Inclut les métriques des tokens dans une section d'informations.

---

### **Partie 3 : Envoi de transactions (7 pts)**
1. **Créer une page d'envoi de transactions (4 pts)**
    - Créez une page `/send-tx` avec une interface utilisateur conviviale pour envoyer des transactions Ethereum.
    - La page doit inclure :
        - Un champ d'entrée pour l'adresse du destinataire.
        - Un champ d'entrée pour le montant d'ETH à envoyer.
        - Un bouton pour confirmer et envoyer la transaction.

    - **Validation des entrées** :
        - Assurez-vous que l'adresse du destinataire est valide.
        - Affichez un message d'erreur clair si la transaction échoue.
        - Affichez un message de confirmation avec le hash de la transaction en cas de succès.

---

### **Tâches Bonus (3 pts)**
1. **Déployer votre application (3 pts)**
    - Déployez votre application sur une plateforme gratuite comme **Vercel**, **Railway**, ou une autre plateforme.
    - Fournissez le lien de déploiement ou une démonstration locale (par exemple, une vidéo).

---

## **Livrables**
1. **Repository GitHub :**
    - Fournissez un lien vers votre repository GitHub contenant le projet.

2. **Déploiement ou Démo Locale :**
    - Si l'application est hébergée, fournissez le lien de déploiement.
    - Sinon, fournissez une vidéo montrant l'implémentation locale.

---

## **Évaluation**
| **Section**                        | **Points** |
|-------------------------------------|------------|
| Partie 1 : Connexion à Ethereum     | 9 pts      |
| Partie 2 : Intégration avec SQD     | 9 pts      |
| Partie 3 : Envoi de transactions    | 4 pts      |
| **Bonus : Déploiement**             | **3 pts**  |
| **Total Possible**                  | **25 pts** |

**Note :** Le score final est calculé sur 22 points, avec des points bonus pour atteindre un maximum de 25 points.

---

### **Technologies Utilisées**
- **Next.js** : Framework React pour le développement web.
- **Wagmi** : Librairie pour interagir avec Ethereum.
- **SQD Indexer** : Outil pour récupérer des données liées aux tokens.
- **Vercel** : Déploiement d’applications Next.js.

---

Si vous avez des questions ou des suggestions, n’hésitez pas à créer une issue ou à contribuer au projet ! 😊
