import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({nullable: false})
  name: string
  
  @Column({nullable: false})
  bio: string

  @Column({nullable: false})
  picture: string
 
  @Column({nullable: false})
  birth_date: string

  @Column()
  location: string

  @Column()
  userId: string

  @OneToOne(() => User, user => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User
}