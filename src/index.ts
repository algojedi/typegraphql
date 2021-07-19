import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { redis } from './redis'

// below snippet is needed so that userId can be added to the session object during auth
// declare module 'express-session' {
//     export interface SessionData {
//         userId: number
//     }
// }

const main = async () => {
    await createConnection()
    const schema = await buildSchema({
        // resolvers: [LoginResolver, RegisterResolver, MeResolver, ConfirmUserResolver],
        // rather than have an array resolvers, better to just tell typegraphql
        // where the resolvers can be found:
        resolvers: [__dirname + '/modules/**/*.ts'],
        // the below authChecker will only be called on resolvers with @Authenticated()
        authChecker: ({ context: { req } }) => {
            // has access to the same args as resolvers
            // if (req.session.userId) return true
            // return false -- abbreviated to the one line below
            return !!req.session.userId
        }
    })

    const apolloServer = new ApolloServer({
        schema,
        // context gives us access to the req object through apollo ?
        // the context is made accessible through @Ctx annotation
        context: ({ req }: any) => ({ req })
    })

    const app = express()

    const RedisStore = connectRedis(session)

    app.use(
        cors({
            credentials: true,
            origin: 'http://localhost:3000'
        })
    )

    app.use(
        session({
            store: new RedisStore({
                client: redis as any
            }),
            name: 'qid',
            secret: 'lousySecret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
            }
        })
    )
    apolloServer.applyMiddleware({ app })

    const PORT = 4000
    app.listen(process.env.PORT || PORT, () => {
        console.log('server started on http://localhost:4000/graphql')
    })
}

main()
