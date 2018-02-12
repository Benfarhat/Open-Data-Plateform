// Reading graphql schema file
const fs = require('fs');
// Giving the path
const path = require('path');
// Node js framework
const express = require('express');
// Express-graphql modules
const graphqlHTTP = require('express-graphql');
// configuring schema, resolvers and so on
const { makeExecutableSchema } = require('graphql-tools');
// Our database client
const mongoose = require('mongoose');

// Getting GraphQL Schema
const schemaFile = path.join(__dirname, 'dcat.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');

// Resolvers
// - In memory storage

const CatalogResolver = [
  {
    id: "1",
    title: "Cupidatat eiusmod cillum nostrud Lorem id excepteur excepteur aliqua.",
    description: "Enim ullamco nisi consequat veniam consequat nisi cupidatat ut. Laboris dolor nisi veniam dolore consectetur consectetur non excepteur consequat. Excepteur Lorem fugiat et id. Elit excepteur labore non dolore irure. Cillum culpa eu sunt non eu elit ad commodo labore voluptate est cupidatat cupidatat. Laborum minim ex duis Lorem in sint.\r\n",
    issued: "2017-07-11T04:59:19 -01:00",
    modified: "2014-12-18T04:35:02 -01:00"
  },
  {
    id: "2",
    title: "Culpa aliqua ipsum nisi aliquip consectetur esse nostrud reprehenderit adipisicing proident duis irure veniam enim.",
    description: "Dolor tempor pariatur pariatur labore. Excepteur laborum eiusmod aute ad amet enim pariatur pariatur occaecat do ex et irure velit. Irure excepteur ea nulla commodo in ea magna qui cillum tempor in cillum. Lorem amet veniam laborum voluptate proident consequat incididunt commodo deserunt adipisicing irure fugiat aliquip do. Fugiat pariatur ex reprehenderit occaecat enim magna. Incididunt reprehenderit aliqua est consectetur eiusmod tempor velit amet sint minim sint.\r\n",
    issued: "2015-06-03T09:51:56 -01:00",
    modified: "2014-11-18T01:48:22 -01:00"
  },
  {
    id: "3",
    title: "Cupidatat pariatur cillum laborum amet nostrud aute sint qui.",
    description: "Eu ullamco proident commodo irure amet. Magna laboris sunt laborum do laborum duis excepteur sit. Enim laboris anim nulla laborum sit officia officia ea. Irure fugiat irure reprehenderit adipisicing aliquip exercitation ex duis dolor. Veniam id officia aliqua id velit. Cupidatat ad dolore nisi elit ipsum culpa fugiat ea ex do id. Ad consectetur nulla amet eu consectetur duis officia adipisicing exercitation cupidatat ad laborum.\r\n",
    issued: "2017-11-25T12:49:05 -01:00",
    modified: "2015-06-26T03:42:20 -01:00"
  }
];

