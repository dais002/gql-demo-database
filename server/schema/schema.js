const graphql = require('graphql');
const db = require('../model');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author_id: { type: GraphQLID },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        const text = `
        SELECT * FROM authors
        WHERE id = ${parent.author_id};`;
        return db.query(text)
        .then(data => {
          const results = data.rows[0]
          // console.log('result', results)
          return results
        })
        .catch(err => console.log(err))
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        const text = `
        SELECT * FROM books
        WHERE author_id = ${parent.id};`;
        return db.query(text)
        .then(data => {
          const results = data.rows
          // console.log('result', results)
          return results
        })
        .catch(err => console.log(err))
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        // code to get data from db
        const text = `
        SELECT * FROM books
        WHERE id = ${args.id}`
        return db.query(text)
          .then(data => {
            const results = data.rows[0]
            // console.log('result', results)
            return results
          })
          .catch(err => console.log(err))
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        const text = `
        SELECT * FROM authors
        WHERE id = ${args.id}`
        return db.query(text)
          .then(data => {
            const results = data.rows[0]
            // console.log('result', results)
            return results
          })
          .catch(err => console.log(err))
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        const text = `
        SELECT * FROM books`
        return db.query(text)
          .then(data => {
            const results = data.rows
            // console.log('result', results)
            return results
          })
          .catch(err => console.log(err))
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        const text = `
        SELECT * FROM authors`
        return db.query(text)
          .then(data => {
            const results = data.rows
            // console.log('result', results)
            return results
          })
          .catch(err => console.log(err))
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        const text = `
        INSERT INTO authors(name, age)
        VALUES ('${args.name}', ${args.age})
        RETURNING *`
        return db.query(text)
        .then(data => {
          const results = data.rows[0]
          // console.log('result', results)
          return results
        })
        .catch(err => console.log(err))
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        author_id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        const text = `
        INSERT INTO books(name, genre, author_id)
        VALUES ('${args.name}', '${args.genre}', ${args.author_id})
        RETURNING *`
        return db.query(text)
        .then(data => {
          const results = data.rows[0]
          // console.log('result', results)
          return results
        })
        .catch(err => console.log(err))
      }
    },
  }
})


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})