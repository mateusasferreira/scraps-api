import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Profile {
  @OneToOne(() => User, user => user.profile, { primary: true })
  @JoinColumn({ name: 'id' })
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

}