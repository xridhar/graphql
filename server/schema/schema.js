const graphql = require('graphql');
const _ = require('lodash');


// DUMMY DATA
var usersData = [
    {id: '1', name: 'Bond', age: 36, profession: "Software Engineer"},
    {id: '13', name: 'Anna', age: 26, profession: "Civil Engineer"},
    {id: '211', name: 'Bella', age: 16, profession: "Programmer"},
    {id: '19', name: 'Gina', age: 26, profession: "Data Manager"},
    {id: '150', name: 'Georgina', age: 36, profession: "Baker"}
];

var hobbyData = [
    {id: '1', title: 'Programming', description: "Software Engineer", userId: '1'},
    {id: '2', title: 'Anna', description: "Civil Engineer", userId: '13'},
    {id: '3', title: 'Bella', description: "Programmer", userId: '19'},
    {id: '4', title: 'Gina', description: "Data Manager", userId: '19'},
    {id: '5', title: 'Georgina', description: "cooking", userId: '150'}

];

var postData = [
    {id: '1', comment: "Building a Mind", userId: '1'},
    {id: '2', comment: "GraphQL is Amazing", userId: '1'},
    {id: '3', comment: "Change the world 1", userId: '19'},

];

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema
} = graphql

//Create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for User',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return _.filter(postData, {userId: parent.id});
            }
        },

        hobbies : {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return _.filter(hobbyData, {userId: parent.id});
            }
        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby Description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(usersData, {id: parent.userId})
            }
        }
    })
});

//POST Type (id, comment)

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(usersData, {id: parent.userId})
            }
        }
    })
})


//RootQuery
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Description",
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args) {
                return _.find(usersData, {id: args.id})
          
            }
        },

        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return usersData;
            }
        },

        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return _.find(hobbyData, {id: args.id})
                //return data for our hobby
            }
        },

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return hobbyData;
            }
        },

        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                //return data (post data)
                return _.find(postData, {id: args.id})
            }
        },

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return postData;
            }
        },


    }
});

// Mutations

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Todo: Create User Mutation
        createUser: {
            type: UserType,
            args: {
                // id: { type: GraphQLID },
                name: { type: GraphQLString },
                age: { type:GraphQLInt },
                profession: { type: GraphQLString },
            },
            resolve(parent, args) {
                let user = {
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                };
                return user;
            }
        },
        // Todo: Create POST Mutation
        createPost: {
            type: PostType,
            args: {
                // id: { type: GraphQLID },
                comment: { type: GraphQLString },
                userId: { type:GraphQLID }
            },
            resolve(parent, args) {
                let post = {
                    comment: args.comment,
                    userId: args.userId
                };
                return post;
            }
        },
        // Todo: Create Hobby Mutation
        createHobby: {
            type: HobbyType,
            args: {
                // id: { type: GraphQLID },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                userId: { type:GraphQLID }
            },
            resolve(parent, args) {
                let hobby = {
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                };
                return hobby;
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})