# Plateforme Open data MERNGOD

## Introduction

Nous nous proposons ici de mettre en place une plateforme opensource opendata (OD) à l'aide de

**Front End**

- React/Redux - R

**Back End**

- Apollo/GraphQL - G
- MongoDB/Mongoose - M
- Express - E
- NodeJS - N
-Passport

**Autres**

- Babel
- Webpack


### Installation et test de GraphQL

GraphQL est une technologie backend, c'est une alternative aux API REST qui va nous permettre d'accèder à nos données même si leur stockage est distribué,
GraphQL a été implémenté en plusieurs language (javascript, elixir, ruby, python et java), celle que nous utiliserons est graphQL.js.

Noté que GraphQL est une technologie issue est open sourcé par Facebook, son équivalent de chez Netflix est Falcor qui a une approche similaire mais qui se repose
sur JSON Graph.

Préparons notre répertoire et installons graphql.js

```
npm init -y
npm install graphql --save
```

Créons et éditons le fichier server.js:

```
const { graphql, buildSchema } = require('graphql'); // Format CommonJS
// import { graphql, buildSchema } from 'graphql'; // Format ES6 à utiliser avec babel

// Mise en place du schéma via le GraphQL schema language
// @see: http://graphql.org/graphql-js/object-types/
const schema = buildSchema(`
  type Query {
    test: String,
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  test: () => { // Match requestString
    return "It works!"; // Should be a string
  },
};

// Run the GraphQL query '{ hello }' and print out the response
// @see: http://graphql.org/graphql-js/graphql/#graphql
graphql(schema, '{ test }', root).then((response) => {
    console.log(response);
});

```
Exécutons notre server pour vérifier le fonctionnement de graphQL

```
node server.js
```

Nous devons récupérer ceci:

```
{ data: { hello: 'Hello world!' } }
```

### Installation d'Express

Express va nous permettre d'obtenir un vrai server API graphQL, pour cela ajoutons les deux modules suivants:

```
npm install express express-graphql graphql --save
```
et modifions notre fichier server.js comme suit:

```
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    test: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  test: () => {
    return 'It works!';
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // utilisation de GraphiQL
}));

const PORT = 4000;
const IP = '127.0.0.1';

app.listen(PORT, IP, () => {
  console.log(`Running a GraphQL API server at  ${IP}:${PORT}/graphql`);
});

```

En exécutant notre serveur on se rend compte à l'adresse: localhost:4000/graphql que nous avons bien notre interface GraphiQL.
il suffit de consulter l'adresse indiqué: http://localhost:4000/graphql
et de rentrer manuellement sa requête

par exemple: { test } on obtient:

```
{
  "data": {
    "test": "It works!"
  }
}
```

Notez que GraphiQL offre une autocomplétion (que l'on peut activer notamment par un CTRL+ESPACE) et vous renseigne sur la structure des données de l'API. Il gère également les erreurs,
et tente d'extrapoler ce que vous vouliez réellement faire.
en effet si on renseigne la requête suivant: { wronrequest }
on obtient:

```
{
  "errors": [
    {
      "message": "Cannot query field \"teset\" on type \"Query\". Did you mean \"test\"?",
      "locations": [
        {
          "line": 29,
          "column": 3
        }
      ]
    }
  ]
}
```

A présent via le mode developpeur de votre navigateur, en analysant de plus près le fonctionnement de graphiql,
on constate qu'il envoi une requête POST sur le point de connection /graphql
La requête envoi du contenu de type json ("Content-Type", "application/json") et accepte du contenu de retour au même
format, le contenu envoyé est le suivant:
```
{"query":"{\n  test\n}","variables":null,"operationName":null}
```

A présent améliorons notre serveur en permettant d'avoir plus d'arguments. Les types basiques sont les suivants:

- String
- Int
- Float
- Boolean
- ID

Chacun peut être null sauf si un point d'exclamation est ajouté, par exemple Int! ou String!

Imaginons que nous allons implémenté un compteur paramétrable avec une valeur de départ, un pas (step), le nombre de boucle
et 'opérateur, chacun étant obligatoire, nous devont rajouté un point d'exclamation après chaque définition de type.
Etn retour nous obtenons un tableau de Float.
Pour le choix de l'opérateur, nous créons un type enuméré "Operateur" que nosu réutiiserons comme suit:

```
var schema = buildSchema(`
  enum Operateur {
    plus
    moins
    multiplier
    diviser
  }
  type Query {
    compteur(start: Int!, step: Int!, loop: Int!, operateur: Operateur!): [Float]
  }
`);

