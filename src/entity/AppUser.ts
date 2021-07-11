import { ObjectType, Field } from 'type-graphql'
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
    firstName: string

    @Field()
    @Column()
    lastName: string

    @Field()
    @Column('text', { unique: true })
    email: string

    @Field()
    name: string

    @Column()
    password: string
}
