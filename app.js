const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const schema = require('./server/schema/schema');
const testSchema = require('./server/schema/types_schema');

const app = express();

const port = process.env.PORT || 4000;

// mongodb+srv://sridharswaminath:<password>@graphqlcluster.ebqpgat.mongodb.net/?retryWrites=true&w=majority
app.use(cors());
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
  }));

// MONGOOSE CONNECT
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphqlcluster.ebqpgat.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`,
{useNewUrlParser:true, useUnifiedTopology: true}).then(() => {
  app.listen({port: port}, () => {
    console.log(process.env.mongoUserName)
    console.log("Listening for requests on my awesom port "+ port);
  })
}).catch((e)=>{
  console.log(process.env.mongoUserName)
  return console.log("error "+ e);
})

// app.listen(3000, () => { //localhost:4000
//     console.log('Listening for request');
// });

