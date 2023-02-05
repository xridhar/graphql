const graphql = require('graphql');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat

} = graphql;

//Scalar Types

/* 

String
Int
Float
Boolean
ID

*/

//RootQuery


const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Description about a Person Type',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt},
        isMarried: { type: GraphQLBoolean },
        gpa: { type: GraphQLFloat },

        justAType: {
            type: Person,
            resolve(parent, args) {
                return parent;
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        person: {
            type: Person,
            resolve(parent, args) {
                let personObj = {
                    name: '',
                    age: 32,
                    isMarried: true,
                    gpa: 4.0
                };
                return personObj;
            }
            
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})