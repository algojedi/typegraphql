import { AppUser } from '../../entity/AppUser'
import { Mutation, Arg, Resolver } from 'type-graphql'
import { redis } from '../../redis'

@Resolver()
export class ConfirmUserResolver {
    @Mutation(() => Boolean)
    async confirmUser(@Arg('token') token: string): Promise<boolean> {
        const userId = await redis.get(token)

        if (!userId) {
            return false
        }
        await AppUser.update({ id: parseInt(userId, 10) }, { confirmed: true })
        // erase confirmation token as user should not be able to click link twice
        await redis.del(token)
        return true
    }
}
