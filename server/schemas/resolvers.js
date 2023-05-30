const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) =>{
        if (context.user) {
            return User.findOne({_id: context.user._id }).populate('savedBooks');
        }
        throw new AuthenticationError('You need to be logged in!')
    },
},
Mutation: {
    addUser: async (parent, { username, email, password }) => {
        try {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };   
        } catch (error) {
            console.log(error)
        }
    },
    loginUser: async (parent, { email, username,password }) => {
        console.log(email)
        console.log(username)
        console.log(password)
        var user;
        if(!email){
            user = await User.findOne({ username });
        } else{
            user =  await User.findOne({email})
        }

        if (!user) {
            throw new AuthenticationError('No user found with this email address');
        }
        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
            throw new AuthenticationError('Incorrect credntials');
        }
        const token = signToken(user);
        return { token, user };
    },
    saveBook: async(parent, { newBook }, context) => {
        if(context.user) {
            return User.findOneAndUpdate(
                {_id: context.user._id},
                {
                    $addToSet: {
                        savedBooks:
                           newBook, 
                    },
                },
                {
                    new: true,
                }
            );
        }
        throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, {bookId}, context) => {
        console.log('DELETING A BOOK')
        console.log(bookId)
        if (context.user) {
            return User.findOneAndUpdate(
                {_id: context.user._id},
                {
                    $pull: {
                        savedBooks: {
                            bookId: bookId
                        },
                    },
                },
                { 
                    new: true 
                }
                );
        }
        throw new AuthenticationError('You need to be logged in!')
    },
},
};

module.exports = resolvers;