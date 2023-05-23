const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) =>{
        if (context.user) {
            return User.findOne({_id: context.user._id }).populate('thoughts');
        }
        throw new AuthenticationError('You need to be logged in!')
    },
},
Mutation: {
    addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

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
            return Book.findOneAndUpdate(
                {_id: bookId},
                {
                    $addToSet: {
                        saveBook: {
                           newBook 
                        }
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
        if (context.user) {
            return Book.findOneAndUpdate(
                {_id: bookId},
                {
                    $pull: {
                        savedBooks: {
                            _id: bookId
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