const DatasetResolver = [
  {
    id: "10",
    title: "Cupidatat eu cillum Lorem dolore labore culpa enim est dolore sit occaecat eu in magna.",
    description: "Reprehenderit eiusmod exercitation nulla Lorem adipisicing officia qui dolor adipisicing amet. Magna duis fugiat pariatur laborum do. Proident minim do non anim. Dolor veniam enim enim magna. Elit aliquip consequat ad aliquip.\r\n",
    issued: "2015-10-23T04:09:25 -01:00",
    modified: "2014-05-21T06:19:23 -01:00",
    catalogId: 1
  },
  {
    id: "11",
    title: "Aliqua minim aliqua veniam magna velit aute irure.",
    description: "Voluptate eu anim amet deserunt et nostrud quis. Eiusmod proident exercitation consequat et anim consectetur labore ut culpa. Deserunt ad incididunt commodo mollit consequat excepteur quis qui ex voluptate. Exercitation pariatur sint magna excepteur irure commodo in. Excepteur voluptate aliquip eiusmod adipisicing. Excepteur proident aute do fugiat adipisicing voluptate nisi deserunt in laborum dolore laborum. Magna elit laboris sunt consequat sit voluptate velit dolore aute.\r\n",
    issued: "2017-04-30T06:57:11 -01:00",
    modified: "2017-06-16T10:12:07 -01:00",
    catalogId: 1
  },
  {
    id: "12",
    title: "Aliqua nisi magna aliqua nostrud.",
    description: "Cupidatat anim non proident amet culpa velit. Duis aliquip mollit nulla officia. Voluptate velit dolor labore reprehenderit amet sunt dolor sint. Occaecat anim aliquip magna duis exercitation anim qui. Occaecat laborum velit sunt aute est id. Cupidatat est ad nostrud proident mollit cillum. In enim veniam velit nisi commodo.\r\n",
    issued: "2016-03-24T03:41:26 -01:00",
    modified: "2014-11-08T09:30:36 -01:00",
    catalogId: 2
  },
  {
    id: "13",
    title: "Deserunt est nisi nisi cupidatat.",
    description: "Minim consectetur minim Lorem culpa do ullamco voluptate amet nisi. Nisi nulla eiusmod anim sint sit voluptate sit dolore do veniam dolor nostrud laboris ipsum. Anim ipsum consectetur magna sunt excepteur commodo do ad. Occaecat nulla dolore culpa pariatur exercitation. Eiusmod cupidatat sit laboris tempor enim consectetur occaecat dolore ut magna voluptate quis cillum dolore. Qui duis proident duis exercitation dolore est culpa cillum quis nostrud magna deserunt ut amet.\r\n",
    issued: "2014-04-09T01:13:34 -01:00",
    modified: "2015-07-11T10:57:43 -01:00",
    catalogId: 2
  },
  {
    id: "14",
    title: "Sit quis culpa dolor exercitation sint consectetur deserunt enim et tempor ad Lorem deserunt Lorem.",
    description: "Exercitation culpa commodo laboris irure tempor ea sunt proident duis consectetur fugiat. Reprehenderit aute velit adipisicing non laborum aliquip ut. Ut laborum magna elit deserunt minim proident quis. Est exercitation ea enim esse laboris irure culpa Lorem. Consequat labore elit Lorem amet. Non commodo pariatur labore est minim proident voluptate eiusmod Lorem amet.\r\n",
    issued: "2014-11-08T09:30:36 -01:00",
    modified: "2014-11-09T03:32:07 -01:00",
    catalogId: 3
  },
  {
    id: "15",
    title: "Aenean elementum, sem et eleifend auctor.",
    description: "Reprehenderit aute velit adipisicing non laborum aliquip ut. Exercitation culpa commodo laboris irure tempor ea sunt proident duis consectetur fugiat. Ut laborum magna elit deserunt minim proident quis. Est exercitation ea enim esse laboris irure culpa Lorem. Consequat labore elit Lorem amet. Non commodo pariatur labore est minim proident voluptate eiusmod Lorem amet.\r\n",
    issued: "2015-11-30T09:18:17 -01:00",
    modified: "2014-11-08T09:30:36 -01:00",
    catalogId: 1
  },
  {
    id: "16",
    title: "Curabitur magna odio, suscipit ac eleifend convallis, vestibulum vel neque",
    description: "Ut laborum magna elit deserunt minim proident quis. Est exercitation ea enim esse laboris irure culpa Lorem. Consequat labore elit Lorem amet. Non commodo pariatur labore est minim proident voluptate eiusmod Lorem amet. Exercitation culpa commodo laboris irure tempor ea sunt proident duis consectetur fugiat. Reprehenderit aute velit adipisicing non laborum aliquip ut.\r\n",
    issued: "2015-11-30T09:18:17 -01:00",
    modified: "2014-11-09T03:32:07 -01:00",
    catalogId: 1
  }
];

const DistributionResolver = [
  {
    id: "20",
    title: "Occaecat irure ut ex dolore amet minim exercitation dolor aliqua adipisicing pariatur aliqua consectetur.",
    description: "Ex occaecat irure incididunt tempor pariatur irure labore proident esse culpa veniam cupidatat. Esse enim magna aliquip id officia sint esse exercitation esse fugiat. Quis aliquip ipsum in esse tempor voluptate. Sint quis non non amet Lorem do consequat officia nostrud minim consequat enim mollit sint. Enim dolor id aliqua sint quis incididunt magna. Nisi consectetur cupidatat quis aute eu occaecat amet magna sit.\r\n",
    issued: "2014-09-03T04:07:00 -01:00",
    modified: "2016-12-02T11:16:22 -01:00",
    datasetId: 11
  },
  {
    id: "21",
    title: "Sunt velit cillum tempor eu consectetur.",
    description: "Lorem tempor proident ea cupidatat nulla voluptate culpa. Dolore nostrud exercitation do irure velit ipsum proident dolor qui et dolor pariatur occaecat. Incididunt commodo ut consectetur cupidatat anim sint nisi voluptate nisi ullamco esse. Nostrud laboris occaecat est eu voluptate ea aliqua qui esse ad. Incididunt ea et do aliqua nisi occaecat.\r\n",
    issued: "2014-08-07T02:07:50 -01:00",
    modified: "2014-08-14T11:12:45 -01:00",
    datasetId: 11
  },
  {
    id: "22",
    title: "Sunt occaecat sint quis nulla deserunt aliquip elit.",
    description: "Consectetur duis pariatur aliqua dolore ut esse nisi. Eu mollit nostrud sint occaecat tempor commodo voluptate aute est commodo quis. Consequat ad incididunt elit aliquip ex deserunt. Eu commodo sint excepteur magna quis. Voluptate nulla elit eu commodo Lorem amet enim proident elit eu dolor.\r\n",
    issued: "2014-06-16T08:57:05 -01:00",
    modified: "2017-12-15T09:52:30 -01:00",
    datasetId: 12
  },
  {
    id: "23",
    title: "Elit dolor labore voluptate ea aliqua qui.",
    description: "Aliquip id eiusmod id fugiat elit ut incididunt deserunt veniam reprehenderit ut tempor duis deserunt. Qui cupidatat aliqua nulla tempor nulla anim minim ullamco consectetur occaecat. Et ipsum exercitation ut excepteur labore veniam irure aliqua excepteur officia magna in Lorem. Quis dolore fugiat amet elit voluptate elit nulla exercitation aute irure do. Dolor occaecat culpa minim et consequat aliqua dolore veniam do. Aliqua excepteur id commodo elit incididunt in reprehenderit ipsum.\r\n",
    issued: "2016-08-14T03:35:52 -01:00",
    modified: "2016-02-12T09:56:43 -01:00",
    datasetId: 13
  }
];