```

Changeons notre root comme suit (noter que dans la fonction compteur nous utilisons l'affectation par décomposition (ES6):

```
var root = {
  compteur: ({ start, step, loop, operateur }) => {
    let result = []
    for(let i=0; i<loop; i++){
      switch(operateur){
        case 'moins': result.push(start-i*step); break;
        case 'diviser': result.push(start/i*step); break;
        case 'multiplier': result.push(start*i*step); break;
        default: result.push(start+i*step);
      }
    }
    return result;
  },
};

```

et enfin relancer votre serveur et rendez vous à la page: http://127.0.0.1:4000/graphql
A l'aide de l'autocomplétion rentré la requête suivante:

```
{
  compteur(start: 1, step: 3, loop: 10, operateur: multiplier)
}
```

Exécutez cette requête et vérifier que vous obtenez bien la table de multiplication de 3:

```
{
  "data": {
    "compteur": [
      0,
      3,
      6,
      9,
      12,
      15,
      18,
      21,
      24,
      27
    ]
  }
}

```
Nous avons a présent le contenu du fichier server.js suivant:

```
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  enum Operateur {
    plus
    moins
    multiplier
    diviser
  }
  type Query {
    compteur(start: Int!, step: Int!, loop: Int!, operateur: Operateur!): [Float]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  compteur: ({ start, step, loop, operateur }) => {
    let result = []
    for(let i=0; i<loop; i++){
      switch(operateur){
        case 'moins': result.push(start-i*step); break;
        case 'diviser': result.push(start/i*step); break;
        case 'multiplier': result.push(start*i*step); break;
        default: result.push(start+i*step);
      }
    }
    return result;
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // utilisation de GraphiQL
}));

const PORT = 4000;
const IP = '127.0.0.1';

app.listen(PORT, IP, () => {
  console.log(`Running a GraphQL API server at  ${IP}:${PORT}/graphql`);
});


```


### Mutation

Contrairement au type d'endpoint (point d'accès) Query qui permet de demander des données, il exite également le point d'accès Mutation qui permet d'alterer les données.

Supposons que nous voulions changer un texte comme par exemple le titre du site nous aurons les deux endpoints suivant:

```
type Mutation {
  setTitle(content: String): String
}

type Query {
  getTitle: String
}

```

Pour tester le code rentrons la mutation suivante:

```
mutation {
  setTitle(title:"Ceci est mon message")
}

```
Vous remarquerez qu'il faut écrire mutation alors que pour query nous ne l'avions pas fait. "query" et tout simplement une valeur implicite, si vous ne renseignez rien,
c'est "query" qui est pris en compte.
Vérifions que lors de l'appel du mutation, nous reçevons bien comme message le titre rentré

```
{
  "data": {
    "setTitle": "Ceci est mon message"
  }
}
```

A présent passons à l'endpoint Query et appelons getTitle comme suit:

```
{
  getTitle
}
```

et récupérons le message précédemment renseigné:

```
{
  "data": {
    "getTitle": "Ceci est mon message"
  }
}

