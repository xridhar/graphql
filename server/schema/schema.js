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
    {id: '1', title: 'Programming', description: "Software Engineer"},
    {id: '2', title: 'Anna', description: "Civil Engineer"},
    {id: '3', title: 'Bella', description: "Programmer"},
    {id: '4', title: 'Gina', description: "Data Manager"},
    {id: '5', title: 'Georgina', description: "cooking"}

];

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
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
        profession: {type: GraphQLString}
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby Description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString}
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
                // we resolve with data
                // get and return data from a datasource

                /*
                EXAMPLE QUERY
                {
                    user(id: "1") {
                        name
                    }
                }
                */

            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return _.find(hobbyData, {id: args.id})
                //return data for our hobby
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})