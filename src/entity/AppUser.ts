import { IsEmail, Length } from 'class-validator'
import { IsEmailAlreadyExist } from '../../src/modules/app-user/register/isEmailAlreadyExist'
import { ObjectType, Field, Root } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

// @Field is for graphql types and @Column is for typeorm to save to our db
@ObjectType()
@Entity()
export class AppUser extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column()
    @Length(1,30)
    firstName: string

    @Field()
    @Column()
    @Length(1,30)
    lastName: string

    @Field()
    @Column('text', { unique: true })
    @IsEmail()
    @IsEmailAlreadyExist({ message: 'email already in use'})
    email: string

    @Field()
    name(@Root() parent: AppUser) : string { // function name must match field to be resolved
        return `${parent.firstName + ' ' + parent.lastName}`
    }

    @Column()
    @Length(1,20)
    password: string
}