```

### Subscription

C'est ce qui nous permettra de nous abonner pour avoir des renseignements en temps réel lors de l'appel à un mutateur


## Apollo

Pourquoi apollo, lui et relay (de Facebook) sont les leaders d'un point de vue client graphQL.
En quoi consiste leur travail? Il existe de nombreuses fonctionalités qui sont constamment réimplémentées dans chaque projet
comme par exemple:

- Mise en cache des données envoyés par le serveur
- Intégration du framework UI (React, Angular, Vue, Ember, ...)
- Cohérence du cache local après une mutation
- Gestion des websockets pour les abonnements GraphQL permettant des mises à jour en temps réel
- Pagination pour les collections

Toutes ces fonctionalités sont intégrés aux clients GraphQL Relay et Apollo. Mais il a fallut faire un choix,
et notre choix c'est porté sur Apollo  car il fonctionne avec tout les frameworks UI ci dessus cités alors que Relay est dédié à React.

Plus d'info [ici](https://blog.graph.cool/relay-vs-apollo-comparing-graphql-clients-for-react-apps-b40af58c1534)


## MongoDB et Mongoose

### Introduction à MongoDB

MongoDB (de Humongous qui veut dire énorme) est une base de donnée open source non relationelle, orienté document (l'unité de base).
Par analogie, à la terminologie SQL:
| SQL        | MongoDB           |
| ------------- |:-------------:|
| Base de données      | Base de données |
| Table      | Collection |
| Ligne / Enregistrement      | Document |
| Colonne      | Champ |
| Index      | Index |
| Jointure      | Imbrication ou référence |
| Clef primaire (peut être multiple)      | Clef primaire unique (représenté par le champ _id) |



Les documents n'ont pas forcément de schéma, ils sont vues comme des ensembles de couples clef/valeur au format JSON (JSON-Like) stocké physiquement
sous la forme de document BSON (Binary JSON)
Notez que dans la réalité, les documents d'une même collection sont relativement homogéne et adopte un structure similaire.

Cette base de données dit NoSQL (Not Only SQL) permet d'avoir des bases de données largement distribuée.
Les BD NoSQL sont une solution évolutive et disponible développée en réponse à l'augmentation exponentielle des données.
Contrairement au base de données relationelle basées sur le principe ACID (Atomicité, Consistence, Isolation & Durabilité),
les bases de données MongoDB suivent plutôt le paradigme CAP (Coherence, Haut disponibilité / Availability et Tolérance au partionnement / Partition Tolerance)
Not Only SQL ne veut pas dire pas d'SQL mais SQL et d'autre langage de manipulation et de requête.
Cerise sur le gateau, MongoDB utilise javascript comme langage natif

Il y a 4 grandes familles de base de données NoSQL:

- Clé/valeur: Redis, Riak, Voldemort (LinkedIn), DynamoDB (Amazon), Azure Table Storage, BerkeleyDB
- Orienté colonne: HBase (Hadoop), Cassandra (Facebook, Twitter), BigTable (Google)
- Orienté document: CouchDB (Apache), RavenDB (.NET/Windows), MongoDB (SourceForge)
- Orienté graphe: Neo4J, InfiniteGraph, OrentDB

La relation entre les données se fait par:

- Références (inclusion de lien ou référence d'une autre document) / Modèle de données normalisés
- Imbrication des documents en incluant un document dans un champ ou tableau / Modèle de données dénormalisés

Comment choisit-on entre les deux modèles:

- Si on risque de dupliquer les données, alors on utilise la référence: Relation Many-to-many
- Si c'est des relations de type contain et hierarchique on utilise les données imbriquées: Relation One-to-one et One-to-Many

Plus d'info [ici](https://mongoteam.gitbooks.io/introduction-a-mongodb/content/01-presentation/index.html) et [ici](https://fr.slideshare.net/LiliaSfaxi/bigdatachp4-putting-it-all-together)

### Implémentation de MongoDB

#### Installation

Selon le système d'exploitation de votre serveur vous trouverez [ici](https://docs.mongodb.com/manual/installation/#tutorials)
les étapes d'installation à suivre.

#### Auto-start

MongoDB doit être bien évidemment installé mais également auto-starté. Vous pouvez sur votre Linux utiliser les commandes

```
systemctl start nom_du_service.service
systemctl enable nom_du_service.service

```

#### Sécurité

Suivre ces [étapes](https://scotch.io/@micwanyoike/getting-started-with-mongodb-in-linux)
