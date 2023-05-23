const { gql } = require('apollo-server-express');

const typeDefs = gpl`
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}
type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}
type Auth {
    token: ID!
    user: User
}
type Query {
    me: User
}
input InputSaveBook {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
}
type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(username: String!, email: String!, password: String!): Auth
    saveBook(newBook: InputSaveBook): User
    removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;