// Will hold the query GET_ME, which will execute the me query set up using Apollo Server
import { gql } from '@apollo/client';

export const GET_ME = gql`
query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        authors
        description
        title
        bookId
        image
        link

      }
    }
  }
`