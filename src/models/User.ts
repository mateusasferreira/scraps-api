import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne } from 'typeorm'
import { Profile } from './Profile'
import { RefreshTokens } from './RefreshTokens'
import { Scrap } from './Scrap'

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

  @Column({default: false})
  confirmed: boolean;
  
  @CreateDateColumn()
  created_at: string

  @OneToMany(() => RefreshTokens, token => token.user, {cascade: true})
  token: RefreshTokens[]

  @OneToOne(() => Profile, profile => profile.id)
  profile: Profile

  @OneToMany(() => Scrap, scrap => scrap.sender, {onDelete: 'SET NULL'})
  scraps_sent: string

  @OneToMany(() => Scrap, scrap => scrap.receiver, {onDelete: 'SET NULL'})
  scraps_received: string
}