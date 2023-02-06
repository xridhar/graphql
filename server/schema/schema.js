const graphql = require('graphql');
const _ = require('lodash');

const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");


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
                return User.find({ id: parent?.userId })
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
                return User.find({});
            }
        },

        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                // return _.find(hobbyData, {id: args.id})
                return Hobby.find({id: args.id})
                //return data for our hobby
            }
        },

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({});
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
                return Post.find({});
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

        //Remove User

        RemoveUser: {
            type: UserType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let removedUser = User.findByIdAndRemove(args.id).exec();
                if (!removedUser) {
                    throw new "Error"()
                }
                return removedUser;
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

         //Remove Post

         RemovePost: {
            type: PostType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let removedPost = Post.findByIdAndRemove(args.id).exec();
                if (!removedPost) {
                    throw new "Error"()
                }
                return removedPost;
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
                return (updatedHobby = Hobby.findByIdAndUpdate(
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

        //Remove Hobby

        RemoveHobby: {
            type: HobbyType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let removedHobby = Hobby.findByIdAndRemove(args.id).exec();
                if (!removedHobby) {
                    throw new "Error"()
                }
                return removedHobby;
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})