import { Resolver, Query, Ctx } from 'type-graphql'
import { AppUser } from '../../entity/AppUser'
import { MyContext } from '../../types/context'

// just an endpoint for a user with a auth cookie to get his/her info

@Resolver()
export class MeResolver {
    @Query(() => AppUser, { nullable: true })
    async me(@Ctx() ctx: MyContext): Promise<AppUser | undefined> {
        if (!ctx.req.session!.userId) {
            return undefined
        }

        return AppUser.findOne(ctx.req.session!.userId)
    }
}
