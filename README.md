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

https://www.slideshare.net/BackeliteAgency/graph-ql-par-andy-gigon

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