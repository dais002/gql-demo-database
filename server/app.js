const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');
const PORT = 4000;
const cors = require('cors')


const schema = require('./schema/schema');

// allow cors so that frontend can query to backend
app.use(cors());


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));


