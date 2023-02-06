const graphql = require('graphql');
const _ = require('lodash');

const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");

// DUMMY DATA
// var usersData = [
//     {id: '1', name: 'Bond', age: 36, profession: "Software Engineer"},
//     {id: '13', name: 'Anna', age: 26, profession: "Civil Engineer"},
//     {id: '211', name: 'Bella', age: 16, profession: "Programmer"},
//     {id: '19', name: 'Gina', age: 26, profession: "Data Manager"},
//     {id: '150', name: 'Georgina', age: 36, profession: "Baker"}
// ];

// var hobbyData = [
//     {id: '1', title: 'Programming', description: "Software Engineer", userId: '1'},
//     {id: '2', title: 'Anna', description: "Civil Engineer", userId: '13'},
//     {id: '3', title: 'Bella', description: "Programmer", userId: '19'},
//     {id: '4', title: 'Gina', description: "Data Manager", userId: '19'},
//     {id: '5', title: 'Georgina', description: "cooking", userId: '150'}

// ];

// var postData = [
//     {id: '1', comment: "Building a Mind", userId: '1'},
//     {id: '2', comment: "GraphQL is Amazing", userId: '1'},
//     {id: '3', comment: "Change the world 1", userId: '19'},

// ];

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} = graphql

//Create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for User',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                // return _.filter(postData, {userId: parent.id});
                return Post.find({userId: parent.id});
            }
        },

        hobbies : {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                // return _.filter(hobbyData, {userId: parent.id});
                return Hobby.find({userId: parent.id})
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
                // return _.find(usersData, {id: parent.userId})
                return User.find({ id: parent.userId })
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
                // return _.find(usersData, {id: parent.userId})
                return User.find({id: parent.userId})
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
                // return _.find(usersData, {id: args.id})
                return User.find({id: args.id})
          
            }
        },

        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User;
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
                // return _.find(postData, {id: args.id})
                return Post.find({id: args.id});
            }
        },

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post;
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
                name: { type: GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLNonNull(GraphQLInt) },
                profession: { type: GraphQLString },
            },
            resolve(parent, args) {
                let user = User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                });

                return user.save();
            }
        },

        // Update user
        UpdateUser: {
            type: UserType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
                name: { type: GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLNonNull(GraphQLInt) },
                profession: { type: GraphQLString },
            },
            resolve(parent, args) {
                return (updateUser = User.findByIdAndUpdate(
                    args.id, 
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    },
                    {
                        new: true 
                    }// send back the updated object type
                ))
            }
        },
        // Todo: Create POST Mutation
        createPost: {
            type: PostType,
            args: {
                // id: { type: GraphQLID },
                comment: { type: GraphQLNonNull(GraphQLString) },
                userId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let post = Post({
                    comment: args.comment,
                    userId: args.userId
                });
                return post.save();
            }
        },

        // Update Post
        UpdatePost: {
            type: PostType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
                comment: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return (updatePost = Post.findByIdAndUpdate(
                    args.id, 
                    {
                        $set: {
                            comment: args.comment
                        }
                    },
                    {
                        new: true 
                    }// send back the updated object type
                ))
            }
        },


        // Todo: Create Hobby Mutation
        createHobby: {
            type: HobbyType,
            args: {
                // id: { type: GraphQLID },
                title: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                userId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let hobby = Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                });
                return hobby.save();
            }
        },

        // Update Hobby
        UpdateHobby: {
            type: HobbyType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
                title: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return (UpdateHobby = Hobby.findByIdAndUpdate(
                    args.id, 
                    {
                        $set: {
                            title: args.title,
                            description: args.description
                        }
                    },
                    {
                        new: true 
                    }// send back the updated object type
                ))
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})