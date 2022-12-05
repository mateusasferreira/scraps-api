import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne } from 'typeorm'
import { Follow } from './Follow'
import { Profile } from './Profile'
import { RefreshToken } from './RefreshToken'
import { Scrap } from './Scrap'
import { Permission } from './Permission'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({unique: true, nullable: false})
  username: string
  
  @Column({unique: true, nullable: false})
  email: string
  
  @Column({nullable: false})
  password_hash: string
  
  @CreateDateColumn()
  created_at: string

  @OneToMany(() => RefreshToken, token => token.user, {cascade: true})
  token: RefreshToken[]

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile

  @OneToMany(() => Scrap, scrap => scrap.sender)
  scraps_sent: Scrap[]

  @OneToMany(() => Scrap, scrap => scrap.receiver)
  scraps_received: Scrap[]

  @OneToMany(() => Follow, follow => follow.follower)
  following: Follow[]

  @OneToMany(() => Follow, follow => follow.following)
  followedBy: Follow[]

  permissions?: Permission
}