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
    getTitle: String
  }

  type Mutation {
    setTitle(title: String): String
  }
`);

// The root provides a resolver function for each API endpoint
var mockDatabase = {};
var root = {
  setTitle: function ({title}) {
    mockDatabase.title = title;
    return title;
  },
  getTitle: function () {
    return mockDatabase.title;
  },
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
