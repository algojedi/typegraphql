import { graphql, GraphQLSchema } from 'graphql'
import { Maybe } from 'type-graphql'

import { createSchema } from '../utils/createSchema'

interface Options {
    source: string
    variableValues?: Maybe<{
        [key: string]: any
    }>
}

let schema: GraphQLSchema

// export const gCall = async ({ source, variableValues }: Options) => {
export const gCall = async ({ source }: Options) => {
    if (!schema) {
        schema = await createSchema()
    }
    return graphql({
        schema,
        source // A GraphQL language formatted string representing the requested operation
        // variableValues
/** variableValues: A mapping of variable name to runtime value to use for all 
 * variables defined in the requestString. */
    })
}
