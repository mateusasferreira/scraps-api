import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Profile {
  @PrimaryColumn({unique: true, nullable: false})
  id: string

  @Column({nullable: false})
  name: string
  
  @Column({nullable: false})
  bio: string
 
  @Column({nullable: false})
  birth_date: string

  @Column()
  location: string

  @OneToOne(() => User)
    @JoinColumn()
    user: User;
}