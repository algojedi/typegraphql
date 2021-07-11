import { ApolloServer } from 'apollo-server-express'
import * as express from 'express'
import { buildSchema } from 'type-graphql'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { RegisterResolver } from './modules/app-user/register';


const main = async () => {

	await createConnection()
    const schema = await buildSchema({
        resolvers: [RegisterResolver]
    })

    const apolloServer = new ApolloServer({ schema })

    const app = express()

    apolloServer.applyMiddleware({ app })

    const PORT = 4000
    app.listen(process.env.PORT || PORT, () => {
        console.log('server started on http://localhost:4000/graphql')
    })
}

main()
