import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../../types/context'

// we have access to all the args that will eventually get passed to resolvers
export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if (!context.req.session!.userId) {
        throw new Error('not authenticated')
    }

    return next()
}
