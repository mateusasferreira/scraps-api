import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm'
import { RefreshTokens } from './RefreshTokens'

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
}