// - Resolver: Responsible for mapping operation to function
// We can do this inside "Root fields" variable or another element that we call in makeExecutableSchema
// Note that find() is equivalent to filter() + shift()



const resolvers = {
  // Queries (get)
  Query: {
    Catalog: (_, { id }) => CatalogResolver.find(cat => cat.id == id),
   // Catalogs: (_, __, context) => context.mongoClient,

    Dataset: (_, { id }) => DatasetResolver.find(cat => cat.id == id),
    Datasets: (_, args, context) => {
      // console.log(context);
      if (args.catalogId) {
        let { catalogId } = args
        return DatasetResolver.filter(cat => cat.catalogId == catalogId)
      } else {
        return DatasetResolver
      }
    },

    Distribution: (_, { id }) => DistributionResolver.find(cat => cat.id == id),
    Distributions: (_, args) => {
      if (args.datasetId) {
        let { datasetId } = args
        return DistributionResolver.filter(dist => dist.datasetId == datasetId)
      } else {
        return DistributionResolver
      }
    },
  },

  //Mutation (post/update/delete)
  Mutation: {
    addCatalog: (_, { title, description }) => {
      let nextID = CatalogResolver.reduce((id, cat) => Math.max(id, cat.id), -1) + 1;
      console.log(nextID);
      let newCatalog = {
        id: nextID,
        title: title,
        description: description,
        issued: new Date(),
        modified: new Date()
      }
      CatalogResolver.push(newCatalog);
      return newCatalog;
    }

  },

  // Relation (join)
  Catalog: {
    dataset: (catalog) => DatasetResolver.filter(dataset => dataset.catalogId == catalog.id)
  },
  Dataset: {
    distribution: (dataset) => DistributionResolver.filter(distribution => distribution.datasetId == dataset.id)
  }

};




/*
In GraphiQL we can check this query with aliases and fragment (DRY):

query getDatasetFromCataloID($cat1: ID!, $cat2: ID!, $displayCID: Boolean!) {
test1: Datasets(catalogId:$cat1){
  ...datasetFields
},
test2: Datasets(catalogId:$cat2){
  ...datasetFields
}
}
fragment datasetFields on Dataset{
id
title
catalogId @include(if: $displayCID)
}

in Query Variables let's work with this:

{
  "cat1": 2,
  "cat2":3,
  "displayCID": false
}

-----------------------------------
or with curl

curl -XPOST -H "Content-Type:application/graphql" -d '
query {
  //...
}' http://localhost:4004/graphql

*/

const logger = { log: (e) => console.log(e) }


const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger,
  allowUndefinedInResolve: true, // for the moment, to change
  resolverValidationOptions: {}, // optional
});

const PORT_GRAPHQL = 4004;
const PORT_MONGODB = 27017;
const IP = '127.0.0.1';
const DB_NAME = 'opendata'

const start = async () => {
  mongoose.connect(`mongodb://${IP}:${PORT_MONGODB}/${DB_NAME}`);
  const mongoClient = mongoose.connection;
  mongoClient.on('error', (e) => {console.log('Failed to connect do database: ', e)})
  mongoClient.once('open', () => {console.log('Connected do database!')})

  var app = express();
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
    //graphiql: process.env.NODE_ENV === 'development',
    context: { mongoClient }
  }));

  app.listen(PORT_GRAPHQL, IP, () => {
    console.log(`+---------------------------------------------------------+

  |      OPEN DATA PLATEFORM - REACT/REDUX/APPOLO/GRAPHQL   |

  |                      Opendev TN                         |

  |         Running a GraphQL API server at:                |
                ${IP}:${PORT_GRAPHQL}/graphql
  +---------------------------------------------------------+`);
  });

};

start();
